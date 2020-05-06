<template>
  <v-container>
    <v-overlay
      v-if="!userInHousehold"
      :value="overlay"
      :opacity="0.8"
      absolute
      class="pa-4"
    >
      <h1 class="display-3">{{ $t("dashboard.householdTitle") }}</h1>
      <p class="title mt-2">{{ $t("dashboard.householdMsg") }}</p>
      <v-row align="center">
        <v-col cols="12" md="6">
          <v-btn color="primary" block @click="join">
            {{ $t("dashboard.join") }}
          </v-btn>
        </v-col>
        <v-col cols="12" md="6">
          <v-btn color="primary" block @click="create">
            {{ $t("dashboard.create") }}
          </v-btn>
        </v-col>
      </v-row>
    </v-overlay>
    <h1 class="display-2 mb-6" style="max-width: 80%">
      {{ message }}
    </h1>
    <v-row v-if="userInHousehold" align="stretch">
      <v-col
        v-if="clockWidgetEnabled"
        cols="12"
        sm="6"
        lg="4"
        xl="3"
        class="widget-col"
      >
        <ClockWidget />
      </v-col>
      <v-col
        v-if="weatherWidgetEnabled"
        cols="12"
        sm="6"
        lg="4"
        xl="3"
        class="widget-col"
      >
        <WeatherWidget />
      </v-col>
      <v-col
        v-if="tasksWidgetEnabled"
        cols="12"
        sm="6"
        lg="4"
        xl="3"
        class="widget-col"
      >
        <TasksWidget />
      </v-col>
      <v-col
        v-if="financesWidgetEnabled"
        cols="12"
        sm="6"
        lg="4"
        xl="3"
        class="widget-col"
      >
        <FinancesWidget />
      </v-col>
      <v-col
        v-if="statusWidgetEnabled"
        cols="12"
        sm="6"
        lg="4"
        xl="3"
        class="widget-col"
      >
        <StatusWidget />
      </v-col>
      <v-col
        v-if="homeWidgetEnabled"
        cols="12"
        sm="6"
        lg="4"
        xl="3"
        class="widget-col"
      >
        <ImHomeWidget />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from "vuex";

import ClockWidget from "@/components/widgets/ClockWidget.vue";
import WeatherWidget from "@/components/widgets/WeatherWidget.vue";
import TasksWidget from "@/components/widgets/TasksWidget.vue";
import FinancesWidget from "@/components/widgets/FinancesWidget.vue";
import StatusWidget from "@/components/widgets/StatusWidget.vue";
import ImHomeWidget from "@/components/widgets/ImHomeWidget.vue";

export default {
  name: "Dashboard",
  components: {
    ClockWidget,
    WeatherWidget,
    TasksWidget,
    FinancesWidget,
    StatusWidget,
    ImHomeWidget
  },
  data: () => ({
    overlay: true
  }),
  computed: {
    ...mapState(["userInHousehold"]),
    ...mapState("userSettings", [
      "clockWidgetEnabled",
      "weatherWidgetEnabled",
      "tasksWidgetEnabled",
      "financesWidgetEnabled",
      "statusWidgetEnabled",
      "homeWidgetEnabled"
    ]),
    ...mapGetters(["getName"]),
    message() {
      let time = new Date();
      if (time.getHours() < 5) {
        //late night
        let number = Math.floor(Math.random() * 2);
        switch (number) {
          case 0:
            return (
              this.$t("dashboard.message.lateNight[0]") + this.getName + "?"
            );
          default:
            return (
              this.$t("dashboard.message.lateNight[1]") + this.getName + "?"
            );
        }
      } else if (time.getHours() < 10) {
        //morning
        let number = Math.floor(Math.random() * 5);
        switch (number) {
          case 0:
            return this.$t("dashboard.message.morning[0]");
          case 1:
            return this.$t("dashboard.message.morning[1]");
          case 2:
            return this.$t("dashboard.message.morning[2]");
          case 3:
            return this.$t("dashboard.message.morning[3]") + this.getName + "!";
          default:
            return this.$t("dashboard.message.morning[4]") + this.getName + "!";
        }
      } else if (time.getHours() < 14) {
        //noon
        let number = Math.floor(Math.random() * 3);
        switch (number) {
          case 0:
            return this.$t("dashboard.message.noon[0]") + this.getName + "!";
          case 1:
            return this.$t("dashboard.message.noon[1]") + this.getName + "?";
          default:
            return this.$t("dashboard.message.noon[2]");
        }
      } else if (time.getHours() < 18) {
        //afternoon
        let number = Math.floor(Math.random() * 3);
        switch (number) {
          case 0:
            return (
              this.$t("dashboard.message.afternoon[0]") + this.getName + "!"
            );
          case 1:
            return (
              this.$t("dashboard.message.afternoon[1]") + this.getName + "!"
            );
          default:
            return (
              this.$t("dashboard.message.afternoon[2]") + this.getName + "?"
            );
        }
      } else if (time.getHours() < 22) {
        //evening
        let number = Math.floor(Math.random() * 3);
        switch (number) {
          case 0:
            return this.$t("dashboard.message.evening[0]");
          case 1:
            return this.$t("dashboard.message.evening[1]") + this.getName + "!";
          default:
            return this.$t("dashboard.message.evening[2]") + this.getName + "?";
        }
      } else {
        //night
        let number = Math.floor(Math.random() * 3);
        switch (number) {
          case 0:
            return this.$t("dashboard.message.night[0]") + this.getName + "!";
          case 1:
            return this.$t("dashboard.message.night[1]") + this.getName + "!";
          default:
            return this.$t("dashboard.message.night[2]") + this.getName + "!";
        }
      }
    }
  },
  methods: {
    join() {
      if (this.introductionState != 0) {
        this.introductionState = 2;
      }
      this.$router.push({ path: "/household/join" });
      this.dialog = false;
    },
    create() {
      if (this.introductionState != 0) {
        this.introductionState = 2;
      }
      this.$router.push({ path: "/household/create" });
      this.dialog = false;
    }
  }
};
</script>
