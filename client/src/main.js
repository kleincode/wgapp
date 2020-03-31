import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

import {
  MdApp,
  MdAvatar,
  MdBadge,
  MdButton,
  MdCard,
  MdChips,
  MdContent,
  MdDivider,
  MdDrawer,
  MdEmptyState,
  MdField,
  MdIcon,
  MdList,
  MdMenu,
  MdRadio,
  MdRipple,
  MdSnackbar,
  MdSwitch,
  MdSteppers,
  MdTabs,
  MdTable,
  MdToolbar
} from "vue-material/dist/components";

import vuetify from "./plugins/vuetify";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@mdi/font/css/materialdesignicons.css";

Vue.config.productionTip = false;
Vue.use(MdApp);
Vue.use(MdAvatar);
Vue.use(MdButton);
Vue.use(MdBadge);
Vue.use(MdCard);
Vue.use(MdChips);
Vue.use(MdContent);
Vue.use(MdDivider);
Vue.use(MdEmptyState)
Vue.use(MdDrawer);
Vue.use(MdField);
Vue.use(MdIcon);
Vue.use(MdList);
Vue.use(MdMenu);
Vue.use(MdRadio);
Vue.use(MdRipple);
Vue.use(MdSnackbar);
Vue.use(MdSwitch);
Vue.use(MdSteppers);
Vue.use(MdTable);
Vue.use(MdTabs);
Vue.use(MdToolbar);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
