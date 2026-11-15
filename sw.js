// Retira el service worker antic (Workbox amb memòria cau). Ha de ser a /sw.js perquè els navegadors
// que ja el tenen instal·lat hi comproven si hi ha una versió nova. No guarda res a la memòria cau.
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((key) => /workbox|llar-sant-pau-prod/.test(key)).map((key) => caches.delete(key)));

      await self.registration.unregister();

      // Es recarrega cada pestana una sola vegada: un cop desregistrat, la pàgina ja no té aquest SW
      // i no es torna a activar, així que no hi ha bucle.
      const windows = await self.clients.matchAll({ type: 'window' });
      await Promise.all(windows.map((client) => client.navigate(client.url).catch(() => {})));
    })(),
  );
});
