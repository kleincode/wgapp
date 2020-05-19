<template>
  <Widget
    title="Upcoming events"
    :context-items="contextItems"
    @context-action="contextAction"
  >
    <v-carousel
      v-if="upcomingEvents.length > 0"
      cycle
      hide-delimiter-background
      :show-arrows="false"
      height="120"
      delimiter-icon="fiber_manual_record"
      class="bottom-carousel"
      :interval="9000"
      :dark="$vuetify.theme.dark"
      :light="!$vuetify.theme.dark"
    >
      <v-carousel-item v-for="(event, i) in upcomingEvents" :key="i">
        <v-row align="center" justify="center">
          <v-col cols="2">
            <v-icon x-large>event</v-icon>
          </v-col>
          <v-col cols="8">
            <div class="headline">Event</div>
            <div class="overline">Time</div>
          </v-col>
        </v-row>
      </v-carousel-item>
    </v-carousel>
    <div v-else>
      <v-row
        class="headline text--disabled mt-3"
        height="120"
        justify="center"
        align="center"
      >
        <v-icon class="mr-1">event</v-icon>
        No events today
      </v-row>
    </div>
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
    upcomingEvents: []
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
    ...mapGetters("userSettings", ["formatTimeHMS", "formatDateYMD"]),
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
  methods: {
    contextAction(item) {
      switch (item.action) {
        case "settings":
          this.$router.push({ name: "DashboardSettings", hash: "#clock" });
      }
    }
  }
};
</script>
