#!/usr/bin/env bash
# Validació de la web: build net amb Docker (npm ci, lint i generate), comprovacions de la sortida a docs/ i proves
# de Playwright contra la referència (origin/gh-pages).
set -euo pipefail

cd "$(dirname "$0")/.."

DOCS="docs"

DOMAIN="coloniesllarsantpau.com"
ROUTES=(lacasa serveis excursions fotos collaboradors contacte)
MAX_KB=$((1024 * 1024))

fail() {
  echo "ERROR: $*" >&2
  exit 1
}

build() {
  echo "==> Build net"
  rm -rf "$DOCS"
  HOST_UID=$(id -u) HOST_GID=$(id -g) docker compose --profile build run --rm build
}

check_output() {
  echo "==> Comprovacions de $DOCS/"
  [ -f "$DOCS/CNAME" ] || fail "falta $DOCS/CNAME"
  [ "$(tr -d '\n' < "$DOCS/CNAME")" = "$DOMAIN" ] || fail "$DOCS/CNAME no conté el domini esperat"
  [ -f "$DOCS/200.html" ] || fail "falta $DOCS/200.html"
  [ -f "$DOCS/index.html" ] || fail "falta $DOCS/index.html"
  for route in "${ROUTES[@]}"; do
    [ -f "$DOCS/$route/index.html" ] || fail "falta $DOCS/$route/index.html"
  done
  local size_kb
  size_kb=$(du -sk "$DOCS" | cut -f1)
  [ "$size_kb" -lt "$MAX_KB" ] || fail "$DOCS/ pesa ${size_kb} KB (límit 1 GB)"
}

REFERENCE_BRANCH="origin/gh-pages"

extract_reference() {
  echo "==> Extracció de la referència ($REFERENCE_BRANCH)"
  git rev-parse --verify --quiet "$REFERENCE_BRANCH" > /dev/null || fail "no existeix $REFERENCE_BRANCH"
  rm -rf .referencia
  mkdir .referencia
  git archive "$REFERENCE_BRANCH" | tar -x -C .referencia
}

run_browser_tests() {
  echo "==> Proves amb Playwright"
  export HOST_UID=$(id -u) HOST_GID=$(id -g)
  local status=0
  docker compose --profile validacio run --rm playwright || status=$?
  docker compose --profile validacio down > /dev/null 2>&1 || true
  [ "$status" -eq 0 ] || fail "les proves de Playwright han fallat"
}

[ "${VALIDA_SKIP_BUILD:-0}" = "1" ] || build
check_output
extract_reference
run_browser_tests
echo "OK: validació correcta"
