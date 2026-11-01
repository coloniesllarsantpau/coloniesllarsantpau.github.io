import { fileURLToPath } from 'node:url';

export default defineNuxtConfig({
  compatibilityDate: '2026-11-01',
  modules: ['@nuxt/eslint'],
  ssr: false,
  devtools: { enabled: false },
  telemetry: false,
  nitro: {
    preset: 'static',
    output: {
      // .output és un volum Docker: no es pot esborrar l'arrel, només el seu contingut.
      dir: fileURLToPath(new URL('./.output/nitro', import.meta.url)),
      // Mateixa carpeta de sortida que la web actual (docs/), perquè publish_dir no canviï.
      publicDir: fileURLToPath(new URL('./docs', import.meta.url)),
    },
    prerender: {
      routes: ['/', '/lacasa', '/serveis', '/excursions', '/fotos', '/collaboradors', '/contacte'],
    },
  },
});
