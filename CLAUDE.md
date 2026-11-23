# Llar Sant Pau (web)

Web estàtica de les colonies Llar Sant Pau, generada amb Nuxt.

## Stack

Nuxt 4 (Vue 3, TypeScript) amb Node 26 LTS (versions fixades), `ssr: false` i prerenderitzat de les 7 rutes. Generació estàtica a `docs/` (ignorat per git).

- Estils: SCSS amb `sass` i Tailwind 4 (`app/assets/styles/`); les mides de `$mq`, `$device` i `$screen` són mixins SCSS (`variables/_breakpoints.scss`). Sense Google Fonts: les tipografies són a `public/fonts/`.
- `<html lang>` és `en`, com a la web publicada: amb `ca` Chromium canvia la tipografia de reserva de la «·» i el menú no coincideix.
- `node_modules`, `.nuxt` i `.output` queden a l'arrel, ignorats per git.

## Comandes

Tot amb Docker; no cal Node a la màquina.

- Compilar: `HOST_UID=$(id -u) HOST_GID=$(id -g) docker compose --profile build run --rm build` (fa `npm ci`, `npm run lint` i `npm run generate`; el resultat queda a `docs/`)
- Obrir: `docker compose up -d web` i anar a http://127.0.0.1:8081/ (només escolta a 127.0.0.1)
- Aturar: `docker compose down`
- Lint: `npm run lint`

El projecte no té tests unitaris: les proves són les de `tests/validacio/`.

## Estructura

- app/ codi de la web (pàgines, components, dades, estils)
- public/ estàtics que es copien tal qual a la sortida (`CNAME`, `.nojekyll`, tipografies, imatges)
- tests/validacio/ proves de Playwright, amb `package.json` propi
- scripts/valida.sh validació de cap a cap
- docs/ sortida generada per `nuxt generate` (no es versiona)

## Regles

- Aquest repo només té un `origin` local; no s'hi afegeix cap altre remot.
- No fer mai push, PR ni canvis a GitHub: un push a `master` o `main` publica la web de producció.
- No canviar dependències (`package.json`, `package-lock.json`) sense justificar-ho.
- Codi en anglès; commits, documentació i comentaris en català.
- El repo és públic: no escriure detalls de vulnerabilitats ni identificadors d'avisos de seguretat.
- Commits petits.

## Validació

`scripts/valida.sh` diu si la web funciona. Fa un build net amb Docker (`npm ci`, lint i generate), comprova la sortida de `docs/` (`CNAME` amb el domini, `200.html`, `index.html` de les 7 rutes, pes < 1 GB), extreu la referència i passa les proves de Playwright. Surt amb codi diferent de 0 si res falla. Tot amb Docker; no cal Node.

