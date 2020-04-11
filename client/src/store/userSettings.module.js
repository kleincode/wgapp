import { userSettings } from "./LocalAppStore";

const vuexModule = {
  namespaced: true,
  state: () => ({
    _initialized: false,
    darkMode: true
  }),
  mutations: {
    // (state, arg)
    set_initialized(state, value) {
      state._initialized = value;
    },
    set_dark_mode(state, value) {
      //Don't forget to update the dark mode in any Vue component!
      console.log("Committing", value);
      state.darkMode = value;
      userSettings.put({ key: "darkMode", value });
    }
  },
  actions: {
    // ({ state, commit, dispatch, getters, rootState, rootGetters })
    sync({ state, commit }) {
      if (state._initialized) return Promise.resolve();
      return Promise.all([
        userSettings.get("darkMode").then(darkMode => {
          commit(
            "set_dark_mode",
            darkMode && "value" in darkMode ? darkMode.value : true
          );
        })
      ]).then(() => commit("set_initialized", true));
    }
  },
  getters: {} // (state, getters, rootState, rootGetters)
};

export default vuexModule;
