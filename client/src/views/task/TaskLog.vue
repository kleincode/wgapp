<template>
  <TasksLogCard
    :user-images="userImages"
    :tasks="loggedTasks"
    :loading="loading"
  ></TasksLogCard>
</template>

<script>
import TasksLogCard from "@/components/TasksLogCard.vue";
import { mapState } from "vuex";

export default {
  name: "TaskLog",
  components: {
    TasksLogCard
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
    ...mapState("tasks", ["loggedTasks"])
  }
};
</script>

<style></style>
