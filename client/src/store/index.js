import Vue from "vue";
import Vuex from "vuex";
import axios from "./axios";

import UserSettingsModule from "./userSettings.module";
import TasksModule from "./tasks.module";
import ShoppingModule from "./shopping.module";

Vue.use(Vuex);

let store = new Vuex.Store({
  state: {
    userToken: localStorage.getItem("auth_token"),
    userEmail: localStorage.getItem("user_email"),
    userFirstName: localStorage.getItem("user_firstname"),
    userLastName: localStorage.getItem("user_lastname"),
    snackbarShow: false,
    snackbarMessage: "",
    householdUsers: {},
    updateAvailable: null,
    serviceWorker: null,
    offline: false,
    profilePictureData: null
  },
  mutations: {
    login_success(state, [email, token]) {
      state.userEmail = email;
      state.userToken = token;
      localStorage.setItem("auth_token", token);
    },
    update_user(state, [email, firstname, lastname]) {
      state.userEmail = email;
      state.userFirstName = firstname;
      state.userLastName = lastname;
    },
    logout(state) {
      state.userToken = "";
      state.userEmail = "";
      state.userFirstName = "";
      state.userLastName = "";
    },
    show_snackbar(state, message) {
      state.snackbarMessage = message;
      state.snackbarShow = true;
    },
    update_snackbar(state, visible) {
      state.snackbarShow = visible;
    },
    update_household_users(state, users) {
      state.householdUsers = users;
    },
    update_available(state, callback) {
      state.updateAvailable = callback;
    },
    set_service_worker(state, sw) {
      state.serviceWorker = sw;
    },
    set_offline(state, offline) {
      state.offline = offline;
    },
    set_profile_picture(state, data) {
      state.profilePictureData = data;
    }
  },
  actions: {
    async authorize({ commit }) {
      try {
        const { data } = await axios({
          url: "/_/user",
          method: "GET"
        });
        if (data.success)
          commit("update_user", [data.email, data.firstname, data.lastname]);
        else commit("logout");
      } catch (err) {
        console.error("Error while authorizing user", err);
        commit("logout");
      }
    },
    async login({ commit }, userData) {
      const { data } = await axios({
        url: "/_/login",
        method: "POST",
        data: userData
      });
      if (data.success) commit("login_success", [data.email, data.token]);
      else throw data.message;
      return data.redirect || "";
    },
    /* returns false if user does not belong to any household */
    async fetchHouseholdUsers({ commit }) {
      try {
        const { data } = await axios({
          url: "/_/fetchusers",
          method: "GET"
        });
        if (data.success) commit("update_household_users", data.data);
        else {
          commit("update_household_users", {});
          return false;
        }
      } catch (err) {
        console.error("Error while fetching household users", err);
      }
      return true;
    },
    async fetchProfileImg({ commit }) {
      try {
        const { data, headers } = await axios.get("/_/fetchprofilepicture", {
          responseType: "arraybuffer"
        });
        if (
          headers &&
          headers["content-type"] !== "application/json; charset=utf-8"
        ) {
          const buffer = Buffer.from(data, "binary").toString("base64");
          const imageSource = `data:${headers["content-type"]};base64,${buffer}`;
          commit("set_profile_picture", imageSource);
        }
      } catch (err) {
        commit("set_profile_picture", null);
        console.warn(err);
      }
    },
    logout({ commit }) {
      commit("logout");
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_email");
      localStorage.removeItem("user_firstname");
      localStorage.removeItem("user_lastname");
      //x-access-token header needs to be removed elsewhere!
    },
    showSnackbar({ commit }, message) {
      commit("show_snackbar", message);
    }
  },
  getters: {
    isAuthorized(state) {
      return !!state.userToken;
    },
    getUserName: state => uid => {
      let user = state.householdUsers[uid];
      if (!user) return "Unknown user";
      let userName = "";
      if (user.firstname) userName += user.firstname;
      if (user.firstname && user.lastname) userName += " ";
      if (user.lastname) userName += user.lastname;
      return userName || "Nameless user";
    },
    getUserInitials: state => uid => {
      let user = state.householdUsers[uid];
      if (!user) return "??";
      let userName = "";
      if (user.firstname) userName += user.firstname.substr(0, 1).toUpperCase();
      if (user.lastname) userName += user.lastname.substr(0, 1).toUpperCase();
      return userName;
    },
    hasProfilePicture: state => !!state.profilePictureData,
    //Returns IDs of all household users
    getHouseholdUserIDs: state =>
      Object.keys(state.householdUsers).map(id => parseInt(id)),
    // Returns an array of objects suitable for items in a vuetify select
    getHouseholdUsersAsItemList: state => {
      let users = [];
      Object.entries(state.householdUsers).forEach(([key, user]) => {
        if (!user) return "Unknown user";
        let userName = "";
        if (user.firstname) userName += user.firstname;
        if (user.firstname && user.lastname) userName += " ";
        if (user.lastname) userName += user.lastname;
        users.push({ value: parseInt(key), text: userName || "Nameless user" });
      });
      return users;
    },
    isUpdateAvailable: state => {
      return !!state.updateAvailable;
    },
    isServiceWorkerRegistered: state => {
      return !!state.serviceWorker;
    }
  },
  modules: {
    userSettings: UserSettingsModule,
    tasks: TasksModule,
    shopping: ShoppingModule
  }
});

// Offline checkers
window.addEventListener("online", () => store.commit("set_offline", false));
window.addEventListener("offline", () => store.commit("set_offline", true));

export default store;
