const { test, expect } = require('@playwright/test');
const routes = require('./routes');
const { loadEverything } = require('./helpers');

// Metadades de cercadors i xarxes socials. Els valors són escrits aquí a propòsit: en canviar un text a
// app/data/seo.ts cal canviar-lo també aquí. Es comprova l'HTML tal com el rep un robot (sense executar JavaScript) i
// el DOM del navegador, després de carregar i de navegar entre rutes.
const SITE = 'https://coloniesllarsantpau.com';
const IMAGE = `${SITE}/compartir/llar-sant-pau.jpg`;
const IMAGE_ALT = 'Façana de pedra de la masia de la casa de colònies Llar Sant Pau, amb el campanar al darrere';

const EXPECTED = {
  '/': {
    title: 'Llar Sant Pau | Casa de colònies a Sant Pau de Segúries',
    description:
      'Llar Sant Pau és una casa de colònies a Sant Pau de Segúries, al Ripollès, amb cuina casolana, piscina i molt espai per a escoles, esplais i grups.',
  },
  '/lacasa/': {
    title: 'La casa | Llar Sant Pau, casa de colònies al Ripollès',
    description:
      'Coneix la casa de colònies Llar Sant Pau: tres plantes amb dormitoris de 14, 26 i 28 llits, sales per a activitats, edificis annexos i cuina-menjador.',
  },
  '/serveis/': {
    title: 'Serveis | Llar Sant Pau, casa de colònies amb piscina',
    description:
      'Serveis de la casa de colònies Llar Sant Pau: piscina, tobogan aquàtic, camp multiesports, barbacoes, wifi i projector, equip de música i més.',
  },
  '/excursions/': {
    title: 'Excursions | Llar Sant Pau, colònies al Ripollès',
    description:
      'Excursions des de la casa de colònies Llar Sant Pau: la Via Romana, la Ruta del Ferro i del Carbó, la vall de Camprodon, Vallter 2000 i Molló Parc.',
  },
  '/fotos/': {
    title: 'Fotos de la casa | Llar Sant Pau, colònies al Ripollès',
    description:
      'Galeria de fotos de la casa de colònies Llar Sant Pau, a Sant Pau de Segúries: dormitoris, sales, cuina, menjadors, banys, piscina i entorns.',
  },
  '/collaboradors/': {
    title: 'Col·laboradors | Llar Sant Pau, casa de colònies',
    description:
      'La casa de colònies Llar Sant Pau ofereix activitats per a grups a través d’empreses externes col·laboradores. Aquí en trobareu algunes.',
  },
  '/contacte/': {
    title: 'Contacte i reserves | Llar Sant Pau, casa de colònies',
    description:
      'Contacta amb la casa de colònies Llar Sant Pau, a Sant Pau de Segúries, per fer reserves i demanar més informació: telèfon i correu electrònic.',
  },
};

// Etiquetes esperades (sense el títol), com a parelles [clau, valor] ordenades.
function expectedTags(route) {
  const { title, description } = EXPECTED[route];
  const tags = {
    description,
    'og:title': title,
    'og:description': description,
    'og:type': 'website',
    'og:locale': 'ca_ES',
    'og:site_name': 'Llar Sant Pau',
    'og:image': IMAGE,
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:image:alt': IMAGE_ALT,
    'twitter:card': 'summary_large_image',
  };
  tags['og:url'] = `${SITE}${route}`;
  return tags;
}

// Llegeix les etiquetes d'un fragment d'HTML (sense executar res): { titles, tags: {clau: [valors]}, canonicals }.
function parseHead(html) {
  const head = html.slice(0, html.indexOf('</head>'));
  const decode = (v) => v.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  const titles = [...head.matchAll(/<title>([\s\S]*?)<\/title>/g)].map((m) => decode(m[1]));
  const tags = {};
  for (const m of head.matchAll(/<meta\s+(name|property)="([^"]*)"\s+content="([^"]*)"\s*>/g)) {
    (tags[m[2]] ||= []).push(decode(m[3]));
  }
  const canonicals = [...head.matchAll(/<link\s+rel="canonical"\s+href="([^"]*)"\s*>/g)].map((m) => decode(m[1]));
  return { titles, tags, canonicals };
}

function checkHead(parsed, route, { fallback = false } = {}) {
  const key = fallback ? '/' : route;
  expect(parsed.titles).toEqual([EXPECTED[key].title]);
  const wanted = expectedTags(key);
  if (fallback) delete wanted['og:url'];
  // Només les etiquetes de SEO; viewport, referrer i format-detection no hi entren. Cap no pot sortir dues vegades.
  const actual = Object.fromEntries(Object.entries(parsed.tags).filter(([k]) => k in wanted || k.startsWith('og:')));
  expect(actual).toEqual(Object.fromEntries(Object.entries(wanted).map(([k, v]) => [k, [v]])));
  expect(parsed.canonicals).toEqual(fallback ? [] : [`${SITE}${route}`]);
}

test('els 7 títols i les 7 descripcions són diferents i dins de les mides', () => {
  const entries = Object.values(EXPECTED);
  expect(entries).toHaveLength(7);
  expect(new Set(entries.map((e) => e.title)).size).toBe(7);
  expect(new Set(entries.map((e) => e.description)).size).toBe(7);
  for (const { title, description } of entries) {
    expect(title.length).toBeLessThanOrEqual(60);
    expect(title).toContain('Llar Sant Pau');
    expect(description.length).toBeGreaterThanOrEqual(70);
    expect(description.length).toBeLessThanOrEqual(160);
  }
});

