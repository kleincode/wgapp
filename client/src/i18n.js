import Vue from "vue";
import VueI18n from "vue-i18n";
//import { supportedLocalesInclude } from "@/assets/supported-locales.js";

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || "en",
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || "en",
  messages: {}
});

const loadedLanguages = [];

export function loadLocaleMessagesAsync(locale) {
  if (loadedLanguages.length > 0 && i18n.locale === locale) {
    return Promise.resolve(locale);
  }

  // If the language was already loaded
  if (loadedLanguages.includes(locale)) {
    i18n.locale = locale;
    return Promise.resolve(locale);
  }

  // If the language hasn't been loaded yet
  return import(
    /* webpackChunkName: "locale-[request]" */ `@/locales/${locale}.json`
  ).then(messages => {
    i18n.setLocaleMessage(locale, messages.default);

    loadedLanguages.push(locale);

    i18n.locale = locale;

    return Promise.resolve(locale);
  });
}

loadLocaleMessagesAsync("en");

export default i18n;
