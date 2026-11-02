const { test, expect } = require('@playwright/test');
const { watchPage, loadEverything } = require('./helpers');

const refURL = process.env.REF_URL || 'http://referencia';

// A /fotos/ fer clic en una foto no fa res: no s'obre cap visor, no es canvia de ruta i el DOM no canvia.
// Es comprova contra la versió nova i contra la referència.
for (const [name, getBase] of [
  ['nova', (baseURL) => baseURL],
  ['referència', () => refURL],
]) {
  test(`/fotos/ (${name}): fer clic en una foto no obre res ni canvia de ruta`, async ({ browser }, testInfo) => {
    const base = getBase(testInfo.project.use.baseURL || process.env.BASE_URL || 'http://pages');
    const context = await browser.newContext({
      baseURL: base,
      viewport: testInfo.project.use.viewport,
      hasTouch: testInfo.project.use.hasTouch,
      serviceWorkers: 'block',
      locale: 'ca-ES',
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    const problems = watchPage(page, base);
    let popups = 0;
    context.on('page', () => popups++);

    await page.goto('/fotos/');
    await loadEverything(page);

    const images = page.locator('.photos__grid-item__image');
    const count = await images.count();
    expect(count).toBe(36);
    // La web actual, un cop carregada, mostra la ruta sense barra final: es compara amb la d'abans del clic.
    const initialURL = page.url();
    const before = await page.evaluate(() => document.body.innerHTML);

    for (const index of [0, 17, count - 1]) {
      const image = images.nth(index);
      await image.scrollIntoViewIfNeeded();
      await image.click();
      await page.waitForTimeout(300);
      expect(page.url()).toBe(initialURL);
    }

    expect(await page.evaluate(() => document.body.innerHTML), 'el DOM no ha de canviar').toBe(before);
    expect(popups, 'finestres noves').toBe(0);
    expect(problems, 'errors de consola i recursos').toEqual([]);
    await context.close();
  });
}
