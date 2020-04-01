<template>
  <v-container>
    <v-row align="stretch" justify="center">
      <v-col cols="12" md="6" lg="4" xl="3" class="widget-col">
        <ClockWidget />
      </v-col>
      <v-col cols="12" md="6" lg="4" xl="3" class="widget-col">
        <WeatherWidget />
      </v-col>
      <v-col cols="12" md="6" lg="4" xl="3" class="widget-col">
        <TasksWidget />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// @ is an alias to /src
import ClockWidget from "@/components/widgets/ClockWidget.vue";
import WeatherWidget from "@/components/widgets/WeatherWidget.vue";
import TasksWidget from "@/components/widgets/TasksWidget.vue";

export default {
  name: "Dashboard",
  components: {
    ClockWidget,
    WeatherWidget,
    TasksWidget
  }
};
</script>