import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userAuthorized: false,
    userChecked: false,
    userEmail: "",
    userFirstName: "",
    userLastName: ""
  },
  mutations: {
    login_success(state, email) {
      state.userAuthorized = true;
      state.userEmail = email;
    },
    update_user(state, [email, firstname, lastname]) {
      state.userEmail = email;
      state.userFirstName = firstname;
      state.userLastName = lastname;
      state.userChecked = true;
      state.userAuthorized = true;
    },
    logout(state) {
      state.userAuthorized = false;
      state.userChecked = true;
      state.userEmail = "";
      state.userFirstName = "";
      state.userLastName = "";
    }
  },
  actions: {
    authorize({ commit }) {
      return new Promise(resolve => {
        fetch("/_/user")
          .then(res => res.json())
          .then(resjson => {
            if (resjson.success)
              commit("update_user", [
                resjson.email,
                resjson.firstname,
                resjson.lastname
              ]);
            else commit("logout");
            resolve();
          })
          .catch(err => {
            //User not authorized
            console.err("Error while authorizing user", err);
            commit("logout");
            resolve();
          });
      });
    }
  },
  getters: {
    getAuthorized(state) {
      if (!state.userChecked) return "unchecked";
      else if (state.userAuthorized) return "authorized";
      else return "unauthorized";
    }
  }
});
