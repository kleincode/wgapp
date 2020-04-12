<template>
  <Widget title="Weather">
    <span class="display-3">{{ temperature }}</span>
    <span class="display-1" style="vertical-align: top;"> °C</span>
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
    temperature: "...",
    lastUpdate: "Never",
    condition: "..."
  }),
  computed: {
    ...mapState("userSettings", ["locale"])
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
          this.temperature = Math.round(resjson.main.temp - 273.15);
          this.condition = resjson.weather[0].main;
          this.lastUpdate = this.timeFormatter.format(time);
        });
    }
  }
};
</script>
