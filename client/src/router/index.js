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
    meta: { title: "general.appName" },
    component: () =>
      import(/* webpackChunkName: "dashboard" */ "../views/Dashboard.vue")
  },
  {
    path: "/finances",
    meta: { title: "navigation.finances" },
    component: () =>
      import(/* webpackChunkName: "finances" */ "../views/Finances.vue"),
    children: [
      {
        path: "",
        component: () =>
          import(
            /* webpackChunkName: "finances" */ "../views/finances/FinancesOverview.vue"
          ),
        name: "FinancesOverview"
      },
      {
        path: "expenses",
        component: () =>
          import(
            /* webpackChunkName: "finances" */ "../views/finances/ExpensesTable.vue"
          ),
        name: "ExpensesTable"
      },
      {
        path: "monthlycharges",
        component: () =>
          import(
            /* webpackChunkName: "finances" */ "../views/finances/MonthlyCharges.vue"
          ),
        name: "MonthlyCharges"
      }
    ]
  },
  {
    path: "/tasks",
    meta: { title: "navigation.tasks" },
    component: () =>
      import(/* webpackChunkName: "tasks" */ "../views/Tasks.vue"),
    children: [
      {
        path: "",
        name: "TasksOverview",
        component: () =>
          import(
            /* webpackChunkName: "overviewtasks" */ "../views/task/TasksOverview.vue"
          )
      },
      {
        path: "view",
        name: "ViewTasks",
        component: () =>
          import(
            /* webpackChunkName: "viewtasks" */ "../views/task/ViewTasks.vue"
          )
      },
      {
        path: "log",
        name: "TasksLog",
        component: () =>
          import(/* webpackChunkName: "taskslog" */ "../views/task/TaskLog.vue")
      }
    ]
  },
  {
    path: "/about",
    meta: { title: "general.appName" },
    name: "About",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  },
  {
    path: "/settings",
    meta: { title: "navigation.settings" },
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
    meta: { title: "general.appName" },
    component: Login
  },
  {
    path: "/resetpassword/:token?",
    name: "Reset password",
    meta: { title: "general.appName" },
    props: true,
    component: () =>
      import(
        /* webpackChunkName: "resetPassword" */ "../views/ResetPassword.vue"
      )
  },
  {
    path: "/profile",
    name: "Profile",
    meta: { title: "navigation.profile" },
    component: () =>
      import(/* webpackChunkName: "household" */ "../views/Profile.vue")
  },
  {
    path: "/household",
    name: "Manage Household",
    meta: { title: "navigation.household" },
    component: () =>
      import(
        /* webpackChunkName: "household" */ "../views/household/ManageHousehold.vue"
      )
  },
  {
    path: "/household/join",
    name: "Join Household",
    meta: { title: "general.appName" },
    component: () =>
      import(
        /* webpackChunkName: "joinhousehold" */ "../views/household/JoinHousehold.vue"
      )
  },
  {
    path: "/household/create",
    name: "Create Household",
    meta: { title: "general.appName" },
    component: () =>
      import(
        /* webpackChunkName: "createhousehold" */ "../views/household/CreateHousehold.vue"
      )
  },
  {
    path: "/calendar",
    name: "Calendar",
    meta: { title: "navigation.calendar" },
    component: () =>
      import(/* webpackChunkName: "calendar" */ "../views/Calendar.vue")
  },
  {
    path: "/shopping",
    name: "Shopping",
    meta: { title: "navigation.shopping" },
    component: () =>
      import(/* webpackChunkName: "shoppinglist" */ "../views/Shopping.vue")
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
  else if (
    !store.state.userInHousehold &&
    !(
      //Pages that are allowed without a household:
      (
        to.name == "Dashboard" ||
        to.name == "Settings" ||
        to.name == "About" ||
        to.name == "Profile" ||
        to.name == "Join Household" ||
        to.name == "Create Household"
      )
    )
  ) {
    next({ name: "Dashboard", params: { redirect: to } });
  } else next();
});

export default router;
