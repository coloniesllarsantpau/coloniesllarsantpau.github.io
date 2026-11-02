const { test, expect } = require('@playwright/test');
const { startServer } = require('./servidor');
const { CURRENT_DIR, REFERENCE_DIR } = require('./helpers');

// Els service workers només funcionen en contextos segurs (localhost) i el config global els bloqueja.
test.use({ serviceWorkers: 'allow' });

// El sw.js antic carrega Workbox de cdn.jsdelivr.net: aquí se substitueix per una còpia mínima i local,
// perquè la prova no depengui de la xarxa. Crea les memòries cau que feia Workbox (workbox-precache-v2-* i workbox-runtime-*).
const WORKBOX_STUB = `
self.workbox = {
  setConfig() {},
  core: {
    setCacheNameDetails() {},
    skipWaiting() { self.skipWaiting(); },
    clientsClaim() { self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim())); },
  },
  precaching: {
    cleanupOutdatedCaches() {},
    precacheAndRoute() {
      self.addEventListener('install', (e) =>
        e.waitUntil(
          caches.open('workbox-precache-v2-' + self.registration.scope)
            .then((cache) => cache.put('/?standalone=true', new Response('antic'))),
        ),
      );
    },
  },
  routing: {
    registerRoute() {
      self.addEventListener('install', (e) =>
        e.waitUntil(caches.open('workbox-runtime-' + self.registration.scope)),
      );
    },
  },
  strategies: { CacheFirst: class {}, NetworkFirst: class {} },
};
`;

async function state(page) {
  return page.evaluate(async () => ({
    registrations: (await navigator.serviceWorker.getRegistrations()).map((r) => ({
      script: (r.active || r.waiting || r.installing)?.scriptURL,
      state: (r.active || r.waiting || r.installing)?.state,
    })),
    caches: await caches.keys(),
    scripts: [...document.querySelectorAll('script[src]')].map((s) => s.getAttribute('src')),
  }));
}

test('un visitant amb el service worker antic el perd i veu la versió nova', async ({ browser }, testInfo) => {
  const server = await startServer(REFERENCE_DIR);
  const context = await browser.newContext({
    viewport: testInfo.project.use.viewport,
    hasTouch: testInfo.project.use.hasTouch,
    serviceWorkers: 'allow',
    reducedMotion: 'reduce',
    locale: 'ca-ES',
  });
  const cdnRequests = [];
  await context.route(/cdn\.jsdelivr\.net/, (route) => {
    cdnRequests.push(route.request().url());
    return route.fulfill({ contentType: 'text/javascript', body: WORKBOX_STUB });
  });

  try {
    const page = await context.newPage();

    // Visita amb la versió antiga: el SW antic s'instal·la i s'activa.
    await page.goto(`${server.url}/`);
    await page.evaluate(() => navigator.serviceWorker.ready);
    await expect.poll(async () => (await state(page)).registrations).toEqual([
      { script: `${server.url}/sw.js`, state: 'activated' },
    ]);
    const before = await state(page);
    expect(before.caches.length, 'el SW antic ha creat memòries cau de Workbox').toBeGreaterThan(0);
    expect(before.caches).toEqual([expect.stringMatching(/^workbox-precache-v2-/), expect.stringMatching(/^workbox-runtime-/)]);
    expect(cdnRequests.length, 'el SW antic ha carregat Workbox').toBeGreaterThan(0);

    // Es publica la versió nova al mateix origen i es torna a visitar.
    server.serveix(CURRENT_DIR);
    let loads = 0;
    page.on('load', () => loads++);
    await page.goto(`${server.url}/`);

    await expect.poll(async () => (await state(page)).registrations, { timeout: 15000 }).toEqual([]);

    // Esperem que s'assenti: el SW nou recarrega la pestanya una sola vegada i no es repeteix.
    await page.waitForTimeout(3000);
    const loadsWhenSettled = loads;
    expect(loadsWhenSettled, 'una visita i, com a màxim, una recàrrega del SW').toBeLessThanOrEqual(2);
    await page.waitForTimeout(3000);
    expect(loads, 'cap recàrrega més, sense bucle').toBe(loadsWhenSettled);

    const after = await state(page);
    expect(after.registrations).toEqual([]);
    expect(after.caches).toEqual([]);

    // La pàgina és la nova: els seus scripts són els de la sortida nova i no els de la referència.
    const html = (dir) => require('fs').readFileSync(`${dir}/index.html`, 'utf8');
    const scriptsOf = (dir) => [...html(dir).matchAll(/<script[^>]* src="([^"]+)"/g)].map((m) => m[1]);
    const expected = scriptsOf(CURRENT_DIR);
    expect(expected.length).toBeGreaterThan(0);
    expect(expected).not.toEqual(scriptsOf(REFERENCE_DIR));
    expect(after.scripts).toEqual(expected);
  } finally {
    await context.close();
    await server.close();
  }
});
