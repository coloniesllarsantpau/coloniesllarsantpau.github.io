import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import { lodgingBusinessJsonLd, seoHead } from './app/data/seo';

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

function escapeAttribute(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderTag(name: string, attributes: Record<string, string>): string {
  const rendered = Object.entries(attributes).map(([key, value]) => ` ${key}="${escapeAttribute(value)}"`);
  return `<${name}${rendered.join('')}>`;
}

// Ruta amb metadades pròpies, o undefined per al fallback (200.html).
function seoPath(route: string): string | undefined {
  if (route === '/200.html') return undefined;
  if (route === '/index.html') return '/';
  return route.length > 1 ? route.replace(/\/$/, '') : route;
}

// La web és ssr: false i l'HTML de totes les rutes és el mateix i buit: les metadades (les mateixes que fa servir
// useHead a cada pàgina) s'injecten aquí perquè els cercadors i les xarxes que no executen JavaScript les vegin.
// Substitueix el <title> genèric. Cal fer-ho abans de calcular la CSP: el JSON-LD és un <script> en línia.
function injectSeo(html: string, route: string): string {
  const path = seoPath(route);
  const head = seoHead(path);
  const tags = [
    `<title>${escapeAttribute(head.title)}</title>`,
    ...head.meta.map((meta) => renderTag('meta', meta)),
    ...head.link.map((link) => renderTag('link', link)),
  ];
  if (path === '/') {
    // Sense `<` dins del JSON, perquè no pugui tancar l'etiqueta.
    const json = JSON.stringify(lodgingBusinessJsonLd()).replace(/</g, '\\u003c');
    tags.push(`<script type="application/ld+json">${json}</script>`);
  }
  return html.replace(/<title>[\s\S]*?<\/title>/, () => tags.join(''));
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
        route.contents = injectSeo(route.contents, route.route);
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
