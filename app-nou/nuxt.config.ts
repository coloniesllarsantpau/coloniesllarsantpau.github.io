import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  compatibilityDate: '2026-11-01',
  modules: ['@nuxt/eslint'],
  ssr: false,
  css: ['~/assets/styles/tailwind.css', '~/assets/styles/main.scss'],
  vite: {
    plugins: [tailwindcss()],
    css: {
      preprocessorOptions: {
        scss: {
          // Variables SCSS disponibles a tots els fitxers (abans, @nuxtjs/style-resources).
          additionalData: `@use "${fileURLToPath(new URL('./app/assets/styles/variables', import.meta.url))}" as *;\n`,
        },
      },
    },
  },
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
