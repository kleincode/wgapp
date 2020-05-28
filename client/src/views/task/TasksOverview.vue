<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="container">
          <v-row justify="center">
            <v-col cols="12" md="12">
              <TasksCarousel
                :tasks="getTodaysTasks"
                :user-images="userImages"
                :empty-text="$t('tasks.noTasks')"
                :empty-sub-text="$t('tasks.chill')"
                empty-icon="bathtub"
                @checktask="checkTask"
                @triggerreminder="remind"
              ></TasksCarousel>
            </v-col>
            <v-col cols="12" md="12">
              <v-divider class="mb-7"></v-divider>
              <TasksCarousel
                :tasks="onDemandTasks"
                :user-images="userImages"
                small
                :empty-text="$t('tasks.noOnDemand')"
                :empty-sub-text="$t('tasks.nothing')"
                empty-icon="hourglass_empty"
                @checktask="checkTask"
                @triggerreminder="remind"
              ></TasksCarousel>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import TasksCarousel from "@/components/tasks/TasksCarousel.vue";
import { mapGetters, mapState } from "vuex";

export default {
  name: "TasksOverview",
  components: {
    TasksCarousel
  },
  props: {
    userImages: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapGetters("tasks", ["getTodaysTasks", "onDemandTasks"]),
    ...mapState("tasks", ["tasks", "loggedTasks"])
  },
  methods: {
    checkTask(task) {
      this.$emit("checkTask", task);
    },
    remind(task) {
      this.$emit("triggerreminder", task);
    }
  }
};
</script>

<style></style>
