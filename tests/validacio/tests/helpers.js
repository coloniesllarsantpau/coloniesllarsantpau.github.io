// Recull errors de consola, excepcions i recursos propis fallats d'una pàgina.
function watchPage(page, baseURL) {
  const problems = [];
  const origin = new URL(baseURL).origin;

  page.on('console', (msg) => {
    if (msg.type() === 'error') problems.push(`consola: ${msg.text()}`);
  });
  page.on('pageerror', (err) => problems.push(`excepció: ${err.message}`));
  page.on('requestfailed', (req) => {
    if (req.url().startsWith(origin)) problems.push(`recurs fallat: ${req.url()} (${req.failure()?.errorText})`);
  });
  page.on('response', (res) => {
    if (res.url().startsWith(origin) && res.status() >= 400) problems.push(`recurs ${res.status()}: ${res.url()}`);
  });

  return problems;
}

// Recorre la pàgina perquè es carreguin les imatges mandroses i espera que acabi la xarxa.
async function loadEverything(page) {
  await page.waitForLoadState('networkidle');
  await page.evaluate(async () => {
    const step = Math.max(window.innerHeight / 2, 200);
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 100));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForLoadState('networkidle');
}

// Tolerància de la comparació visual: un píxel compta com a diferent si el color s'allunya més
// de 0,1 (escala de pixelmatch, 0-1) i es tolera fins a un 0,5 % de píxels diferents.
const PIXEL_THRESHOLD = 0.1;
const MAX_DIFFERENT_RATIO = 0.005;

module.exports = { watchPage, loadEverything, PIXEL_THRESHOLD, MAX_DIFFERENT_RATIO };
