const { test, expect } = require('@playwright/test');
const routes = require('./routes');
const { loadEverything } = require('./helpers');

// Dades de contacte que la casa vol publicar. Són aquí perquè el contenidor de proves no pot llegir app/data/contact.ts.
const PERSON = 'Albert Roca Comellas';
const EMAIL = { text: 'info@coloniesllarsantpau.com', href: 'mailto:info@coloniesllarsantpau.com' };
const PHONES = [
  { text: '649 57 20 88', href: 'tel:+34649572088' },
  { text: '972 721 270', href: 'tel:+34972721270' },
];

// Text de cada línia d'un bloc, sense espais de més.
const linesOf = (locator) =>
  locator.evaluate((el) =>
    el.innerText
      .split('\n')
      .map((line) => line.replace(/\s+/g, ' ').trim())
      .filter((line) => line !== ''),
  );

const linksOf = (locator) =>
  locator.locator('a').evaluateAll((anchors) =>
    anchors.map((a) => ({ text: a.innerText.replace(/\s+/g, ' ').trim(), href: a.getAttribute('href') })),
  );

const expectedPhonesLine = PHONES.map((phone) => phone.text).join(' / ');

test('/contacte/: persona, correu i telèfons exactes, amb els enllaços de les dades', async ({ page }) => {
  await page.goto('/contacte/');
  await loadEverything(page);
  const block = page.locator('.contact__info');

  expect(await linesOf(block)).toEqual([PERSON, EMAIL.text, expectedPhonesLine]);
  expect(await linksOf(block)).toEqual([EMAIL, ...PHONES]);
});

for (const route of routes) {
  test(`${route}: el peu mostra la columna de contacte exacta`, async ({ page }) => {
    await page.goto(route);
    await loadEverything(page);
    const column = page.locator('footer .links__item').last();

    expect(await linesOf(column)).toEqual(['Contacte', expectedPhonesLine, EMAIL.text]);
    expect(await linksOf(column)).toEqual([...PHONES, EMAIL]);
  });

  test(`${route}: sense tel:undefined ni desbordament horitzontal`, async ({ page }) => {
    await page.goto(route);
    await loadEverything(page);

    const hrefs = await page.locator('a').evaluateAll((anchors) => anchors.map((a) => a.getAttribute('href')));
    expect(hrefs.filter((href) => /undefined/.test(href ?? ''))).toEqual([]);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, 'desbordament horitzontal').toBeLessThanOrEqual(0);
  });
}
