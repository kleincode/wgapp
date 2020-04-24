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
      // do nothing
    },
    registered(registration) {
      console.log("PWA installed.");
      store.commit("set_service_worker", registration);
    },
    cached() {
      // do nothing
    },
    updatefound() {
      // do nothing
    },
    updated(registration) {
      // New content available, ask for refresh
      notifyUserAboutUpdate(registration.waiting);
    },
    offline() {
      // Do nothing
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
