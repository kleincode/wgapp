<template>
  <v-card flat tile>
    <v-card-text>
      <div class="container">
        <div class="display-1 mb-2">
          {{ $t("settings.general.title") }}
        </div>
        <div id="appearance" class="title pt-2">
          {{ $t("settings.general.appearance.title") }}
        </div>
        <p>
          {{ $t("settings.general.appearance.exp") }}
        </p>
        <v-switch
          v-model="darkDesign"
          :label="$t('settings.general.appearance.lblDark')"
        ></v-switch>
        <!--Language-->
        <div id="language" class="title pt-2">
          {{ $t("settings.general.lang.title") }}
        </div>
        <p>
          {{ $t("settings.general.lang.exp") }}
        </p>
        <v-select
          v-model="lang"
          :items="supportedLocales"
          item-text="name"
          item-value="code"
          :label="$t('settings.general.lang.lbl')"
          @change="langChange"
        ></v-select>
        <!--Locale-->
        <div id="locale" class="title pt-2">
          {{ $t("settings.general.locale.title") }}
        </div>
        {{ $t("settings.general.locale.exp") }}
        <v-switch
          v-model="useBrowserLocale"
          :label="$t('settings.general.locale.system') + ` (${browserLocale})`"
        ></v-switch>
        <v-combobox
          v-model="customLocale"
          :label="$t('settings.general.locale.custom')"
          chips
          :items="locales"
          persistent-hint
          :hint="$t('settings.general.locale.customHint')"
          class="pt-0"
          :return-object="false"
        ></v-combobox>
        <p class="pt-3">
          {{ $t("settings.general.locale.desc") }}
        </p>
        <v-select
          v-model="currency"
          :items="currencies"
          :label="$t('settings.general.locale.cur')"
          class="mt-3"
        ></v-select>
        <p>{{ $t("settings.general.locale.sample") }}: {{ currencySample }}</p>

        <!-- Notifications -->
        <div id="notifications" class="title pt-2">
          {{ $t("settings.general.notifications.title") }}
        </div>
        <p>{{ $t("settings.general.notifications.exp") }}</p>
        <notification-controller></notification-controller>

        <div id="introduction" class="title pt-2">
          {{ $t("settings.general.intro.title") }}
        </div>
        <p>
          {{ $t("settings.general.intro.exp") }}
        </p>
        <v-btn color="primary" @click="restartIntro">{{
          $t("settings.general.intro.lbl")
        }}</v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import NotificationController from "@/components/NotificationController.vue";
import { getSupportedLocales } from "@/assets/supported-locales.js";

