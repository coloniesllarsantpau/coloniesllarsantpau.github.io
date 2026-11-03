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

// Treu de la pàgina el bloc de contacte de /contacte (`.contact__info`) i la columna «Contacte» del peu (l'última de
// `.links`), perquè les dades de contacte ja no són les de la referència i les cobreix contacte.spec.js. Es fa igual a la
// web i a la referència. Amb `remove` s'esborren del DOM (perquè tampoc es llegeixin els <a>); si no, s'amaguen.
async function hideContactData(page, { remove = false } = {}) {
  const selectors = ['.contact__info', 'footer .links__item:last-child'];
  if (remove) {
    await page.evaluate((list) => list.forEach((sel) => document.querySelectorAll(sel).forEach((el) => el.remove())), selectors);
  } else {
    await page.addStyleTag({ content: `${selectors.join(', ')} { display: none !important; }` });
  }
}

// Tolerància de la comparació visual: un píxel compta com a diferent si el color s'allunya més
// de 0,1 (escala de pixelmatch, 0-1) i es tolera fins a un 0,5 % de píxels diferents.
const PIXEL_THRESHOLD = 0.1;
const MAX_DIFFERENT_RATIO = 0.005;

// Les dues webs que es comparen: la que es valida i la referència.
const REF_URL = process.env.REF_URL || 'http://referencia';

// Obre una pàgina nova amb les mateixes opcions que el projecte de Playwright (mòbil o escriptori).
async function openContext(browser, testInfo, baseURL) {
  return browser.newContext({
    baseURL,
    viewport: testInfo.project.use.viewport,
    hasTouch: testInfo.project.use.hasTouch,
    serviceWorkers: 'block',
    reducedMotion: 'reduce',
    locale: 'ca-ES',
  });
}

// Carpetes de la sortida nova i de la referència (muntades a docker-compose.yml).
const CURRENT_DIR = '/fitxers/nova';
const REFERENCE_DIR = '/fitxers/referencia';

module.exports = { CURRENT_DIR, REFERENCE_DIR, watchPage, loadEverything, hideContactData, openContext, REF_URL, PIXEL_THRESHOLD, MAX_DIFFERENT_RATIO };
