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
    path: "/tasks/edit/:id",
    name: "EditTask",
    component: () =>
      import(/* webpackChunkName: "tasks" */ "../views/task/EditTask.vue")
  },
  {
    path: "/tasks/add",
    name: "AddTask",
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
      import(
        /* webpackChunkName: "addhousehold" */ "../views/household/AddHousehold.vue"
      )
  },
  {
    path: "/household/create",
    name: "Create Household",
    component: () =>
      import(
        /* webpackChunkName: "createhousehold" */ "../views/household/CreateHousehold.vue"
      )
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

//Authorization
router.beforeEach((to, from, next) => {
  if (to.name != "Login" && !store.getters.isAuthorized)
    next({ name: "Login", params: { redirect: to } });
  else next();
});

export default router;
