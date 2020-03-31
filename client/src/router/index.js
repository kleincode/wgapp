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
    path: "/finances",
    name: "Finances",
    component: () =>
      import(/* webpackChunkName: "finances" */ "../views/Finances.vue")
  },
  {
    path: "/tasks",
    name: "Tasks",
    component: () =>
      import(/* webpackChunkName: "tasks" */ "../views/Tasks.vue")
  },
  {
    path: "/tasks/edit",
    name: "Edit Task",
    component: () =>
      import(/* webpackChunkName: "tasks" */ "../views/task/EditTask.vue")
  },
  {
    path: "/settings",
    name: "Settings",
    component: () =>
      import(/* webpackChunkName: "settings" */ "../views/Settings.vue")
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/household/add",
    name: "Add Household",
    component: () =>
      import(/* webpackChunkName: "addhousehold" */ "../views/household/AddHousehold.vue")
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
