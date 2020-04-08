import Vue from "vue";
import VueRouter from "vue-router";
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
    component: () =>
      import(/* webpackChunkName: "dashboard" */ "../views/Dashboard.vue")
  },
  {
    path: "/finances",
    name: "Finances",
    component: () =>
      import(/* webpackChunkName: "finances" */ "../views/Finances.vue")
  },
  {
    path: "/finances/billmanager",
    name: "BillManager",
    component: () =>
      import(
        /* webpackChunkName: "finances" */ "../views/finances/BillManager.vue"
      )
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
      import(/* webpackChunkName: "settings" */ "../views/Settings.vue"),
    children: [
      {
        path: "general",
        component: () =>
          import(
            /* webpackChunkName: "settings" */ "../views/settings/GeneralSettings.vue"
          ),
        alias: "",
        name: "GeneralSettings"
      },
      {
        path: "dashboard",
        component: () =>
          import(
            /* webpackChunkName: "settings" */ "../views/settings/DashboardSettings.vue"
          ),
        name: "DashboardSettings"
      },
      {
        path: "integrations",
        component: () =>
          import(
            /* webpackChunkName: "settings" */ "../views/settings/IntegrationsSettings.vue"
          ),
        name: "IntegrationsSettings"
      }
    ]
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/household",
    name: "Manage Household",
    component: () =>
      import(
        /* webpackChunkName: "household" */ "../views/household/ManageHousehold.vue"
      )
  },
  {
    path: "/household/join",
    name: "Join Household",
    component: () =>
      import(
        /* webpackChunkName: "joinhousehold" */ "../views/household/JoinHousehold.vue"
      )
  },
  {
    path: "/household/create",
    name: "Create Household",
    component: () =>
      import(
        /* webpackChunkName: "createhousehold" */ "../views/household/CreateHousehold.vue"
      )
  },
  {
    path: "/calendar",
    name: "Calendar",
    component: () =>
      import(/* webpackChunkName: "calendar" */ "../views/Calendar.vue")
  },
  {
    path: "/shoppinglist",
    name: "ShoppingList",
    component: () =>
      import(/* webpackChunkName: "shoppinglist" */ "../views/ShoppingList.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior(to) {
    if (to.hash) {
      return { selector: to.hash };
    } else {
      return { x: 0, y: 0 };
    }
  },
  routes
});

//Authorization
router.beforeEach((to, from, next) => {
  if (to.name != "Login" && !store.getters.isAuthorized)
    next({ name: "Login", params: { redirect: to } });
  else next();
});

export default router;
