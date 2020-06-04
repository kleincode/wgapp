<template>
  <v-card flat tile>
    <v-card-text>
      <div class="display-1 mb-2">{{ $t("settings.dashboard.title") }}</div>
      <!-- CLOCK WIDGET -->
      <div id="clock" class="title pt-2">
        {{ $t("settings.dashboard.clock.title") }}
      </div>
      <p>
        {{ $t("settings.dashboard.clock.description") }}
      </p>
      <v-switch
        v-model="clockWidgetEnabled"
        :label="$t('settings.dashboard.clock.enableWidget')"
      ></v-switch>
      <i18n tag="p" path="settings.dashboard.clock.localeNoteText">
        <template #note>
          <b>{{ $t("settings.dashboard.clock.note") }}</b>
        </template>
        <template #localeSettings>
          <router-link :to="{ name: 'GeneralSettings', hash: '#locale' }">{{
            $t("settings.dashboard.clock.localeSettings")
          }}</router-link>
        </template>
      </i18n>
      <!-- WEATHER WIDGET -->
      <div id="weather" class="title pt-2">
        {{ $t("settings.dashboard.weather.title") }}
      </div>
      <i18n tag="p" path="settings.dashboard.weather.description">
        <template #link>
          <a href="https://openweathermap.org/" target="_blank"
            >Open Weather Map</a
          >
        </template>
      </i18n>
      <v-switch
        v-model="weatherWidgetEnabled"
        :label="$t('settings.dashboard.weather.enableWidget')"
      ></v-switch>
      <div class="subtitle-1 pt-2">
        {{ $t("settings.dashboard.weather.apiSettingsTitle") }}
      </div>
      <i18n tag="p" path="settings.dashboard.weather.apiSignUp">
        <template #link>
          <a href="https://openweathermap.org/" target="_blank"
            >Open Weather Map</a
          >
        </template>
      </i18n>
      <v-form v-model="weatherAPIValid" @submit.prevent="weatherAPICheck">
        <v-row class="pl-2 pr-2">
          <v-col cols="12" md="6" lg="8">
            <v-text-field
              v-model="weatherAPIKey"
              :rules="rules.weatherAPIKey"
              :counter="32"
              maxlength="32"
              :label="$t('settings.dashboard.weather.apiKey')"
              required
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="6" md="3" lg="2">
            <v-text-field
              v-model="weatherZip"
              :rules="rules.weatherZip"
              :label="$t('settings.dashboard.weather.zipCode')"
              required
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="6" md="3" lg="2">
            <v-text-field
              v-model="weatherCountryCode"
              :rules="rules.weatherCountryCode"
              :label="$t('settings.dashboard.weather.countryCode')"
              required
              outlined
            ></v-text-field>
          </v-col>
        </v-row>
        <div :style="$vuetify.breakpoint.smAndDown ? '' : 'display: flex;'">
          <v-btn
            :color="['primary', 'success', 'red'][weatherAPISuccess]"
            :block="$vuetify.breakpoint.smAndDown"
            type="submit"
            class="mt-0"
            :disabled="!weatherAPIValid"
            :loading="weatherAPILoading"
            >{{ $t("commands.check") }}</v-btn
          >
          <div :class="$vuetify.breakpoint.mdAndUp ? 'pl-4' : 'pt-4'">
            <div class="overline">
              {{ $t("settings.dashboard.weather.openWeatherApi") }}
            </div>
            {{ weatherAPIStatus }}
          </div>
        </div>
      </v-form>
      <v-radio-group
        v-model="temperatureUnit"
        :label="$t('settings.dashboard.weather.temperatureUnit')"
      >
        <v-radio
          :label="`°C (${$t('general.units.celsius')})`"
          value="c"
        ></v-radio>
        <v-radio
          :label="`°F (${$t('general.units.fahrenheit')})`"
          value="f"
        ></v-radio>
        <v-radio
          :label="`K (${$t('general.units.kelvin')})`"
          value="k"
        ></v-radio>
      </v-radio-group>
      <!-- CALENDAR WIDGET -->
      <div id="calendar" class="title pt-2">
        {{ $t("settings.dashboard.calendar.title") }}
      </div>
      <p>
        {{ $t("settings.dashboard.calendar.description") }}
      </p>
      <v-switch
        v-model="calendarWidgetEnabled"
        :label="$t('settings.dashboard.calendar.enableWidget')"
      ></v-switch>
      <v-alert type="warning">
        {{ $t("settings.dashboard.calendar.activationHint") }}
      </v-alert>
      <!-- TASKS WIDGET -->
      <div id="tasks" class="title pt-2">
        {{ $t("settings.dashboard.tasks.title") }}
      </div>
      <p>
        {{ $t("settings.dashboard.tasks.description") }}
      </p>
      <v-switch
        v-model="tasksWidgetEnabled"
        :label="$t('settings.dashboard.tasks.enableWidget')"
      ></v-switch>
      <!-- FINANCES WIDGET -->
      <div id="finances" class="title pt-2">
        {{ $t("settings.dashboard.finances.title") }}
      </div>
      <p>
        {{ $t("settings.dashboard.finances.description") }}
      </p>
      <v-switch
        v-model="financesWidgetEnabled"
        :label="$t('settings.dashboard.finances.enableWidget')"
      ></v-switch>
      <!-- STATUS WIDGET -->
      <div id="status" class="title pt-2">
        {{ $t("settings.dashboard.disturb.title") }}
      </div>
      <p>
        {{ $t("settings.dashboard.disturb.description") }}
      </p>
      <v-switch
        v-model="statusWidgetEnabled"
        :label="$t('settings.dashboard.disturb.enableWidget')"
      ></v-switch>
      <!-- HOME WIDGET -->
      <div id="home" class="title pt-2">
        {{ $t("settings.dashboard.home.title") }}
      </div>
      <p>
        {{ $t("settings.dashboard.home.description") }}
      </p>
      <v-switch
        v-model="homeWidgetEnabled"
        :label="$t('settings.dashboard.home.enableWidget')"
      ></v-switch>
    </v-card-text>
  </v-card>
