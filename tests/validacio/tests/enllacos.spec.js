const { test, expect } = require('@playwright/test');
const routes = require('./routes');
const { loadEverything, hideContactData, openContext, REF_URL } = require('./helpers');

// Enllaços, marcs i formularis de la pàgina, en ordre i amb l'atribut tal com és al DOM (mailto:, tel:, Instagram, Google Maps...).
async function destinations(browser, testInfo, base, route) {
  const context = await openContext(browser, testInfo, base);
  const page = await context.newPage();
  await page.goto(route);
  await loadEverything(page);
  await hideContactData(page, { remove: true });
  const found = await page.evaluate(() => ({
    links: [...document.querySelectorAll('a')].map((a) => ({
      href: a.getAttribute('href'),
      target: a.getAttribute('target'),
      rel: a.getAttribute('rel'),
      text: a.innerText.replace(/\s+/g, ' ').trim(),
    })),
    frames: [...document.querySelectorAll('iframe')].map((frame) => frame.getAttribute('src')),
    forms: [...document.querySelectorAll('form')].map((form) => form.getAttribute('action')),
  }));

  // Les destinacions internes han d'existir a la mateixa web; a les externes no es fa cap petició.
  const internal = [...new Set(found.links.map((link) => link.href).filter((href) => href?.startsWith('/')))];
  const statuses = {};
  for (const href of internal) {
    statuses[href] = (await context.request.get(href)).status();
  }
  await context.close();
  return { ...found, statuses };
}

for (const route of routes) {
  test(`${route}: els enllaços i les destinacions són iguals que els de la referència`, async ({
    browser,
    baseURL,
  }, testInfo) => {
    const current = await destinations(browser, testInfo, baseURL, route);
    const reference = await destinations(browser, testInfo, REF_URL, route);

    expect(reference.links.length, 'la referència té enllaços').toBeGreaterThan(0);
    expect(current).toEqual(reference);
    for (const [href, status] of Object.entries(current.statuses)) {
      expect(status, `destinació ${href}`).toBe(200);
    }
  });
}
