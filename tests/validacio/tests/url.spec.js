const { test, expect } = require('@playwright/test');
const routes = require('./routes');
const { watchPage, openContext, REF_URL } = require('./helpers');

// Comportament d'URL: Pages fa 301 de /ruta a /ruta/ i, un cop carregada, la web porta el navegador a /ruta.
// Les mateixes comprovacions contra la versió nova i contra la referència.
for (const [name, getBase] of [
  ['nova', (baseURL) => baseURL],
  ['referència', () => REF_URL],
]) {
  for (const route of routes.filter((route) => route !== '/')) {
    const path = route.replace(/\/$/, '');

    test(`${path} (${name}): 301 a la barra final, /ruta al navegador i recàrrega`, async ({ browser, baseURL }, testInfo) => {
      const base = getBase(baseURL);
      const context = await openContext(browser, testInfo, base);
      const page = await context.newPage();
      const problems = watchPage(page, base);

      const redirect = await context.request.get(path, { maxRedirects: 0 });
      expect(redirect.status()).toBe(301);
      expect(new URL(redirect.headers().location, base).pathname).toBe(route);
      expect((await context.request.get(route, { maxRedirects: 0 })).status()).toBe(200);

      for (const url of [path, route]) {
        const response = await page.goto(url);
        expect(response.status(), `entrar per ${url}`).toBe(200);
        // S'espera que acabi la càrrega: recarregar a mitges avortaria recursos i semblaria un error.
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(new URL(path, base).href);
        await expect(page.locator('main')).toBeVisible();

        const reloaded = await page.reload();
        expect(reloaded.status(), `recarregar des de ${url}`).toBe(200);
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(new URL(path, base).href);
        await expect(page.locator('main')).toBeVisible();
      }

      expect(problems, 'errors de consola i recursos').toEqual([]);
      await context.close();
    });
  }

  test(`/ (${name}): codi 200, sense canviar d'URL, també en recarregar`, async ({ browser, baseURL }, testInfo) => {
    const base = getBase(baseURL);
    const context = await openContext(browser, testInfo, base);
    const page = await context.newPage();
    const problems = watchPage(page, base);

    expect((await page.goto('/')).status()).toBe(200);
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(new URL('/', base).href);
    expect((await page.reload()).status()).toBe(200);
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(new URL('/', base).href);
    await expect(page.locator('main')).toBeVisible();

    expect(problems, 'errors de consola i recursos').toEqual([]);
    await context.close();
  });

  // Es compara el codi, no el contingut de la pàgina 404.
  test(`ruta inexistent (${name}): codi 404`, async ({ browser, baseURL }, testInfo) => {
    const base = getBase(baseURL);
    const context = await openContext(browser, testInfo, base);
    const page = await context.newPage();

    for (const url of ['/ruta-inexistent', '/ruta-inexistent/', '/lacasa/inexistent']) {
      expect((await context.request.get(url, { maxRedirects: 0 })).status(), url).toBe(404);
      expect((await page.goto(url)).status(), url).toBe(404);
    }
    await context.close();
  });
}
