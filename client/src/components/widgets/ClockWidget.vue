<template>
  <Widget
    :title="$t('widgets.clock.title')"
    :with-footer="!large"
    :context-items="contextItems"
    :large="large"
    @context-action="contextAction"
  >
    <v-row style="height: 80%" align="center" justify="center">
      <v-col cols="12" class="text-center">
        <div v-if="large" class="pb-4">
          <span class="title">{{ formatWeekday(now) }}</span>
        </div>
        <span :class="timeSize">{{ time }}</span>
        <span class="display-1" style="vertical-align: baseline;">{{
          timeSuffix
        }}</span>
        <div v-if="large" class="pt-2">
          <span class="display-1">{{ formatDateYMD(now) }}</span>
        </div>
      </v-col>
    </v-row>
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
  props: {
    large: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    now: new Date(),
    clockIntervalID: -1
  }),
  computed: {
    timeSize() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "display-3";
        case "sm":
          return "display-2";
        case "md":
          return "display-4";
        case "lg":
          return "display-3";
        default:
          return "display-3";
      }
    },
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