for (const route of routes) {
  test(`${route}: metadades a l'HTML, sense executar JavaScript`, async ({ request }) => {
    const res = await request.get(route);
    expect(res.status()).toBe(200);
    checkHead(parseHead(await res.text()), route);
  });

  test(`${route}: una sola còpia de cada metadada al navegador`, async ({ page }) => {
    await page.goto(route);
    await loadEverything(page);
    await expectDom(page, route);
  });
}

test('200.html: títol i descripció de la portada, sense canonical ni og:url', async ({ request }) => {
  const res = await request.get('/200.html');
  expect(res.status()).toBe(200);
  checkHead(parseHead(await res.text()), '/', { fallback: true });
});

test('en navegar entre rutes, les metadades canvien i no s’acumulen', async ({ page }) => {
  await page.goto('/');
  await loadEverything(page);
  for (const route of [...routes.slice(1), '/']) {
    await page.evaluate((path) => {
      const app = document.querySelector('#__nuxt').__vue_app__;
      return app.config.globalProperties.$router.push(path);
    }, route);
    await expect(page).toHaveTitle(EXPECTED[route].title);
    await expectDom(page, route);
  }
});

async function expectDom(page, route) {
  const dom = await page.evaluate(() => ({
    titles: [...document.querySelectorAll('title')].map((e) => e.textContent),
    metas: [...document.head.querySelectorAll('meta[name], meta[property]')].map((e) => [
      e.getAttribute('name') || e.getAttribute('property'),
      e.getAttribute('content'),
    ]),
    canonicals: [...document.querySelectorAll('link[rel="canonical"]')].map((e) => e.getAttribute('href')),
  }));
  expect(dom.titles).toEqual([EXPECTED[route].title]);
  expect(dom.canonicals).toEqual([`${SITE}${route}`]);
  const wanted = expectedTags(route);
  for (const [key, value] of Object.entries(wanted)) {
    expect(dom.metas.filter(([k]) => k === key), key).toEqual([[key, value]]);
  }
}

test('la portada té el JSON-LD LodgingBusiness i les altres rutes no', async ({ request }) => {
  const blocks = async (route) => {
    const html = await (await request.get(route)).text();
    return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
  };
  expect(await blocks('/')).toEqual([
    {
      '@context': 'https://schema.org',
      '@type': 'LodgingBusiness',
      name: 'Llar Sant Pau',
      url: `${SITE}/`,
      image: IMAGE,
      telephone: ['+34649572088', '+34972721270'],
      email: 'info@coloniesllarsantpau.com',
      sameAs: ['https://www.instagram.com/llarsantpau'],
      address: { '@type': 'PostalAddress', addressLocality: 'Sant Pau de Segúries' },
    },
  ]);
  for (const route of routes.slice(1)) expect(await blocks(route), route).toEqual([]);
});

test('robots.txt permet tot i apunta al sitemap', async ({ request }) => {
  const res = await request.get('/robots.txt');
  expect(res.status()).toBe(200);
  const lines = (await res.text()).split('\n').map((l) => l.trim()).filter(Boolean);
  expect(lines).toEqual(['User-agent: *', 'Allow: /', `Sitemap: ${SITE}/sitemap.xml`]);
});

test('sitemap.xml té les 7 URL canòniques', async ({ request }) => {
  const res = await request.get('/sitemap.xml');
  expect(res.status()).toBe(200);
  const xml = await res.text();
  expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
  const urls = [...xml.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1]);
  expect(urls.sort()).toEqual(routes.map((r) => `${SITE}${r}`).sort());
});

test('la imatge per compartir existeix i és un JPEG', async ({ request }) => {
  const res = await request.get('/compartir/llar-sant-pau.jpg');
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('image/jpeg');
  expect((await res.body()).length).toBeLessThan(300 * 1024);
});

for (const route of routes) {
  test(`${route}: cap <img> sense atribut alt`, async ({ page }) => {
    await page.goto(route);
    await loadEverything(page);
    const missing = await page.evaluate(() =>
      [...document.querySelectorAll('img')].filter((img) => !img.hasAttribute('alt')).map((img) => img.getAttribute('src')),
    );
    expect(missing).toEqual([]);
  });
}

test('/fotos/: tots els alt són diferents i no buits', async ({ page }) => {
  await page.goto('/fotos/');
  await loadEverything(page);
  const alts = await page.locator('.photos__grid img').evaluateAll((imgs) => imgs.map((img) => img.getAttribute('alt')));
  expect(alts.length).toBeGreaterThan(0);
  expect(alts.every((alt) => alt && alt.trim())).toBe(true);
  expect(new Set(alts).size).toBe(alts.length);
});

test('el logo del menú i l’enllaç d’Instagram tenen nom accessible', async ({ page }) => {
  await page.goto('/');
  await loadEverything(page);
  const logo = page.locator('a.main-navigation-item[href="/"]');
  await expect(logo.locator('img')).toHaveAttribute('alt', 'Llar Sant Pau, inici');
  await expect(logo).not.toHaveAttribute('aria-label', /.*/);
  await expect(page.locator('footer a[href="https://www.instagram.com/llarsantpau"]')).toHaveAttribute(
    'aria-label',
    'Instagram de Llar Sant Pau',
  );
});
