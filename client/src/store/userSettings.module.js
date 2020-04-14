import { userSettings } from "./LocalAppStore";

// Specify all values to sync with persistent store and their default values
const syncEntries = {
  darkMode: true,
  calendarEnabled: false,
  weatherWidgetEnabled: true,
  clockWidgetEnabled: true,
  tasksWidgetEnabled: true,
  locale: null,
  temperatureUnit: "c",
  currency: "EUR",
  calendarsSelected: [],
  calendarView: "month"
};

const vuexModule = {
  namespaced: true,
  state: () => ({
    // These values are set for the short period of time before the persistent settings are fetched
    _initialized: false,
    darkMode: true,
    calendarEnabled: false,
    weatherWidgetEnabled: false,
    clockWidgetEnabled: false,
    tasksWidgetEnabled: false,
    locale: null,
    temperatureUnit: "c",
    currency: "EUR",
    calendarsSelected: [],
    calendarView: "month"
  }),
  mutations: {
    // (state, arg)
    set_initialized(state, value) {
      state._initialized = value;
    },
    set_key(state, { key, value }) {
      state[key] = value;
      userSettings.put({ key, value });
    }
  },
  actions: {
    // ({ state, commit, dispatch, getters, rootState, rootGetters })
    sync({ state, commit }) {
      if (state._initialized) return Promise.resolve();
      return Promise.all(
        Object.entries(syncEntries).map(([key, defaultValue]) =>
          userSettings.get(key).then(obj => {
            commit("set_key", {
              key,
              value: obj && "value" in obj ? obj.value : defaultValue
            });
          })
        )
      ).then(() => commit("set_initialized", true));
    }
  },
  getters: {} // (state, getters, rootState, rootGetters)
};

export default vuexModule;
