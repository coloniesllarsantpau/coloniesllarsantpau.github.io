const { test, expect } = require('@playwright/test');
const routes = require('./routes');
const { loadEverything } = require('./helpers');

// Cap violació de la CSP (meta) a cap ruta: ni l'esdeveniment securitypolicyviolation ni l'error de consola.
for (const route of routes) {
  test(`${route}: cap violació de CSP`, async ({ page }) => {
    const violations = [];
    page.on('console', (msg) => {
      if (/Content Security Policy|Content-Security-Policy/i.test(msg.text())) violations.push(`consola: ${msg.text()}`);
    });
    await page.addInitScript(() => {
      document.addEventListener('securitypolicyviolation', (event) => {
        (window.__cspViolations ||= []).push(`${event.violatedDirective}: ${event.blockedURI}`);
      });
    });

    await page.goto(route);
    await loadEverything(page);
    await page.waitForTimeout(500);

    expect(await page.evaluate(() => document.querySelector('meta[http-equiv="Content-Security-Policy"]') !== null)).toBe(true);
    const events = await page.evaluate(() => window.__cspViolations || []);
    expect([...events, ...violations]).toEqual([]);
  });
}
