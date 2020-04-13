<template>
  <v-container fluid>
    <h1 class="display-2 pb-6">Settings</h1>
    <v-tabs
      v-model="tab"
      class="elevation-2"
      :vertical="$vuetify.breakpoint.mdAndUp"
    >
      <v-tabs-slider></v-tabs-slider>

      <v-tab href="#tab-user">
        User
      </v-tab>
      <v-tab href="#tab-household">
        Household
      </v-tab>
      <v-tab-item value="tab-user">
        <v-card flat tile>
          <v-card-text>
            <div class="container">
              <div class="display-1">Appearance</div>
              <v-switch v-model="darkDesign" label="Dark design"></v-switch>
              <v-divider class="mt-8 mb-8"></v-divider>
              <div class="display-1">Locale</div>
              The locale settings affect the way dates, times, and currencies
              are displayed.
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
                displaying money amounts. No conversion is applied. If your
                household is an international conglomerate, we apologize for the
                inconvenience caused by this inadequacy.
              </p>
              <v-select
                v-model="currency"
                :items="currencies"
                label="Currency"
                class="mt-3"
              ></v-select>
              <p>Sample: {{ currencySample }}</p>
              <v-divider class="mt-8 mb-8"></v-divider>

              <div class="display-1 mb-2">Dashboard</div>
              <!-- CLOCK WIDGET -->
              <div class="title pt-2">Clock Widget</div>
              <p>
                A revolutionary time-telling device. Follows the laws of special
                and general relativity.
              </p>
              <v-switch
                v-model="clockWidgetEnabled"
                label="Enable clock widget"
              ></v-switch>
              <!-- WEATHER WIDGET -->
              <div class="title pt-2">Weather Widget</div>
              <p>
                Provides you with the latest weather data using the free
                <a href="https://openweathermap.org/" target="_blank"
                  >Open Weather Map</a
                >
                API.
              </p>
              <v-switch
                v-model="weatherWidgetEnabled"
                label="Enable weather widget"
              ></v-switch>
              <v-radio-group v-model="temperatureUnit" label="Temperature unit">
                <v-radio label="°C (Celsius)" value="c"></v-radio>
                <v-radio label="°F (Fahrenheit)" value="f"></v-radio>
                <v-radio label="K (Kelvin)" value="k"></v-radio>
              </v-radio-group>
              <!-- TASKS WIDGET -->
              <div class="title pt-2">Tasks Widget</div>
              <p>
                This widget makes sure things are getting done in your home. No
                one ever dared to question its authority. (It might be useless
                at the moment, but the authority is already implemented.)
              </p>
              <v-switch
                v-model="tasksWidgetEnabled"
                label="Enable tasks widget"
              ></v-switch>

              <v-divider class="mt-8 mb-8"></v-divider>

              <div class="display-1 mb-2">Integrations</div>
              <!-- CALENDAR -->
              <div class="title pt-2">Calendar</div>
              <p>
                Keep track of your shared activites and duties using the Google
                Calendar API. If enabled, the calendar can be reached via the
                new link in your navigation drawer.
              </p>
              <v-switch
                v-model="calendarEnabled"
                label="Enable Google Calendar integration"
              ></v-switch>
              <div
                :style="{ display: $vuetify.breakpoint.mdAndUp ? 'flex' : '' }"
              >
                <v-btn
                  v-if="signInState == 2"
                  color="primary"
                  :disabled="!calendarEnabled"
                  @click="calendarSignIn"
                  >Sign in</v-btn
                >
                <v-btn
                  v-if="signInState == 1"
                  color="red"
                  :disabled="!calendarEnabled"
                  @click="calendarSignOut"
                  >Sign out</v-btn
                >
                <div :class="$vuetify.breakpoint.mdAndUp ? 'pl-4' : 'pt-4'">
                  <div class="overline">Status:</div>
                  {{ signInDescription }}
                </div>
              </div>
              <!-- PHILIPS HUE -->
              <div class="title pt-6">Philipps Hue</div>
              Coming soon (or maybe not so soon).
            </div>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item value="tab-household">
        <v-card flat tile>
          <v-card-text>
            <div class="headline">Household settings</div>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script>
import {
  handleClientLoad,
  handleAuthClick,
  signedIn,
  gapiLoaded,
  user,
  handleSignoutClick
} from "@/assets/googleCalendar.js";

export default {
  name: "Settings",
  data: () => ({
    tab: [],
    tabs: 2,
    signInDescription: "Connecting...",
    signInState: 0,
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
    calendarEnabled: {
      set(val) {
        this.$store.commit("userSettings/set_key", {
          key: "calendarEnabled",
          value: val
        });
      },
      get() {
        return this.$store.state.userSettings.calendarEnabled;
      }
    },
    weatherWidgetEnabled: {
      set(val) {
        this.$store.commit("userSettings/set_key", {
          key: "weatherWidgetEnabled",
          value: val
        });
      },
      get() {
        return this.$store.state.userSettings.weatherWidgetEnabled;
      }
    },
    clockWidgetEnabled: {
      set(val) {
        this.$store.commit("userSettings/set_key", {
          key: "clockWidgetEnabled",
          value: val
        });
      },
      get() {
        return this.$store.state.userSettings.clockWidgetEnabled;
      }
    },
    tasksWidgetEnabled: {
      set(val) {
        this.$store.commit("userSettings/set_key", {
          key: "tasksWidgetEnabled",
          value: val
        });
      },
      get() {
        return this.$store.state.userSettings.tasksWidgetEnabled;
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
  },
  watch: {
    calendarEnabled(val) {
      if (val && !this.gapiLoaded) this.loadGapi();
    }
  },
  created() {
    if (this.calendarEnabled && !gapiLoaded) this.loadGapi();
  },
  mounted() {
    this.signInState = signedIn ? 1 : 2;
    this.updateSignInDescription();
  },
  methods: {
    calendarSignIn() {
      handleAuthClick(this.onSignIn, this.onSignOut);
    },
    updateSignInDescription() {
      if (signedIn)
        this.signInDescription =
          "Signed in (" +
          (user && user.getBasicProfile
            ? user.getBasicProfile().getEmail()
            : "Unknown email") +
          ")";
      else this.signInDescription = "Not signed in";
    },
    onSignIn() {
      this.signInState = 1;
      this.updateSignInDescription();
      setTimeout(this.updateSignInDescription, 1000);
    },
    onSignOut() {
      this.signInState = 2;
      this.signInDescription = "Not signed in";
    },
    calendarSignOut() {
      handleSignoutClick(this.onSignOut);
      this.signInState = 2;
    },
    loadGapi() {
      this.signInState = 0;
      this.signInDescription = "Loading Google API...";
      const gapiscript = document.createElement("script");
      gapiscript.src = "https://apis.google.com/js/api.js?onload=onGapiload";
      window.onGapiload = () => handleClientLoad(this.onSignIn, this.onSignOut);
      document.body.appendChild(gapiscript);
    }
  }
};
</script>