export default {
  name: "GeneralSettings",
  components: {
    NotificationController
  },
  data: () => ({
    locales: [
      { text: "Afrikaans (Namibia)", value: "af-NA" },
      { text: "Afrikaans (South Africa)", value: "af-ZA" },
      { text: "العربية (Arabic)", value: "ar-AR" },
      { text: "Български (Bulgarian)", value: "bg-BG" },
      { text: "Català (Catalan)", value: "ca-ES" },
      { text: "Čeština (Czech)", value: "cs-CZ" },
      { text: "Dansk (Danish)", value: "da-DK" },
      { text: "Deutsch (German) (Österreich)", value: "de-AT" },
      { text: "Deutsch (German) (Schweiz)", value: "de-CH" },
      { text: "Deutsch (German) (Deutschland)", value: "de-DE" },
      { text: "Esperanto", value: "es-ES" },
      { text: "Ελληνικά (Greek)", value: "el-GR" },
      { text: "English (Australia)", value: "en-AU" },
      { text: "English (Canada)", value: "en-CA" },
      { text: "English (United Kingdom)", value: "en-GB" },
      { text: "English (Ireland)", value: "en-IE" },
      { text: "English (Pirate)", value: "en-PI" },
      { text: "English (United States)", value: "en-US" },
      { text: "Español (Spanish) (España)", value: "es-ES" },
      { text: "Español (Latinoamérica)", value: "es-LA" },
      { text: "فارسی (Persian)", value: "fa-IR" },
      { text: "Suomi (Finnish)", value: "fi-FI" },
      { text: "Français (French) (Canada)", value: "fr-CA" },
      { text: "Français (French) (France)", value: "fr-FR" },
      { text: "Français (French) (Belgique)", value: "fr-BE" },
      { text: "Français (French) (Suisse)", value: "fr-CH" },
      { text: "Hrvatski (French) (Croatian)", value: "hr-HR" },
      { text: "Magyar (Hungarian)", value: "hu-HU" },
      { text: "Italiano (Italian)", value: "it-IT" },
      { text: "日本語 (Japanese)", value: "ja-JP" },
      { text: "한국어 (韩国) (Korean)", value: "ko-KR" },
      { text: "Latin", value: "la" },
      { text: "Lëtzebuergesch (Luxembourgish)", value: "lb" },
      { text: "Nederlands (Dutch) (België)", value: "nl-BE" },
      { text: "Nederlands (Dutch) (Nederland)", value: "nl-NL" },
      { text: "Polski (Polish)", value: "pl-PL" },
      { text: "Русский (Russian)", value: "ru-RU" },
      { text: "Svenska (Swedish)", value: "sv-SE" },
      { text: "tlhIngan-Hol (Klingon)", value: "tlh" },
      { text: "Türkçe (Turkish)", value: "tr-TR" },
      { text: "Українська (Ukrainian)", value: "uk-UA" },
      { text: "Tiếng Việt (Vietnamese)", value: "vi-VN" },
      { text: "中文 (Chinese)", value: "zh" },
      { text: "中文简体 (Chinese Simplified)", value: "zh-Hans" },
      { text: "中文繁體 (Chinese Traditional)", value: "zh-Hant" }
    ],
    currencies: [
      { text: "Australian Dollar (AUD)", value: "AUD" },
      { text: "Brazilian Real (BRL)", value: "BRL" },
      { text: "Bulgarian Lev (BGN)", value: "BGN" },
      { text: "Canadian Dollar (CAD)", value: "CAD" },
      { text: "Yuan Renminbi (CNY)", value: "CNY" },
      { text: "Cuban Peso (CUP)", value: "CUP" },
      { text: "Czech Koruna (CZK)", value: "CZK" },
      { text: "Danish Krone (DKK)", value: "DKK" },
      { text: "Euro (EUR)", value: "EUR" },
      { text: "Pound Sterling (GBP)", value: "GBP" },
      { text: "Forint (HUF)", value: "HUF" },
      { text: "Indian Rupee (INR)", value: "INR" },
      { text: "Iceland Krona (ISK)", value: "ISK" },
      { text: "Yen (JPY)", value: "JPY" },
      { text: "North Korean Won (KPW)", value: "KPW" },
      { text: "Won (KRW)", value: "KRW" },
      { text: "Mexican Peso (MXN)", value: "MXN" },
      { text: "Norwegian Krone (NOK)", value: "NOK" },
      { text: "Romanian Leu (RON)", value: "RON" },
      { text: "Russian Ruble (RUB)", value: "RUB" },
      { text: "Swedish Krona (SEK)", value: "SEK" },
      { text: "Swiss Franc (CHF)", value: "CHF" },
      { text: "Zloty (PLN)", value: "PLN" },
      { text: "US-Dollar (USD)", value: "USD" },
      { text: "New-Zealand Dollar (NZD)", value: "NZD" }
    ],
    browserLocale: navigator.language
  }),
  computed: {
    supportedLocales() {
      return getSupportedLocales();
    },
    darkDesign: {
      set(val) {
        this.$store.commit("userSettings/set_key", {
          key: "darkMode",
          value: val
        });
        this.$vuetify.theme.dark = val;
      },
      get() {
        return this.$store.state.userSettings.darkMode;
      }
    },
    lang: {
      set(val) {
        this.$store.commit("userSettings/set_key", {
          key: "lang",
          value: val
        });
      },
      get() {
        return this.$store.state.userSettings.lang;
      }
    },
    useBrowserLocale: {
      set(val) {
        // if switched off, set custom locale to browser locale
        if (!val && !this.customLocale) this.customLocale = navigator.language;
        // update value in store
        this.$store.commit("userSettings/set_key", {
          key: "locale",
          value: val || !this.customLocale ? null : this.customLocale
        });
      },
      get() {
        // browser locale is used if store locale is falsy
        return !this.$store.state.userSettings.locale;
      }
    },
    customLocale: {
      set(val) {
        // this value should only be set if browser locale is not used, so commit it to store
        this.$store.commit("userSettings/set_key", {
          key: "locale",
          value: val
        });
      },
      get() {
        return this.$store.state.userSettings.locale;
      }
    },
    temperatureUnit: {
      set(val) {
        this.$store.commit("userSettings/set_key", {
          key: "temperatureUnit",
          value: val
        });
      },
      get() {
        return this.$store.state.userSettings.temperatureUnit;
      }
    },
    currency: {
      set(val) {
        this.$store.commit("userSettings/set_key", {
          key: "currency",
          value: val
        });
      },
      get() {
        return this.$store.state.userSettings.currency;
      }
    },
    currencySample() {
      return new Intl.NumberFormat(
        this.$store.state.userSettings.locale || undefined,
        {
          style: "currency",
          currency: this.currency
        }
      ).format(123456.789);
    },
    introductionState: {
      get() {
        return this.$store.state.userSettings.introductionState;
      },
      set(value) {
        this.$store.commit("userSettings/set_key", {
          key: "introductionState",
          value
        });
      }
    }
  },
  methods: {
    restartIntro() {
      this.introductionState = 1;
      this.$router.push({ path: "/dashboard" });
    },
    async langChange() {
      await this.$store.dispatch("userSettings/loadLocaleMessages");
      this.$i18n.locale = this.lang;
    }
  }
};
</script>
