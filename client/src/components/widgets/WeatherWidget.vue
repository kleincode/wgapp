<template>
  <Widget title="Weather">
    <span class="display-3">{{ convertedTemperature }}</span>
    <span class="display-1" style="vertical-align: top;">
      {{ displayTemperatureUnit }}</span
    >
    <div class="overline">{{ condition }} | Last update: {{ lastUpdate }}</div>
  </Widget>
</template>

<script>
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
    condition: "..."
  }),
  computed: {
    ...mapState("userSettings", ["locale", "temperatureUnit"]),
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
    locale(val) {
      this.initLocale(val);
    }
  },
  mounted() {
    this.initLocale(this.locale);
    this.update();
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
    update() {
      fetch(
        "https://api.openweathermap.org/data/2.5/weather?zip=07745,de&appid=2384b68bf977a346118c65ada1b0bd93",
        {
          method: "GET",
          cache: "no-cache"
        }
      )
        .then(res => res.json())
        .then(resjson => {
          let time = new Date();
          this.temperature = resjson.main.temp;
          this.condition = resjson.weather[0].main;
          this.lastUpdate = this.timeFormatter.format(time);
        });
    }
  }
};
</script>
