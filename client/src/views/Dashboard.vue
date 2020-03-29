<template>
  <div class="md-layout md-gutter md-alignment-center">
    <div
      class="md-layout-item md-xlarge-size-25 md-medium-size-33 md-small-size-50 md-xsmall-size-100"
    >
      <ClockWidget />
    </div>
    <div
      class="md-layout-item md-xlarge-size-25 md-medium-size-33 md-small-size-50 md-xsmall-size-100"
    >
      <WeatherWidget />
    </div>
    <div
      class="md-layout-item md-xlarge-size-25 md-medium-size-33 md-small-size-50 md-xsmall-size-100"
    >
      <TasksWidget />
    </div>
  </div>
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