- Executar: `scripts/valida.sh` (amb `VALIDA_SKIP_BUILD=1` s'aprofita el `docs/` existent).
- Referència: `origin/gh-pages` extret amb `git archive` a `.referencia/` (ignorat per git; no es versiona cap captura).
- Servidors: nginx (`tests/validacio/nginx.conf`) imita Pages: `/ruta` fa 301 a `/ruta/`, una ruta inexistent dona 404. No es fa cap petició a producció.
- Proves (`tests/validacio/`, amb `package.json` propi i Playwright 1.49.1 fixat a la imatge): per ruta i en mòbil i escriptori, codi 200, sense errors de consola, sense recursos propis fallats i amb imatges carregades; navegació pel menú; comparació visual amb la referència; retirada del service worker antic (`sw-*.spec.js`).
- Dades de contacte: el bloc de `/contacte` (`.contact__info`) i la columna «Contacte» del peu queden fora de la comparació amb la referència (`hideContactData` a `helpers.js`, aplicada igual a la web i a la referència a `text`, `enllacos`, `visual` i `layout`). Les cobreix `contacte.spec.js`, que té els valors escrits a la prova: en canviar les dades a `app/data/contact.ts` cal canviar-les també allà.
- Tolerància visual: píxel diferent si el color s'allunya més de 0,1 (pixelmatch) i fins a un 0,5 % de píxels diferents; la mida de la pàgina ha de coincidir. Animacions aturades.
- Les proves `sw-*.spec.js` permeten service workers (la resta els bloquegen) i serveixen la sortida des d'un servidor a `localhost` dins la prova, perquè `http://pages` no és un context segur. El Workbox del CDN es substitueix per una còpia mínima local.
- `tests/validacio/` i `.referencia/` queden fora de `npm run lint` (`.prettierignore` i `eslint.config.mjs`).
- El contenidor de Playwright treballa en una còpia de `tests/validacio/` dins del contenidor: el directori es munta només de lectura i el seu `node_modules` no queda dins del repo.

## SEO

- Font única: `app/data/seo.ts` (títol de fins a 60 caràcters, descripció de 70 a 160 i ruta de les 7 rutes; dades del negoci i JSON-LD `LodgingBusiness`, només a la portada i només amb dades confirmades: capacitat de 76 places, confirmada per la casa el 2026-11-23, i sense adreça completa).
- Com es generen: la web és `ssr: false` i l'HTML de totes les rutes és el mateix i buit, per això el hook `prerender:generate` de `nuxt.config.ts` injecta a cada HTML `<title>`, `description`, `canonical`, Open Graph, `twitter:card` i el JSON-LD, **abans** de calcular la CSP (el JSON-LD és un `<script>` en línia i en queda el hash). Cada pàgina fa també `useHead(seoHead('/ruta'))`, perquè el títol canviï en navegar i les etiquetes substitueixin les injectades. `200.html` té el títol i la descripció de la portada, sense `canonical` ni `og:url`.
- URL canònica: `https://coloniesllarsantpau.com/<ruta>/`, amb barra final.
- Fitxers a `public/`: `robots.txt`, `sitemap.xml` (les 7 URL canòniques) i `compartir/llar-sant-pau.jpg` (1200×630, retallada de la foto de la portada, sense metadades). En afegir una ruta, cal afegir-la a `seoRoutes`, al sitemap, a `routes.js` i a `nitro.prerender.routes`.
- `alt`: descriptiu a les fotos de contingut (a `/fotos` ve del camp `alt` de `app/data/photos.ts`, sense repeticions) i `alt=""` a les decoratives; el logo del menú pren el nom de l'`alt` de la imatge i l'enllaç d'Instagram té `aria-label`.
- `tests/validacio/tests/seo.spec.js` cobreix, per ruta, títol, descripció, `canonical` i `og:` exactes i únics (a l'HTML sense JavaScript, al navegador i en navegar), el JSON-LD, `robots.txt`, `sitemap.xml`, la imatge i que cap `<img>` no quedi sense `alt`. Té els valors escrits a la prova: **en canviar un text a `seo.ts` cal canviar-lo també a `seo.spec.js`**. `text.spec.js` ja no compara el títol amb la referència, i `fitxers.spec.js` accepta els tres fitxers nous.
- Pendent (canvia el que es veu, no descartat): `lang="ca"`, `h1` i jerarquia de títols, pàgines noves. Cal que l'Albert validi els textos `alt` i la imatge per compartir abans de publicar.

## Workflow (CI)

En un push a `master`, el pas Deploy publica `docs/` a la branca `gh-pages`, que és la font de Pages. `public/CNAME` ha de ser a la sortida: `peaceiris` esborra el que no publica.

- Lint del workflow: `docker run --rm -v "$PWD":/r -w /r rhysd/actionlint:1.7.7`
- Executar-lo en local: `XDG_CACHE_HOME="$PWD/.eines/cache" .eines/act/act pull_request -P ubuntu-latest=ghcr.io/catthehacker/ubuntu:act-latest` (el pas Deploy omès només consta als registres amb `-v`)
- `act` (v0.2.94) es baixa a `.eines/` (ignorat per git; `valida.sh` esborra `.referencia/`, per això no hi va). Només amb l'esdeveniment `pull_request`, perquè el pas Deploy quedi omès, i mai amb cap token real.
