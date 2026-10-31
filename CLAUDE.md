# Llar Sant Pau (web)

Web estàtica de les colonies Llar Sant Pau, generada amb Nuxt.

## Stack

Nuxt 2.15 (Vue 2, TypeScript), Tailwind, `@nuxtjs/i18n`, `@nuxtjs/pwa`, Jest. Node 14 (`node-sass@5` no compila amb versions més noves). Generació estàtica a `docs/` (ignorat per git).

## Comandes

Tot amb Docker; no cal Node a la màquina.

- Compilar: `HOST_UID=$(id -u) HOST_GID=$(id -g) docker compose --profile build run --rm build` (fa `npm ci` i `npm run generate`; el resultat queda a `docs/`)
- Obrir: `docker compose up -d web` i anar a http://127.0.0.1:8081/ (només escolta a 127.0.0.1)
- Aturar: `docker compose down`
- Lint: `npm run lint`
- Tests: `npm test`

## Estructura

- src/ codi de la web (pàgines, components, estàtics)
- locales/ traduccions
- config/ configuració
- docs/ sortida generada per `nuxt generate` (no es versiona)

## Regles

- Aquest repo només té un `origin` local; no s'hi afegeix cap altre remot.
- No fer mai push, PR ni canvis a GitHub: un push a `master` o `main` publica la web de producció.
- No canviar dependències (`package.json`, `package-lock.json`) sense justificar-ho.
- Codi en anglès; commits, documentació i comentaris en català.
- El repo és públic: no escriure detalls de vulnerabilitats ni identificadors d'avisos de seguretat.
- Commits petits.

## Validació

`scripts/valida.sh` diu si la web funciona. Fa un build net amb Docker, comprova la sortida de `docs/` (`CNAME` amb el domini, `200.html`, `index.html` de les 7 rutes, pes < 1 GB), extreu la referència i passa les proves de Playwright. Surt amb codi diferent de 0 si res falla. Tot amb Docker; no cal Node.

- Executar: `scripts/valida.sh` (amb `VALIDA_SKIP_BUILD=1` s'aprofita el `docs/` existent).
- Referència: `origin/gh-pages` extret amb `git archive` a `.referencia/` (ignorat per git; no es versiona cap captura).
- Servidors: nginx (`tests/validacio/nginx.conf`) imita Pages: `/ruta` fa 301 a `/ruta/`, una ruta inexistent dona 404. No es fa cap petició a producció.
- Proves (`tests/validacio/`, amb `package.json` propi i Playwright 1.49.1 fixat a la imatge): per ruta i en mòbil i escriptori, codi 200, sense errors de consola, sense recursos propis fallats i amb imatges carregades; navegació pel menú; comparació visual amb la referència.
- Tolerància visual: píxel diferent si el color s'allunya més de 0,1 (pixelmatch) i fins a un 0,5 % de píxels diferents; la mida de la pàgina ha de coincidir. Animacions aturades.
- `tests/validacio/` i `.referencia/` queden fora de `npm run lint` (`.prettierignore`).
- El contenidor de Playwright treballa en una còpia de `tests/validacio/` dins del contenidor: `node_modules` no pot ser dins del repo perquè el build de Nuxt recorre l'arrel i l'inclouria al bundle.
