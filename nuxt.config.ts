import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';

// CSP per <meta> (Pages no deixa posar capçaleres). Els scripts en línia de Nuxt (importmap i window.__NUXT__)
// canvien a cada build: se'n calcula el hash a l'HTML generat en lloc de permetre 'unsafe-inline'.
// frame-ancestors, report-uri i sandbox no funcionen per <meta>.
function buildCsp(html: string): string {
  const hashes = [...html.matchAll(/<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/g)]
    .filter((match) => !/type="application\/json"/.test(match[0]))
    .map((match) => `'sha256-${createHash('sha256').update(match[1]).digest('base64')}'`);
  return [
    "default-src 'self'",
    `script-src 'self' ${hashes.join(' ')}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self' data:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');
}

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
      meta: [
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'referrer', content: 'strict-origin-when-cross-origin' },
      ],
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
  hooks: {
    'nitro:init': (nitro) => {
      nitro.hooks.hook('prerender:generate', (route) => {
        if (!route.fileName?.endsWith('.html') || !route.contents) return;
        const csp = `<meta http-equiv="Content-Security-Policy" content="${buildCsp(route.contents)}">`;
        // Just després de <meta charset>, abans de qualsevol script.
        route.contents = route.contents.replace(/(<meta charset="utf-8">)/, `$1${csp}`);
      });
    },
  },
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
