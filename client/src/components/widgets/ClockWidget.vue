<template>
  <Widget
    :title="$t('widgets.clock.title')"
    with-footer
    :context-items="contextItems"
    @context-action="contextAction"
  >
    <span class="display-3">{{ time }}</span>
    <span class="display-1" style="vertical-align: baseline;">{{
      timeSuffix
    }}</span>
    <template #footer
      >{{ formatWeekday(now) }} | {{ formatDateYMD(now) }}</template
    >
  </Widget>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import Widget from "./Widget";

export default {
  name: "ClockWidget",
  components: {
    Widget
  },
  data: () => ({
    now: new Date(),
    clockIntervalID: -1
  }),
  computed: {
    contextItems() {
      return [
        {
          action: "settings",
          text: this.$t("widgets.settings"),
          icon: "settings"
        }
      ];
    },
    ...mapState("userSettings", ["locale"]),
    ...mapGetters("userSettings", [
      "formatTimeHMS",
      "formatDateYMD",
      "formatWeekday"
    ]),
    fullTime() {
      return this.formatTimeHMS(this.now);
    },
    time() {
      return this.fullTime.endsWith(" PM") || this.fullTime.endsWith(" AM")
        ? this.fullTime.substr(0, this.fullTime.length - 3)
        : this.fullTime;
    },
    timeSuffix() {
      return this.fullTime.endsWith(" PM") || this.fullTime.endsWith(" AM")
        ? this.fullTime.substr(this.fullTime.length - 3)
        : "";
    }
  },
  mounted() {
    // Start ticking
    this.tick();
    this.clockIntervalID = setInterval(() => this.tick(), 1000);
  },
  beforeDestroy() {
    clearInterval(this.clockIntervalID);
  },
  methods: {
    tick() {
      this.now = new Date();
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
