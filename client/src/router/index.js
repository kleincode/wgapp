import Vue from "vue";
import VueRouter from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Login from "../views/Login.vue";
import store from "../store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/dashboard"
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard
  },
  {
    path: "/settings",
    name: "Settings",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Settings.vue")
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if (to.name != "Login") {
    switch (store.getters.getAuthorized) {
      case "unauthorized":
        next({ name: "Login", params: { redirect: to } });
        break;
      case "authorized":
        next();
        break;
      default:
        //unchecked
        store.dispatch("authorize").then(() => {
          if (store.getters.getAuthorized == "authorized") next();
          //authorized
          else next({ name: "Login", params: { redirect: to } }); //login page
        });
        break;
    }
  } else next();
});

export default router;
