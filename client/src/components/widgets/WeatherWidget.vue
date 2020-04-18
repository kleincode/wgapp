<template>
  <Widget title="Weather" :loading="loading" :error="!display">
    <template v-if="display">
      <span class="display-3">{{ convertedTemperature }}</span>
      <span class="display-1" style="vertical-align: top;">
        {{ displayTemperatureUnit }}</span
      >
      <div class="overline">
        {{ condition }} | Last update: {{ lastUpdate }}
      </div>
    </template>
    <template v-else>
      <p>This widget is not configured correctly.</p>
      <v-btn text to="/settings/dashboard">Settings</v-btn>
    </template>
  </Widget>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
import Widget from "./Widget";

export default {
  name: "WeatherWidget",
  components: {
    Widget
  },
  data: () => ({
    temperature: 0,
    lastUpdate: "Never",
    condition: "...",
    display: true,
    loading: false
  }),
  computed: {
    ...mapState("userSettings", [
      "_initialized",
      "locale",
      "temperatureUnit",
      "weatherZip",
      "weatherCountryCode",
      "weatherAPIKey"
    ]),
    displayTemperatureUnit() {
      switch (this.temperatureUnit) {
        case "c":
          return "°C";
        case "f":
          return "°F";
        default:
          return "K";
      }
    },
    convertedTemperature() {
      switch (this.temperatureUnit) {
        case "c":
          return Math.round(this.temperature - 273.15);
        case "f":
          return Math.round((this.temperature * 9) / 5 - 459.67);
        default:
          return Math.round(this.temperature);
      }
    }
  },
  watch: {
    _initialized(val) {
      if (val) {
        this.initLocale(this.locale);
        this.update();
      }
    }
  },
  mounted() {
    if (this._initialized) {
      this.initLocale(this.locale);
      this.update();
    }
    this.clockIntervalID = setInterval(() => this.update(), 5 * 60 * 1000);
  },
  beforeDestroy() {
    clearInterval(this.clockIntervalID);
  },
  methods: {
    initLocale(locale) {
      // Initialize locale settings
      if (locale) locale = [locale, "en-US"];
      // in case the saved locale is invalid, en-US is backup
      else locale = undefined;
      this.timeFormatter = new Intl.DateTimeFormat(locale, {
        hour: "numeric",
        minute: "2-digit"
      });
    },
    async update() {
      this.loading = true;
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
        if (data.cod == 200) {
          let time = new Date();
          this.temperature = data.main.temp;
          this.condition = data.weather[0].main;
          this.lastUpdate = this.timeFormatter.format(time);
          this.display = true;
        } else {
          this.display = false;
        }
      } catch (err) {
        // ignore, offline
      }
      this.loading = false;
    }
  }
};
</script>
