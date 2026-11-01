#!/usr/bin/env bash
# Validació de la web: build net amb Docker (npm ci, lint, tests i generate) i comprovacions de la sortida a docs/.
# Amb --nou es valida app-nou/ (lint, generate, sortida a app-nou/docs/ i només les rutes de tests/validacio/tests/rutes-nou.js).
set -euo pipefail

cd "$(dirname "$0")/.."

NOU=0
case "${1:-}" in
  "") ;;
  --nou) NOU=1 ;;
  *) echo "Ús: $0 [--nou]" >&2; exit 2 ;;
esac

DOCS="docs"
[ "$NOU" -eq 0 ] || DOCS="app-nou/docs"

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
  if [ "$NOU" -eq 1 ]; then
    # npm ci, lint i generate d'app-nou/
    HOST_UID=$(id -u) HOST_GID=$(id -g) docker compose --profile build-nou run --rm build-nou
  else
    HOST_UID=$(id -u) HOST_GID=$(id -g) docker compose --profile build run --rm build
  fi
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
  export HOST_UID=$(id -u) HOST_GID=$(id -g) DOCS_DIR="./$DOCS"
  # Web nova: rutes i visual només de les ja migrades; menú i layout (capçalera i peu) de les 7 rutes.
  [ "$NOU" -eq 0 ] || export VALIDA_NOU=1 PW_ARGS="--pass-with-no-tests rutes.spec.js visual.spec.js navegacio.spec.js layout.spec.js"
  local status=0
  docker compose --profile validacio run --rm playwright || status=$?
  # També el profile build-nou: si no, el contenidor permisos-nou queda lligat a una xarxa esborrada i la següent execució falla.
  docker compose --profile validacio --profile build-nou down > /dev/null 2>&1 || true
  [ "$status" -eq 0 ] || fail "les proves de Playwright han fallat"
}

[ "${VALIDA_SKIP_BUILD:-0}" = "1" ] || build
check_output
extract_reference
run_browser_tests
echo "OK: validació correcta"
