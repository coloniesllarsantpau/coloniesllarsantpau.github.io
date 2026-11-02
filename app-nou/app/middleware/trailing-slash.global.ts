// Com el middleware trailingSlashRedirect de la web actual: Pages serveix /ruta/ i el navegador acaba a /ruta.
export default defineNuxtRouteMiddleware((to) => {
  if (to.path !== '/' && to.path.endsWith('/')) {
    return navigateTo({ path: to.path.replace(/\/+$/, ''), query: to.query, hash: to.hash });
  }
});
