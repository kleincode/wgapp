<template>
  <v-card flat tile>
    <v-card-text>
      <div class="container">
        <div class="display-1 mb-2">General</div>
        <div id="appearance" class="title pt-2">Appearance</div>
        <p>
          Vanilla or chocolate? That's a question every worthy soldier has to
          answer for themselves. Just be careful: The blinding light might daze
          you.
        </p>
        <v-switch v-model="darkDesign" label="Dark design"></v-switch>
        <div id="locale" class="title pt-2">Locale</div>
        The locale settings affect the way dates, times, and currencies are
        displayed.
        <v-switch
          v-model="useBrowserLocale"
          :label="`Use system locale (${browserLocale})`"
        ></v-switch>
        <v-combobox
          v-model="customLocale"
          label="Custom locale"
          chips
          :items="locales"
          persistent-hint
          hint="A locale can include a language only (like en) or a specific country (like en-US)"
          class="pt-0"
          :return-object="false"
        ></v-combobox>
        <p class="pt-3">
          Note that the currency setting only changes the symbol used for
          displaying money amounts. No conversion is applied. If your household
          is an international conglomerate, we apologize for the inconvenience
          caused by this inadequacy.
        </p>
        <v-select
          v-model="currency"
          :items="currencies"
          label="Currency"
          class="mt-3"
        ></v-select>
        <p>Sample: {{ currencySample }}</p>

        <!-- Notifications -->
        <div id="notifications" class="title pt-2">Notifications</div>
        <p>Notifications remind you of important upcoming tasks.</p>
        <notification-controller></notification-controller>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import NotificationController from "@/components/NotificationController.vue";

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
    }
  }
};
</script>
