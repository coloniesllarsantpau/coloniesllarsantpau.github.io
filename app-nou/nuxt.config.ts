import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  compatibilityDate: '2026-11-01',
  modules: ['@nuxt/eslint'],
  ssr: false,
  app: {
    head: {
      title: 'Llar Sant Pau',
      // El mateix lang="en" que té la web actual (ve del manifest PWA): amb "ca" Chromium tria una altra
      // tipografia de reserva per a la «·» de «Col·laboradors» i el menú canvia d'amplada.
      htmlAttrs: { lang: 'en' },
      meta: [{ name: 'format-detection', content: 'telephone=no' }],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'stylesheet', href: '/vendor/phosphor-icons.css' },
      ],
    },
  },
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
      // La web actual no té 404.html: una ruta inexistent mostra la pàgina 404 de Pages.
      ignore: ['/404.html'],
    },
  },
});
