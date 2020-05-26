<template>
  <v-row>
    <v-col cols="12" md="6" lg="8">
      <UpcomingTasksCard
        :user-images="userImages"
        :on-demand-tasks="onDemandTasks"
        :timed-tasks="timedTasks"
        :loading="loading"
        @reminder="triggerReminder"
      ></UpcomingTasksCard>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from "vuex";
import UpcomingTasksCard from "@/components/UpcomingTasksCard.vue";

export default {
  name: "ViewTasks",
  components: {
    UpcomingTasksCard
  },
  props: {
    userImages: {
      type: Object,
      default: () => {}
    },
    loading: {
      type: Boolean,
      default: () => false
    }
  },
  computed: {
    ...mapGetters("tasks", ["getTodaysTasks", "onDemandTasks", "timedTasks"])
  }
};
</script>

<style></style>
