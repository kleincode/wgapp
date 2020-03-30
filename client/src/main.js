import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import "vue-material/dist/vue-material.min.css";
import "vue-material/dist/theme/default-dark.css";

import {
  MdApp,
  MdAvatar,
  MdButton,
  MdCard,
  MdContent,
  MdDrawer,
  MdField,
  MdIcon,
  MdList,
  MdMenu,
  MdRipple,
  MdSnackbar,
  MdTabs,
  MdTable,
  MdToolbar
} from "vue-material/dist/components";

Vue.config.productionTip = false;
Vue.use(MdApp);
Vue.use(MdAvatar);
Vue.use(MdButton);
Vue.use(MdCard);
Vue.use(MdContent);
Vue.use(MdDrawer);
Vue.use(MdField);
Vue.use(MdIcon);
Vue.use(MdList);
Vue.use(MdMenu);
Vue.use(MdRipple);
Vue.use(MdSnackbar);
Vue.use(MdTable);
Vue.use(MdTabs);
Vue.use(MdToolbar);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
