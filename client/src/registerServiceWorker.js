/* eslint-disable no-console */

import { register } from "register-service-worker";
import store from "./store";

// Displays an "update available" notification. When clicked by the user, the service worker is told to reload (thereby installing the update).
const notifyUserAboutUpdate = worker => {
  store.commit("update_available", () => {
    worker.postMessage({ action: "skipWaiting" });
    setTimeout(() => store.commit("update_available", null), 100);
  });
};

if (process.env.NODE_ENV === "production") {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(
        "App is being served from cache by a service worker.\n" +
          "For more details, visit https://goo.gl/AFskqB"
      );
    },
    registered() {
      console.log("Service worker has been registered.");
    },
    cached() {
      console.log("Content has been cached for offline use.");
    },
    updatefound() {
      console.log("New content is downloading.");
    },
    updated(registration) {
      console.log("New content is available; please refresh.");
      notifyUserAboutUpdate(registration.waiting);
    },
    offline() {
      console.log(
        "No internet connection found. App is running in offline mode."
      );
    },
    error(error) {
      console.error("Error during service worker registration:", error);
    }
  });
}

var refreshing;
navigator.serviceWorker.addEventListener("controllerchange", () => {
  if (refreshing) return;
  refreshing = true;
  window.location.reload();
});
