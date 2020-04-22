<template>
  <v-container>
    <v-row align="stretch" justify="center">
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
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from "vuex";

import ClockWidget from "@/components/widgets/ClockWidget.vue";
import WeatherWidget from "@/components/widgets/WeatherWidget.vue";
import TasksWidget from "@/components/widgets/TasksWidget.vue";
import FinancesWidget from "@/components/widgets/FinancesWidget.vue";

export default {
  name: "Dashboard",
  components: {
    ClockWidget,
    WeatherWidget,
    TasksWidget,
    FinancesWidget
  },
  computed: {
    ...mapState("userSettings", [
      "clockWidgetEnabled",
      "weatherWidgetEnabled",
      "tasksWidgetEnabled",
      "financesWidgetEnabled"
    ])
  }
};
</script>
