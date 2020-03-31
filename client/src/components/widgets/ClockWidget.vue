<template>
  <Widget title="Clock">
    <div class="md-display-3">{{ time }}</div>
    <div class="md-subheading">{{ date }}</div>
  </Widget>
</template>

<script>
import Widget from "./Widget";

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

export default {
  name: "ClockWidget",
  components: {
    Widget
  },
  data: () => ({
    time: "00:00:00",
    date: "-",
    clockIntervalID: -1
  }),
  methods: {
    tick() {
      let time = new Date();
      this.time =
        ("0" + time.getHours()).slice(-2) +
        ":" +
        ("0" + time.getMinutes()).slice(-2) +
        ":" +
        ("0" + time.getSeconds()).slice(-2);
      this.date =
        weekdays[time.getDay()] +
        " | " +
        ("0" + time.getDate()).slice(-2) +
        "." +
        ("0" + (time.getMonth() + 1)).slice(-2) +
        "." +
        "" +
        time.getFullYear();
    }
  },
  mounted() {
    this.tick();
    this.clockIntervalID = setInterval(() => this.tick(), 1000);
  },
  beforeDestroy() {
    clearInterval(this.clockIntervalID);
  }
};
</script>
