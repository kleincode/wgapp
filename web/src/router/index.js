import Vue from "vue";
import VueRouter from "vue-router";
import goTo from "vuetify/es5/services/goto";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/legalnotice",
    name: "LegalNotice",
    component: () =>
      import(/* webpackChunkName: "h-tasks" */ "../views/LegalNotice.vue")
  },
  {
    path: "/help",
    name: "Help",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "help" */ "../views/Help.vue")
  },
  {
    path: "/help/tasks",
    name: "H-Tasks",
    component: () =>
      import(/* webpackChunkName: "h-tasks" */ "../views/help/Tasks.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior: (to, from, savedPosition) => {
    let scrollTo = 0;

    if (to.hash) {
      scrollTo = to.hash;
    } else if (savedPosition) {
      scrollTo = savedPosition.y;
    }

    return goTo(scrollTo, { offset: 64 });
  }
});

export default router;
