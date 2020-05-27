<template>
  <v-card
    style="max-width: 800px; margin: 0 auto"
    class="pa-4"
    :elevation="$vuetify.breakpoint.smAndDown ? 0 : 6"
  >
    <!--SINGLE TASKS -->
    <div class="title">{{ $t("tasks.view.singleTasks") }}</div>
    <TaskList
      :tasks="singleTasks"
      :user-images="userImages"
      empty-icon="work_outline"
      :empty-text="$t('tasks.view.singleTasksEmpty')"
    ></TaskList>

    <!--TIMED TASKS -->
    <div class="title">{{ $t("tasks.view.repeatingTasks") }}</div>
    <TaskList
      :tasks="repeatingTasks"
      :user-images="userImages"
      empty-icon="golf_course"
      :empty-text="$t('tasks.view.repeatingTasksEmpty')"
    ></TaskList>

    <!--ON DEMAND TASKS -->
    <div class="title">{{ $t("tasks.view.onDemand") }}</div>
    <TaskList
      :tasks="onDemandTasks"
      :user-images="userImages"
      empty-icon="access_alarm"
      :empty-text="$t('tasks.view.onDemandTasksEmpty')"
      color="accent"
    ></TaskList>
  </v-card>
</template>
<script>
import { mapGetters } from "vuex";
import TaskList from "@/components/tasks/TaskList.vue";

export default {
  name: "ViewTasks",
  components: {
    TaskList
  },
  props: {
    loading: {
      type: Boolean,
      default: () => false
    },
    userImages: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapGetters("tasks", ["repeatingTasks", "onDemandTasks", "singleTasks"])
  }
};
</script>