</template>
<script>
import axios from "axios";

export default {
  name: "DashboardSettings",
  data: () => ({
    weatherAPIValid: true,
    weatherAPIStatus: "",
    weatherAPILoading: false,
    weatherAPISuccess: 0,
    rules: {
      weatherAPIKey: [
        v => !!v || "An API key is required.",
        v =>
          (!!v && v.length == 32) ||
          "The API key should be 32 characters long.",
        v =>
          (!!v && /^[a-f0-9]*$/.test(v)) || "Key contains invalid characters."
      ],
      weatherZip: [
        v => !!v || "Empty",
        v => (!!v && /^[0-9]*$/.test(v)) || "Numbers only!"
      ],
      weatherCountryCode: [
        v => !!v || "Empty",
        v => (!!v && /^[a-zA-Z]*$/.test(v)) || "Letters only!"
      ]
    }
  }),
  computed: {
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
    financesWidgetEnabled: {
      set(val) {
        this.$store.commit("userSettings/set_key", {
          key: "financesWidgetEnabled",
          value: val
        });
      },
      get() {
        return this.$store.state.userSettings.financesWidgetEnabled;
      }
    },
    calendarWidgetEnabled: {
      set(val) {
        this.$store.commit("userSettings/set_key", {
          key: "calendarWidgetEnabled",
          value: val
        });
      },
      get() {
        return this.$store.state.userSettings.calendarWidgetEnabled;
      }
    },
    statusWidgetEnabled: {
      set(val) {
        this.$store.commit("userSettings/set_key", {
          key: "statusWidgetEnabled",
          value: val
        });
      },
      get() {
        return this.$store.state.userSettings.statusWidgetEnabled;
      }
    },
    homeWidgetEnabled: {
      set(val) {
        this.$store.commit("userSettings/set_key", {
          key: "homeWidgetEnabled",
          value: val
        });
      },
      get() {
        return this.$store.state.userSettings.homeWidgetEnabled;
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
    weatherZip: {
      set(val) {
        this.$store.commit("userSettings/set_key", {
          key: "weatherZip",
          value: val
        });
      },
      get() {
        return this.$store.state.userSettings.weatherZip;
      }
    },
    weatherCountryCode: {
      set(val) {
        this.$store.commit("userSettings/set_key", {
          key: "weatherCountryCode",
          value: val
        });
      },
      get() {
        return this.$store.state.userSettings.weatherCountryCode;
      }
    },
    weatherAPIKey: {
      set(val) {
        this.$store.commit("userSettings/set_key", {
          key: "weatherAPIKey",
          value: val
        });
      },
      get() {
        return this.$store.state.userSettings.weatherAPIKey;
      }
    }
  },
  mounted() {
    this.weatherAPIStatus = this.$t("settings.dashboard.weather.clickCheck");
  },
  methods: {
    async weatherAPICheck() {
      if (this.weatherAPIValid) {
        this.weatherAPILoading = true;
        this.weatherAPISuccess = 0;
        try {
          const { data } = await axios.get(
            "https://api.openweathermap.org/data/2.5/weather",
            {
              params: {
                zip: this.weatherZip + "," + this.weatherCountryCode,
                appid: this.weatherAPIKey
              },
              validateStatus: () => true
            }
          );
          this.weatherAPISuccess = 2;
          if (data.cod == 200) {
            this.weatherAPIStatus = this.$t(
              "settings.dashboard.weather.apiStates.success",
              { city: data.name }
            );
            this.weatherAPISuccess = 1;
          } else if (data.cod == 400) {
            this.weatherAPIStatus = this.$t(
              "settings.dashboard.weather.apiStates.badRequest",
              { message: data.message }
            );
          } else if (data.cod == 401) {
            this.weatherAPIStatus = this.$t(
              "settings.dashboard.weather.apiStates.invalidKey"
            );
          } else if (data.cod == 404) {
            this.weatherAPIStatus = this.$t(
              "settings.dashboard.weather.apiStates.cityNotFound"
            );
          } else {
            this.weatherAPIStatus = `Error ${data.cod}: ${data.message}`;
          }
        } catch (err) {
          this.weatherAPIStatus =
            "Request failed: " +
            (err && err.message
              ? err.message
              : this.$t("general.errors.unknown"));
          this.weatherAPISuccess = 2;
        }
        this.weatherAPILoading = false;
      } else {
        this.$store.dispatch(
          "showSnackbar",
          this.$t("settings.dashboard.weather.apiStates.invalidAPIData")
        );
      }
    }
  }
};
</script>
