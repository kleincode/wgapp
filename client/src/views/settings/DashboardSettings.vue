<template>
  <v-card flat tile>
    <v-card-text>
      <div class="display-1 mb-2">Dashboard</div>
      <!-- CLOCK WIDGET -->
      <div id="clock" class="title pt-2">
        {{ $t("settings.dashboard.clock.title") }}
      </div>
      <p>
        {{ $t("settings.dashboard.clock.exp") }}
      </p>
      <v-switch
        v-model="clockWidgetEnabled"
        :label="$t('settings.dashboard.clock.lblToggle')"
      ></v-switch>
      <p>
        <b>{{ $t("settings.dashboard.clock.note") }}</b
        >{{ $t("settings.dashboard.clock.noteText") }}
        <router-link :to="{ name: 'GeneralSettings', hash: '#locale' }">{{
          $t("settings.dashboard.clock.noteLink")
        }}</router-link
        >.
      </p>
      <!-- WEATHER WIDGET -->
      <div id="weather" class="title pt-2">
        {{ $t("settings.dashboard.weather.title") }}
      </div>
      <p>
        {{ $t("settings.dashboard.weather.exp") }}
        <a href="https://openweathermap.org/" target="_blank"
          >Open Weather Map</a
        >
        API.
      </p>
      <v-switch
        v-model="weatherWidgetEnabled"
        :label="$t('settings.dashboard.weather.lblToggle')"
      ></v-switch>
      <div class="subtitle-1 pt-2">
        {{ $t("settings.dashboard.weather.title2") }}
      </div>
      <p>
        {{ $t("settings.dashboard.weather.exp2") }}
        <a href="https://openweathermap.org/" target="_blank"
          >Open Weather Map</a
        >
        {{ $t("settings.dashboard.weather.exp3") }}
      </p>
      <v-form v-model="weatherAPIValid" @submit.prevent="weatherAPICheck">
        <v-row class="pl-2 pr-2">
          <v-col cols="12" md="6" lg="8">
            <v-text-field
              v-model="weatherAPIKey"
              :rules="rules.weatherAPIKey"
              :counter="32"
              maxlength="32"
              :label="$t('settings.dashboard.weather.key')"
              required
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="6" md="3" lg="2">
            <v-text-field
              v-model="weatherZip"
              :rules="rules.weatherZip"
              :label="$t('settings.dashboard.weather.zip')"
              required
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="6" md="3" lg="2">
            <v-text-field
              v-model="weatherCountryCode"
              :rules="rules.weatherCountryCode"
              :label="$t('settings.dashboard.weather.country')"
              required
              outlined
            ></v-text-field>
          </v-col>
        </v-row>
        <div style="display: flex;">
          <v-btn
            :color="['primary', 'success', 'red'][weatherAPISuccess]"
            type="submit"
            class="mt-0 ml-2"
            :disabled="!weatherAPIValid"
            :loading="weatherAPILoading"
            >{{ $t("commands.check") }}</v-btn
          >
          <div :class="$vuetify.breakpoint.mdAndUp ? 'pl-4' : 'pt-4'">
            <div class="overline">
              {{ $t("settings.dashboard.weather.open") }}
            </div>
            {{ weatherAPIStatus }}
          </div>
        </div>
      </v-form>
      <v-radio-group
        v-model="temperatureUnit"
        :label="$t('settings.dashboard.weather.unit')"
      >
        <v-radio label="°C (Celsius)" value="c"></v-radio>
        <v-radio label="°F (Fahrenheit)" value="f"></v-radio>
        <v-radio label="K (Kelvin)" value="k"></v-radio>
      </v-radio-group>
      <!-- TASKS WIDGET -->
      <div id="tasks" class="title pt-2">
        {{ $t("settings.dashboard.tasks.title") }}
      </div>
      <p>
        {{ $t("settings.dashboard.tasks.exp") }}
      </p>
      <v-switch
        v-model="tasksWidgetEnabled"
        :label="$t('settings.dashboard.tasks.lblToggle')"
      ></v-switch>
      <!-- FINANCES WIDGET -->
      <div id="finances" class="title pt-2">
        {{ $t("settings.dashboard.finances.title") }}
      </div>
      <p>
        {{ $t("settings.dashboard.finances.exp") }}
      </p>
      <v-switch
        v-model="financesWidgetEnabled"
        :label="$t('settings.dashboard.finances.lblToggle')"
      ></v-switch>
      <!-- STATUS WIDGET -->
      <div id="status" class="title pt-2">
        {{ $t("settings.dashboard.disturb.title") }}
      </div>
      <p>
        {{ $t("settings.dashboard.disturb.exp") }}
      </p>
      <v-switch
        v-model="statusWidgetEnabled"
        :label="$t('settings.dashboard.disturb.lblToggle')"
      ></v-switch>
      <!-- HOME WIDGET -->
      <div id="home" class="title pt-2">
        {{ $t("settings.dashboard.home.title") }}
      </div>
      <p>
        {{ $t("settings.dashboard.home.exp") }}
      </p>
      <v-switch
        v-model="homeWidgetEnabled"
        :label="$t('settings.dashboard.home.lblToggle')"
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
    weatherAPIStatus: "Click 'Check' to make an API test call.",
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
            this.weatherAPIStatus = `Successful (city name: ${data.name})`;
            this.weatherAPISuccess = 1;
          } else if (data.cod == 400) {
            this.weatherAPIStatus = `Bad request data: ${data.message}`;
          } else if (data.cod == 401) {
            this.weatherAPIStatus = `Invalid API key.`;
          } else if (data.cod == 404) {
            this.weatherAPIStatus = `City or country not found.`;
          } else {
            this.weatherAPIStatus = `Error ${data.cod}: ${data.message}`;
          }
        } catch (err) {
          this.weatherAPIStatus =
            "Request failed: " +
            (err && err.message ? err.message : "Unknown error");
          this.weatherAPISuccess = 2;
        }
        this.weatherAPILoading = false;
      } else {
        this.$store.dispatch("showSnackbar", "Invalid API data.");
      }
    }
  }
};
</script>
