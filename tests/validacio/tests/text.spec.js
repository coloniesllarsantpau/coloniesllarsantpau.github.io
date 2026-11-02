const { test, expect } = require('@playwright/test');
const routes = require('./rutes-totes');
const { loadEverything, openContext, REF_URL } = require('./helpers');

// Només per a app-nou/: la web actual és la mateixa que la referència.
test.skip(!process.env.VALIDA_NOU, 'només amb scripts/valida.sh --nou');

// Títol i text visible de la pàgina, línia a línia i sense espais de més.
async function visibleText(browser, testInfo, base, route) {
  const context = await openContext(browser, testInfo, base);
  const page = await context.newPage();
  await page.goto(route);
  await loadEverything(page);
  // «Item 1 of 1» del carrusel de la referència: només per a lectors de pantalla (retallat a 1 px), no es veu.
  await page.addStyleTag({ content: '.hooper-sr-only { display: none !important; }' });
  const title = await page.title();
  const text = await page.evaluate(() => document.body.innerText);
  await context.close();
  const lines = text
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
  return { title, lines };
}

for (const route of routes) {
  test(`${route}: el text visible és igual que el de la referència`, async ({ browser, baseURL }, testInfo) => {
    const current = await visibleText(browser, testInfo, baseURL, route);
    const reference = await visibleText(browser, testInfo, REF_URL, route);

    expect(reference.lines.length, 'la referència té text').toBeGreaterThan(0);
    expect(current).toEqual(reference);
  });
}
