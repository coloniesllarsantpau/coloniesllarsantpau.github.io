const { test, expect } = require('@playwright/test');

// A /lacasa/ les imatges s'amplien i apareix el text en passar-hi per sobre.
test('/lacasa/: efecte en passar per sobre de les imatges', async ({ page }) => {
  await page.goto('/lacasa/');
  await page.waitForLoadState('networkidle');

  const photo = page.locator('.sp-photo-text').first();
  const image = photo.locator('.sp-photo-text__image');
  const overlay = photo.locator('.sp-photo-text__overlay');

  await expect(overlay).toHaveCSS('opacity', '0');
  await expect(image).toHaveCSS('transform', 'none');

  await photo.hover();

  // matrix(1.2, 0, 0, 1.2, 0, 0)
  await expect(overlay).toHaveCSS('opacity', '1');
  await expect(image).toHaveCSS('transform', /^matrix\(1\.2,/);

  // El hover ha desplaçat la pàgina: es torna dalt perquè el ratolí quedi fora de la imatge.
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.mouse.move(0, 0);
  await expect(overlay).toHaveCSS('opacity', '0');
  await expect(image).toHaveCSS('transform', 'none');
});
