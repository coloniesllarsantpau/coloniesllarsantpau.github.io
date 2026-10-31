#!/usr/bin/env bash
# Validació de la web: build net amb Docker i comprovacions de la sortida a docs/.
set -euo pipefail

cd "$(dirname "$0")/.."

DOMAIN="coloniesllarsantpau.com"
ROUTES=(lacasa serveis excursions fotos collaboradors contacte)
MAX_KB=$((1024 * 1024))

fail() {
  echo "ERROR: $*" >&2
  exit 1
}

build() {
  echo "==> Build net"
  rm -rf docs
  HOST_UID=$(id -u) HOST_GID=$(id -g) docker compose --profile build run --rm build
}

check_output() {
  echo "==> Comprovacions de docs/"
  [ -f docs/CNAME ] || fail "falta docs/CNAME"
  [ "$(tr -d '\n' < docs/CNAME)" = "$DOMAIN" ] || fail "docs/CNAME no conté el domini esperat"
  [ -f docs/200.html ] || fail "falta docs/200.html"
  [ -f docs/index.html ] || fail "falta docs/index.html"
  for route in "${ROUTES[@]}"; do
    [ -f "docs/$route/index.html" ] || fail "falta docs/$route/index.html"
  done
  local size_kb
  size_kb=$(du -sk docs | cut -f1)
  [ "$size_kb" -lt "$MAX_KB" ] || fail "docs/ pesa ${size_kb} KB (límit 1 GB)"
}

[ "${VALIDA_SKIP_BUILD:-0}" = "1" ] || build
check_output
echo "OK: validació correcta"
