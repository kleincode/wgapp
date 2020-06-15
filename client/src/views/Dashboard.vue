<template>
  <v-container fluid>
    <v-overlay
      v-if="!userInHousehold"
      style="min-height: 100vh"
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
    <h1
      v-if="userInHousehold"
      class="display-2 mb-6 mt-3"
      style="max-width: 80%"
    >
      {{ message }}
    </h1>
    <masonry
      v-if="userInHousehold"
      :key="$vuetify.breakpoint.name"
      :cols="gridColumns"
      :gutter="10"
    >
      <ClockWidget v-if="clockWidgetEnabled" class="mb-4" />
      <WeatherWidget v-if="weatherWidgetEnabled" class="mb-4" large />
      <CalendarWidget
        v-if="calendarWidgetEnabled && calendarEnabled"
        class="mb-4"
        large
      />
      <TasksWidget v-if="tasksWidgetEnabled" class="mb-4" large />
      <FinancesWidget v-if="financesWidgetEnabled" class="mb-4" large />
      <StatusWidget v-if="statusWidgetEnabled" class="mb-4" />
      <ImHomeWidget v-if="homeWidgetEnabled" class="mb-4" />
    </masonry>
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
      "calendarWidgetEnabled",
      "calendarEnabled"
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
    },
    gridColumns() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs": {
          return 1;
        }
        case "sm": {
          return 2;
        }
        case "md": {
          return 2;
        }
        case "lg": {
          return 3;
        }
        default: {
          return 4;
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
