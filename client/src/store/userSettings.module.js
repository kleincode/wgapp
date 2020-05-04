import { userSettings } from "./LocalAppStore";

// Specify all values to sync with persistent store and their default values
const syncEntries = {
  introductionState: 1,
  darkMode: false,
  calendarEnabled: false,
  weatherWidgetEnabled: true,
  clockWidgetEnabled: true,
  tasksWidgetEnabled: true,
  financesWidgetEnabled: true,
  statusWidgetEnabled: true,
  homeWidgetEnabled: true,
  locale: null,
  temperatureUnit: "c",
  currency: "EUR",
  calendarsSelected: [],
  calendarView: "month",
  weatherZip: "10115",
  weatherCountryCode: "de",
  weatherAPIKey: ""
};

const vuexModule = {
  namespaced: true,
  state: () => ({
    // These values are set for the short period of time before the persistent settings are fetched
    _initialized: false,
    introductionState: -1,
    darkMode: false,
    calendarEnabled: false,
    weatherWidgetEnabled: false,
    clockWidgetEnabled: false,
    tasksWidgetEnabled: false,
    financesWidgetEnabled: false,
    statusWidgetEnabled: false,
    homeWidgetEnabled: false,
    locale: null,
    temperatureUnit: "c",
    currency: "EUR",
    calendarsSelected: [],
    calendarView: "month",
    weatherZip: "10115",
    weatherCountryCode: "de",
    weatherAPIKey: ""
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
  getters: {
    // (state, getters, rootState, rootGetters)
    formatTimeHM(state) {
      // Initialize locale settings
      let { locale } = state;
      if (locale) locale = [locale, "en-US"];
      // in case the saved locale is invalid, en-US is backup
      else locale = undefined;
      const timeFormatter = new Intl.DateTimeFormat(locale, {
        hour: "numeric",
        minute: "2-digit"
      });
      return date => timeFormatter.format(date);
    },
    formatTimeHMS(state) {
      // Initialize locale settings
      let { locale } = state;
      if (locale) locale = [locale, "en-US"];
      // in case the saved locale is invalid, en-US is backup
      else locale = undefined;
      const timeFormatter = new Intl.DateTimeFormat(locale, {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit"
      });
      return date => timeFormatter.format(date);
    },
    formatDateYMD(state) {
      // Initialize locale settings
      let { locale } = state;
      if (locale) locale = [locale, "en-US"];
      // in case the saved locale is invalid, en-US is backup
      else locale = undefined;
      const timeFormatter = new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      });
      return date => timeFormatter.format(date);
    },
    formatWeekday(state) {
      // Initialize locale settings
      let { locale } = state;
      if (locale) locale = [locale, "en-US"];
      // in case the saved locale is invalid, en-US is backup
      else locale = undefined;
      const timeFormatter = new Intl.DateTimeFormat(locale, {
        weekday: "long"
      });
      return date => timeFormatter.format(date);
    },
    formatCurrency(state) {
      // Initialize locale settings
      let { locale } = state;
      if (locale) locale = [locale, "en-US"];
      // in case the saved locale is invalid, en-US is backup
      else locale = undefined;
      const numberFormatter = new Intl.NumberFormat(locale, {
        style: "currency",
        currency: state.currency || "EUR"
      });
      return amount => numberFormatter.format(amount);
    },
    formatDateRelative: () => date => {
      if (date instanceof Date) date = Math.floor(date.getTime() / 1000);
      let seconds = Date.now() / 1000 - date;
      let sign = seconds < 0;
      seconds = Math.abs(seconds);
      if (seconds < 60) return "just now";
      let val = "";
      if (seconds > 60 * 60 * 24 * 7 * 5) {
        let dateThen = new Date(date),
          dateNow = new Date();
        let diffMonths = Math.abs(
          dateNow.getMonth() -
            dateThen.getMonth +
            12 * (dateNow.getFullYear() - dateThen.getFullYear())
        );
        if (diffMonths > 12) {
          val = Math.floor(diffMonths / 12) + " years";
        } else {
          if (diffMonths == 1) {
            val = diffMonths + " month";
          } else {
            val = diffMonths + " months";
          }
        }
      } else if (seconds > 60 * 60 * 24 * 7) {
        let count = Math.floor(seconds / (60 * 60 * 24 * 7));
        if (count == 1) {
          val = count + " week";
        } else {
          val = count + " weeks";
        }
      } else if (seconds > 60 * 60 * 24) {
        let count = Math.floor(seconds / (60 * 60 * 24));
        if (count == 1) {
          val = count + " day";
        } else {
          val = count + " days";
        }
      } else if (seconds > 60 * 60) {
        let count = Math.floor(seconds / (60 * 60));
        if (count == 1) {
          val = count + " hour";
        } else {
          val = count + " hours";
        }
      } else {
        let count = Math.floor(seconds / 60);
        if (count == 1) {
          val = count + " minute";
        } else {
          val = count + " minutes";
        }
      }
      if (sign) return "in " + val;
      else return val + " ago";
    }
  }
};

export default vuexModule;
