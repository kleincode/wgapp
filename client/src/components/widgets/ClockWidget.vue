<template>
  <Widget
    title="Clock"
    with-footer
    :context-items="contextItems"
    @context-action="contextAction"
  >
    <span class="display-3">{{ time }}</span>
    <span class="display-1" style="vertical-align: baseline;">{{
      timeSuffix
    }}</span>
    <template #footer>{{ weekday }} | {{ date }}</template>
  </Widget>
</template>

<script>
import { mapState } from "vuex";
import Widget from "./Widget";

export default {
  name: "ClockWidget",
  components: {
    Widget
  },
  data: () => ({
    time: "00:00:00",
    date: "-",
    weekday: "-",
    clockIntervalID: -1,
    timeSuffix: "",
    contextItems: [
      {
        action: "settings",
        text: "Widget Settings",
        icon: "settings"
      }
    ]
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
    // Initialize clock
    this.initLocale(this.locale);
    // Start ticking
    this.tick();
    this.clockIntervalID = setInterval(() => this.tick(), 1000);
  },
  beforeDestroy() {
    clearInterval(this.clockIntervalID);
  },
  methods: {
    initLocale(locale) {
      if (locale) locale = [locale, "en-US"];
      // in case the saved locale is invalid, en-US is backup
      else locale = undefined;
      this.timeFormatter = new Intl.DateTimeFormat(locale, {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit"
      });
      this.dateFormatter = new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      });
      this.weekdayFormatter = new Intl.DateTimeFormat(locale, {
        weekday: "long"
      });
      //refresh immediately
      this.tick();
    },
    tick() {
      let now = new Date();
      let time = this.timeFormatter.format(now);
      if (time.endsWith(" PM") || time.endsWith(" AM")) {
        this.time = time.substr(0, time.length - 3);
        this.timeSuffix = time.substr(time.length - 3);
      } else {
        this.time = time;
        this.timeSuffix = "";
      }
      this.weekday = this.weekdayFormatter.format(now);
      this.date = this.dateFormatter.format(now);
    },
    contextAction(item) {
      switch (item.action) {
        case "settings":
          this.$router.push({ name: "DashboardSettings", hash: "#clock" });
      }
    }
  }
};
</script>
