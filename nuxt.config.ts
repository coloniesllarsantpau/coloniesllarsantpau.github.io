import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  compatibilityDate: '2026-11-01',
  modules: ['@nuxt/eslint'],
  ssr: false,
  app: {
    head: {
      title: 'Llar Sant Pau',
      // El mateix lang="en" que té la web publicada (venia del manifest PWA): amb "ca" Chromium tria una altra
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
      // La mateixa carpeta de sortida que abans (docs/): és el publish_dir del workflow.
      publicDir: fileURLToPath(new URL('./docs', import.meta.url)),
    },
    prerender: {
      routes: ['/', '/lacasa', '/serveis', '/excursions', '/fotos', '/collaboradors', '/contacte'],
      // Sense 404.html: una ruta inexistent mostra la pàgina 404 de Pages.
      ignore: ['/404.html'],
    },
  },
});
