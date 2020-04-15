self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

// Install new service worker when user confirms update (message "skipWaiting", see registerServiceWorker.js)
self.addEventListener("message", msg => {
  if(msg.data.action == "skipWaiting") {
    self.skipWaiting();
  }
});

// Push Notifications
self.addEventListener("push", e => {
  console.log("[Service Worker] Push Received.");
  console.log(`[Service Worker] Push had this data: "${e.data.text()}"`);

  const title = 'WG App';
  const options = {
    body: e.data.text(),
    icon: "img/icons/android-chrome-192x192.png",
    badge: "img/icons/android-chrome-192x192.png"
  };
  e.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', e => {
  console.log('[Service Worker] Notification click received.');

  e.notification.close();

  e.waitUntil(
    clients.openWindow('https://wg.kleinco.de')
  );
});