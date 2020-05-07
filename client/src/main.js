import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

//Vuetify
import vuetify from "./plugins/vuetify";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@mdi/font/css/materialdesignicons.css";

//Axios
import axios from "./store/axios";
import VueAxios from "vue-axios";

Vue.config.productionTip = false;

Vue.use(VueAxios, axios);

//Vue UUID
import UUID from "vue-uuid";

import i18n from "./i18n";

Vue.use(UUID);

//Authorization: load token and refresh user data on startup
const token = localStorage.getItem("auth_token");
if (token) {
  Vue.prototype.$http.defaults.headers.common["x-access-token"] = token;
  store.dispatch("authorize");
  store.dispatch("fetchHouseholdUsers");
}

//Authorization: forward to login page if 401 (unauthorized)
axios.interceptors.response.use(
  res => res,
  err => {
    if (err.response.status === 401) {
      store.dispatch("logout");
      router.push({ name: "Login" });
    }
    return err;
  }
);

// Instantiate Vue
new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount("#app");
