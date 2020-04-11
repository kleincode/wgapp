<template>
  <v-container>
    <v-row align="stretch" justify="center">
      <v-col
        v-if="clockWidgetEnabled"
        cols="12"
        md="6"
        lg="4"
        xl="3"
        class="widget-col"
      >
        <ClockWidget />
      </v-col>
      <v-col
        v-if="weatherWidgetEnabled"
        cols="12"
        md="6"
        lg="4"
        xl="3"
        class="widget-col"
      >
        <WeatherWidget />
      </v-col>
      <v-col
        v-if="tasksWidgetEnabled"
        cols="12"
        md="6"
        lg="4"
        xl="3"
        class="widget-col"
      >
        <TasksWidget />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from "vuex";

import ClockWidget from "@/components/widgets/ClockWidget.vue";
import WeatherWidget from "@/components/widgets/WeatherWidget.vue";
import TasksWidget from "@/components/widgets/TasksWidget.vue";

export default {
  name: "Dashboard",
  components: {
    ClockWidget,
    WeatherWidget,
    TasksWidget
  },
  computed: {
    ...mapState("userSettings", [
      "clockWidgetEnabled",
      "weatherWidgetEnabled",
      "tasksWidgetEnabled"
    ])
  }
};
</script>
