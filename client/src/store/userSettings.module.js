import { userSettings } from "./LocalAppStore";

const vuexModule = {
  namespaced: true,
  state: () => ({
    _initialized: false,
    darkMode: true,
    calendarEnabled: false
  }),
  mutations: {
    // (state, arg)
    set_initialized(state, value) {
      state._initialized = value;
    },
    set_dark_mode(state, value) {
      //Don't forget to update the dark mode in any Vue component!
      state.darkMode = value;
      userSettings.put({ key: "darkMode", value });
    },
    set_calendar_enabled(state, value) {
      state.calendarEnabled = value;
      userSettings.put({ key: "calendarEnabled", value });
    }
  },
  actions: {
    // ({ state, commit, dispatch, getters, rootState, rootGetters })
    sync({ state, commit }) {
      if (state._initialized) return Promise.resolve();
      return Promise.all([
        userSettings.get("darkMode").then(obj => {
          commit("set_dark_mode", obj && "value" in obj ? obj.value : true);
        }),
        userSettings.get("calendarEnabled").then(obj => {
          commit(
            "set_calendar_enabled",
            obj && "value" in obj ? obj.value : false
          );
        })
      ]).then(() => commit("set_initialized", true));
    }
  },
  getters: {} // (state, getters, rootState, rootGetters)
};

export default vuexModule;
