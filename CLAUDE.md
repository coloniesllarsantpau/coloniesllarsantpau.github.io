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

## Web nova (`app-nou/`)

Nuxt 4 amb Node 26 (fixats), `ssr: false` i prerenderitzat de les 7 rutes; sortida a `app-nou/docs/`. `node_modules`, `.nuxt` i `.output` viuen en volums Docker amb nom, mai dins del repo.

- Compilar: `HOST_UID=$(id -u) HOST_GID=$(id -g) docker compose --profile build-nou run --rm build-nou` (npm ci, lint i generate)
- Validar: `scripts/valida.sh --nou` (rutes i comparació de pàgina sencera només per a les de `tests/validacio/tests/rutes-nou.js`, inicialment cap; el menú pels 7 enllaços i `layout.spec.js`, que compara la capçalera i el peu amb la referència, sempre)
- Estils: SCSS amb `sass` i Tailwind 4 (`app/assets/styles/`); les mides de `$mq`, `$device` i `$screen` són mixins SCSS (`variables/_breakpoints.scss`). Sense Google Fonts: les tipografies són a `public/fonts/`.
- `<html lang>` és `en`, com a la web actual: amb `ca` Chromium canvia la tipografia de reserva de la «·» i el menú no coincideix.
- La web actual l'ignora (`.prettierignore`, `stylelint.config.js`, `jest.config.js`, `tsconfig.json`, `.dockerignore` i un `ContextReplacementPlugin` a `nuxt.config.ts`: l'`import()` dinàmic de `registerStores` hi inclouria qualsevol `*/index.vue`).

## Workflow (CI)

- Lint del workflow: `docker run --rm -v "$PWD":/r -w /r rhysd/actionlint:1.7.7`
- Executar-lo en local: `.eines/act/act pull_request -P ubuntu-latest=ghcr.io/catthehacker/ubuntu:act-latest`
- `act` (v0.2.94) es baixa a `.eines/` (ignorat per git; `valida.sh` esborra `.referencia/`, per això no hi va). Només amb l'esdeveniment `pull_request`, perquè el pas Deploy quedi omès, i mai amb cap token real.
