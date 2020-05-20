<template>
  <v-container>
    <v-overlay
      v-if="!userInHousehold"
      :value="overlay"
      :opacity="0.8"
      absolute
      class="pa-4"
    >
      <h1 class="display-3">{{ $t("dashboard.notInHouseholdTitle") }}</h1>
      <p class="title mt-2">{{ $t("dashboard.notInHouseholdMessage") }}</p>
      <v-row align="center">
        <v-col cols="12" md="6">
          <v-btn color="primary" block @click="join">
            {{ $t("dashboard.joinHousehold") }}
          </v-btn>
        </v-col>
        <v-col cols="12" md="6">
          <v-btn color="primary" block @click="create">
            {{ $t("dashboard.createHousehold") }}
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
        v-if="calendarWidgetEnabled"
        cols="12"
        sm="6"
        lg="4"
        xl="3"
        class="widget-col"
      >
        <CalendarWidget />
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
import CalendarWidget from "@/components/widgets/CalendarWidget.vue";

export default {
  name: "Dashboard",
  components: {
    ClockWidget,
    WeatherWidget,
    TasksWidget,
    FinancesWidget,
    StatusWidget,
    ImHomeWidget,
    CalendarWidget
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
      "homeWidgetEnabled",
      "calendarWidgetEnabled"
    ]),
    ...mapGetters(["getName"]),
    message() {
      const h = new Date().getHours();
      let timeOfDay = "night";
      if (h < 5) timeOfDay = "lateNight";
      else if (h < 10) timeOfDay = "morning";
      else if (h < 14) timeOfDay = "noon";
      else if (h < 18) timeOfDay = "afternoon";
      else if (h < 22) timeOfDay = "evening";
      const index = Math.floor(
        Math.random() * this.$t("dashboard.greetings." + timeOfDay).length
      );
      return this.$t(`dashboard.greetings.${timeOfDay}[${index}]`, {
        name: this.getName
      });
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
