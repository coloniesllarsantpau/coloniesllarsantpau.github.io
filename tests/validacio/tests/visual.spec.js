const { test, expect } = require('@playwright/test');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');
const routes = require('./routes');
const { loadEverything } = require('./helpers');

// Tolerància: un píxel compta com a diferent si el color s'allunya més de 0,1 (escala de
// pixelmatch, 0-1) i es tolera fins a un 0,5 % de píxels diferents (antialiàsing, subpíxels).
// Una mida de pàgina diferent és sempre un error.
const PIXEL_THRESHOLD = 0.1;
const MAX_DIFFERENT_RATIO = 0.005;

const refURL = process.env.REF_URL || 'http://referencia';

async function capture(browser, contextOptions, url) {
  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();
  await page.goto(url);
  await loadEverything(page);
  await page.evaluate(() => document.fonts.ready);
  const png = await page.screenshot({ fullPage: true, animations: 'disabled', caret: 'hide' });
  await context.close();
  return PNG.sync.read(png);
}

for (const route of routes) {
  test(`${route} és igual que la referència`, async ({ browser, baseURL }, testInfo) => {
    const options = {
      baseURL,
      viewport: testInfo.project.use.viewport,
      hasTouch: testInfo.project.use.hasTouch,
      serviceWorkers: 'block',
      reducedMotion: 'reduce',
      locale: 'ca-ES',
    };
    const current = await capture(browser, options, new URL(route, baseURL).href);
    const reference = await capture(browser, options, new URL(route, refURL).href);

    expect({ width: current.width, height: current.height }, 'mida de la pàgina').toEqual({
      width: reference.width,
      height: reference.height,
    });

    const diff = new PNG({ width: current.width, height: current.height });
    const different = pixelmatch(current.data, reference.data, diff.data, current.width, current.height, {
      threshold: PIXEL_THRESHOLD,
    });
    const ratio = different / (current.width * current.height);

    if (ratio > MAX_DIFFERENT_RATIO) {
      await testInfo.attach('diferencies', { body: PNG.sync.write(diff), contentType: 'image/png' });
    }
    expect(ratio, `píxels diferents: ${different}`).toBeLessThanOrEqual(MAX_DIFFERENT_RATIO);
  });
}
