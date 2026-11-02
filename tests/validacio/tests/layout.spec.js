const { test, expect } = require('@playwright/test');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');
const routes = require('./routes');
const { loadEverything, PIXEL_THRESHOLD, MAX_DIFFERENT_RATIO } = require('./helpers');

// Només la capçalera (menú) i el peu del layout, amb el contingut de les pàgines amagat; la pàgina
// sencera es compara a visual.spec.js.

const refURL = process.env.REF_URL || 'http://referencia';
// `align`: per què les alçades poden diferir 1 px (la posició fraccionària del peu a la referència,
// per l'alçada del contingut de dalt) i quin cantó es conserva: el peu s'alinea per sota.
const parts = {
  capcalera: { selector: '.main-navigation', align: 'top' },
  peu: { selector: 'footer', align: 'bottom' },
};
const MAX_HEIGHT_DIFFERENCE = 1;

// Retalla la imatge més alta perquè coincideixi amb l'altra, conservant el cantó alineat.
function cropHeight(png, height, align) {
  if (png.height === height) return png;
  const cropped = new PNG({ width: png.width, height });
  const offset = align === 'bottom' ? png.height - height : 0;
  PNG.bitblt(png, cropped, 0, offset, png.width, height, 0, 0);
  return cropped;
}

async function capture(browser, contextOptions, url) {
  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();
  await page.goto(url);
  await loadEverything(page);
  await page.evaluate(() => document.fonts.ready);
  // Sense el contingut de la pàgina, el peu queda a la mateixa posició a les dues webs; si no, la
  // posició fraccionària que li dona l'alçada del contingut de la referència canvia l'antialiasing.
  await page.addStyleTag({ content: '.main-section > :not(footer) { display: none !important; }' });
  const result = {};
  for (const [name, { selector }] of Object.entries(parts)) {
    const png = await page.locator(selector).first().screenshot({ animations: 'disabled', caret: 'hide' });
    result[name] = PNG.sync.read(png);
  }
  await context.close();
  return result;
}

for (const route of routes) {
  test(`${route}: capçalera i peu són iguals que la referència`, async ({ browser, baseURL }, testInfo) => {
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

    // A l'escriptori de la portada el menú se superposa a la foto del contingut, que aquí és amagat.
    const desktop = options.viewport.width >= 1024;

    for (const [name, { align }] of Object.entries(parts)) {
      if (name === 'capcalera' && desktop && route === '/') continue;

      expect(current[name].width, `amplada de ${name}`).toBe(reference[name].width);
      expect(
        Math.abs(current[name].height - reference[name].height),
        `alçada de ${name}: ${current[name].height} contra ${reference[name].height}`,
      ).toBeLessThanOrEqual(MAX_HEIGHT_DIFFERENCE);

      const height = Math.min(current[name].height, reference[name].height);
      const a = cropHeight(current[name], height, align);
      const b = cropHeight(reference[name], height, align);

      const diff = new PNG({ width: a.width, height: a.height });
      const different = pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold: PIXEL_THRESHOLD });
      const ratio = different / (a.width * a.height);

      if (ratio > MAX_DIFFERENT_RATIO) {
        await testInfo.attach(`diferencies-${name}`, { body: PNG.sync.write(diff), contentType: 'image/png' });
      }
      expect(ratio, `${name}: píxels diferents: ${different}`).toBeLessThanOrEqual(MAX_DIFFERENT_RATIO);
    }
  });
}
