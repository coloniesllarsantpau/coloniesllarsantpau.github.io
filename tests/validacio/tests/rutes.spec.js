const { test, expect } = require('@playwright/test');
const routes = require('./routes');
const { watchPage, loadEverything } = require('./helpers');

for (const route of routes) {
  test(`${route} carrega sense errors`, async ({ page, baseURL }) => {
    const problems = watchPage(page, baseURL);

    const response = await page.goto(route);
    expect(response.status()).toBe(200);
    await loadEverything(page);

    const brokenImages = await page.evaluate(() =>
      [...document.images].filter((img) => !img.complete || img.naturalWidth === 0).map((img) => img.currentSrc || img.src),
    );

    expect(problems, 'errors de consola i recursos').toEqual([]);
    expect(brokenImages, 'imatges no carregades').toEqual([]);
  });
}
