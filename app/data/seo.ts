// Metadades de cercadors i xarxes socials: una sola font per a l'HTML generat (hook `prerender:generate` de
// nuxt.config.ts) i per a `useHead` de cada pàgina. Si es canvia un text, cal canviar-lo també a
// tests/validacio/tests/seo.spec.js, que té els valors escrits.
import { contact } from './contact';

export const SITE_URL = 'https://coloniesllarsantpau.com';
export const SITE_NAME = 'Llar Sant Pau';
export const SHARE_IMAGE = {
  path: '/compartir/llar-sant-pau.jpg',
  width: 1200,
  height: 630,
  alt: 'Façana de pedra de la masia de la casa de colònies Llar Sant Pau, amb el campanar al darrere',
};

export interface RouteSeo {
  // Títol: fins a 60 caràcters.
  title: string;
  // Descripció: de 70 a 160 caràcters.
  description: string;
  // Ruta sense barra final, tret de la portada ('/').
  path: string;
}

export const seoRoutes: RouteSeo[] = [
  {
    path: '/',
    title: 'Llar Sant Pau | Casa de colònies a Sant Pau de Segúries',
    description:
      'Llar Sant Pau és una casa de colònies a Sant Pau de Segúries, al Ripollès, amb cuina casolana, piscina i molt espai per a escoles, esplais i grups.',
  },
  {
    path: '/lacasa',
    title: 'La casa | Llar Sant Pau, casa de colònies al Ripollès',
    description:
      'Coneix la casa de colònies Llar Sant Pau: tres plantes amb dormitoris de 14, 26 i 28 llits, sales per a activitats, edificis annexos i cuina-menjador.',
  },
  {
    path: '/serveis',
    title: 'Serveis | Llar Sant Pau, casa de colònies amb piscina',
    description:
      'Serveis de la casa de colònies Llar Sant Pau: piscina, tobogan aquàtic, camp multiesports, barbacoes, wifi i projector, equip de música i més.',
  },
  {
    path: '/excursions',
    title: 'Excursions | Llar Sant Pau, colònies al Ripollès',
    description:
      'Excursions des de la casa de colònies Llar Sant Pau: la Via Romana, la Ruta del Ferro i del Carbó, la vall de Camprodon, Vallter 2000 i Molló Parc.',
  },
  {
    path: '/fotos',
    title: 'Fotos de la casa | Llar Sant Pau, colònies al Ripollès',
    description:
      'Galeria de fotos de la casa de colònies Llar Sant Pau, a Sant Pau de Segúries: dormitoris, sales, cuina, menjadors, banys, piscina i entorns.',
  },
  {
    path: '/collaboradors',
    title: 'Col·laboradors | Llar Sant Pau, casa de colònies',
    description:
      'La casa de colònies Llar Sant Pau ofereix activitats per a grups a través d’empreses externes col·laboradores. Aquí en trobareu algunes.',
  },
  {
    path: '/contacte',
    title: 'Contacte i reserves | Llar Sant Pau, casa de colònies',
    description:
      'Contacta amb la casa de colònies Llar Sant Pau, a Sant Pau de Segúries, per fer reserves i demanar més informació: telèfon i correu electrònic.',
  },
];

export const business = {
  name: SITE_NAME,
  locality: 'Sant Pau de Segúries',
  instagram: 'https://www.instagram.com/llarsantpau',
};

// URL canònica: amb barra final, com les serveix Pages després del 301.
export function canonicalUrl(path: string): string {
  return path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}/`;
}

export function findSeo(path: string): RouteSeo {
  const seo = seoRoutes.find((route) => route.path === path);
  if (!seo) throw new Error(`Sense metadades SEO per a la ruta ${path}`);
  return seo;
}

export interface SeoHead {
  title: string;
  meta: Record<string, string>[];
  link: Record<string, string>[];
}

// Etiquetes del <head> d'una ruta. Sense `path`, és el fallback (200.html): títol i descripció de la portada, sense
// `canonical` ni `og:url`.
export function seoHead(path?: string): SeoHead {
  const seo = findSeo(path ?? '/');
  const meta = [
    { name: 'description', content: seo.description },
    { property: 'og:title', content: seo.title },
    { property: 'og:description', content: seo.description },
    ...(path ? [{ property: 'og:url', content: canonicalUrl(path) }] : []),
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: 'ca_ES' },
    { property: 'og:site_name', content: SITE_NAME },
    { property: 'og:image', content: `${SITE_URL}${SHARE_IMAGE.path}` },
    { property: 'og:image:width', content: String(SHARE_IMAGE.width) },
    { property: 'og:image:height', content: String(SHARE_IMAGE.height) },
    { property: 'og:image:alt', content: SHARE_IMAGE.alt },
    { name: 'twitter:card', content: 'summary_large_image' },
  ];
  const link = path ? [{ rel: 'canonical', href: canonicalUrl(path) }] : [];
  return { title: seo.title, meta, link };
}

// Dades estructurades de la portada. Només dades no discutides: sense capacitat ni adreça completa.
export function lodgingBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: business.name,
    url: canonicalUrl('/'),
    image: `${SITE_URL}${SHARE_IMAGE.path}`,
    telephone: contact.phones.map((phone) => phone.href.replace(/^tel:/, '')),
    ...(contact.email ? { email: contact.email } : {}),
    sameAs: [business.instagram],
    address: { '@type': 'PostalAddress', addressLocality: business.locality },
  };
}
