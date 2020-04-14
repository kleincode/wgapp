self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

// Install new service worker when user confirms update (message "skipWaiting", see registerServiceWorker.js)
self.addEventListener("message", msg => {
  if(msg.data.action == "skipWaiting") {
    self.skipWaiting();
  }
});