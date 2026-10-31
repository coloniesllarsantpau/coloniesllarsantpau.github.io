const { test, expect } = require('@playwright/test');
const routes = require('./routes');
const { watchPage } = require('./helpers');

// Entra a cada ruta des del menú i torna a l'inici al final. En mòbil el logo del menú
// no té alçada visible, així que per tornar a l'inici s'usa l'enllaç visible del peu.
test('es recorren les 7 rutes des del menú', async ({ page, baseURL }) => {
  const problems = watchPage(page, baseURL);
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const toggle = page.locator('.toggle-menu');
  const expanded = page.locator('.navigation-links.expanded');

  async function navigateTo(route) {
    const mobileMenu = await toggle.isVisible();
    const path = route === '/' ? '/' : route.replace(/\/$/, '');

    if (route === '/') {
      const logo = page.locator('a.main-navigation-item[href="/"]');
      const homeLinks = (await logo.isVisible()) ? logo : page.locator('footer a[href="/"]');
      await homeLinks.first().click();
    } else {
      if (mobileMenu) {
        await toggle.click();
        await expect(expanded).toBeVisible();
      }
      await page.locator(`a.main-navigation-item[href="${path}"]`).click();
      if (mobileMenu) await expect(expanded).toHaveCount(0);
    }

    await expect(page).toHaveURL(new RegExp(`${path}/?$`));
    await expect(page.locator('main')).toBeVisible();
    await page.waitForLoadState('networkidle');
  }

  for (const route of [...routes.slice(1), '/']) {
    await navigateTo(route);
  }

  expect(problems, 'errors de consola i recursos').toEqual([]);
});
