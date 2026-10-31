const { defineConfig } = require('@playwright/test');

const baseURL = process.env.BASE_URL || 'http://pages';

module.exports = defineConfig({
  testDir: './tests',
  outputDir: './resultats',
  reporter: [['list']],
  workers: 2,
  retries: 0,
  use: {
    baseURL,
    // El service worker de la PWA pot servir contingut de la memòria cau i amagar errors.
    serviceWorkers: 'block',
    locale: 'ca-ES',
    reducedMotion: 'reduce',
  },
  projects: [
    { name: 'mobil', use: { browserName: 'chromium', viewport: { width: 375, height: 812 }, hasTouch: true } },
    { name: 'escriptori', use: { browserName: 'chromium', viewport: { width: 1280, height: 800 } } },
  ],
});
