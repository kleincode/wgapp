import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

let store = new Vuex.Store({
  state: {
    userToken: localStorage.getItem("auth_token"),
    userEmail: localStorage.getItem("user_email"),
    userFirstName: localStorage.getItem("user_firstname"),
    userLastName: localStorage.getItem("user_lastname"),
    snackbarShow: false,
    snackbarMessage: "",
    householdUsers: {}
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
        console.err("Error while authorizing user", err);
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
        console.err("Error while fetching household users", err);
      }
      return true;
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
  }
});

export default store;
