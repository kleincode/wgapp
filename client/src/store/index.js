import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import { PersistantStorePlugin } from "./PersistentStore";

Vue.use(Vuex);

let store = new Vuex.Store({
  state: {
    initialized: false,
    userToken: "",
    userEmail: "",
    userFirstName: "",
    userLastName: "",
    snackbarShow: false,
    snackbarMessage: "",
    householdUsers: {}
  },
  mutations: {
    async load_persistant(state, cached) {
      if (cached) {
        Object.keys(cached).forEach(key => {
          if (key in state) {
            state[key] = cached[key];
          }
        });
      }
      state.initialized = true;
    },
    login_success(state, [email, token]) {
      state.userEmail = email;
      state.userToken = token;
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
      state.householdUsers = {};
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
        console.info(
          "Error while authorizing user, assuming offline or login request"
        );
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
    /* returns false if user does not belong to any household (--> please redirect to "Add Household") */
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
        console.info("Could not fetch household, assuming offline");
      }
      return true;
    },
    logout({ commit }) {
      commit("logout");
      //x-access-token header needs to be removed elsewhere!
    },
    showSnackbar({ commit }, message) {
      commit("show_snackbar", message);
    }
  },
  getters: {
    isInitialized(state) {
      return state.initialized;
    },
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
    getUserSelect: state => {
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
    }
  },
  plugins: [
    PersistantStorePlugin({
      login_success: ["userEmail", "userToken"],
      update_user: ["userEmail", "userFirstName", "userLastName"],
      logout: [
        "userToken",
        "userEmail",
        "userFirstName",
        "userLastName",
        "householdUsers"
      ],
      update_household_users: ["householdUsers"]
    })
  ]
});

export default store;
