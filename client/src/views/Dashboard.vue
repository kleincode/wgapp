<template>
  <v-container>
    <h1 class="display-2 mb-6" style="max-width: 80%">
      Hi, {{ $store.state.userFirstName }}!
    </h1>
    <v-row align="stretch">
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
import { mapState } from "vuex";

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
  computed: {
    ...mapState("userSettings", [
      "clockWidgetEnabled",
      "weatherWidgetEnabled",
      "tasksWidgetEnabled",
      "financesWidgetEnabled",
      "statusWidgetEnabled",
      "homeWidgetEnabled"
    ])
  }
};
</script>
