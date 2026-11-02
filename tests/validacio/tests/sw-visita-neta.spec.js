const { test, expect } = require('@playwright/test');
const routes = require('./routes');
const { startServer } = require('./servidor');
const { CURRENT_DIR, loadEverything } = require('./helpers');

// Amb els service workers permesos i en un context segur (localhost); si no, la prova no provaria res.
test.use({ serviceWorkers: 'allow' });

let server;
test.beforeAll(async () => {
  server = await startServer(CURRENT_DIR);
});
test.afterAll(async () => {
  await server.close();
});

for (const route of routes) {
  test(`${route}: una visita neta no registra cap service worker ni carrega res de cdn.jsdelivr.net`, async ({
    page,
    context,
  }) => {
    const requested = [];
    context.on('request', (request) => requested.push(request.url()));

    await page.goto(`${server.url}${route}`);
    await loadEverything(page);
    await page.waitForTimeout(1000);

    const found = await page.evaluate(async () => ({
      secure: window.isSecureContext && 'serviceWorker' in navigator,
      registrations: (await navigator.serviceWorker.getRegistrations()).length,
      caches: await caches.keys(),
      controller: navigator.serviceWorker.controller !== null,
    }));
    expect(found.secure, 'context segur amb suport de service workers').toBe(true);
    expect(found.registrations).toBe(0);
    expect(found.caches).toEqual([]);
    expect(found.controller).toBe(false);
    expect(context.serviceWorkers()).toEqual([]);
    expect(requested.filter((url) => url.includes('cdn.jsdelivr.net'))).toEqual([]);
    expect(requested.some((url) => url.startsWith(server.url))).toBe(true);
  });
}
