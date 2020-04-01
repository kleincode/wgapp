<template>
  <Widget title="Weather">
    <span class="display-3">{{ temperature }}</span>
    <span class="display-1" style="vertical-align: top;"> °C</span>
    <div class="overline">
      {{ condition }} | Last update: {{ lastUpdate }}
    </div>
  </Widget>
</template>

<script>
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
  methods: {
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
          this.lastUpdate =
            ("0" + time.getHours()).slice(-2) +
            ":" +
            ("0" + time.getMinutes()).slice(-2);
        });
    }
  },
  mounted() {
    this.update();
    this.clockIntervalID = setInterval(() => this.update(), 5 * 60 * 1000);
  },
  beforeDestroy() {
    clearInterval(this.clockIntervalID);
  }
};
</script>
