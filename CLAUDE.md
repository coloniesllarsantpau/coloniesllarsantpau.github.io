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
- src/     codi de la web (pàgines, components, estàtics)
- locales/ traduccions
- config/  configuració
- docs/    sortida generada per `nuxt generate` (no es versiona)

## Regles
- Aquest repo només té un `origin` local; no s'hi afegeix cap altre remot.
- No fer mai push, PR ni canvis a GitHub: un push a `master` o `main` publica la web de producció.
- No canviar dependències (`package.json`, `package-lock.json`) sense justificar-ho.
- Codi en anglès; commits, documentació i comentaris en català.
- El repo és públic: no escriure detalls de vulnerabilitats ni identificadors d'avisos de seguretat.
- Commits petits.
