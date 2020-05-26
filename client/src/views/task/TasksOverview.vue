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
                @checktask="checkTask"
                @triggerreminder="triggerreminder(task)"
              ></TasksCarousel>
            </v-col>
            <v-col cols="12" md="12">
              <TasksCarousel
                :tasks="onDemandTasks"
                :user-images="userImages"
                small
                @checktask="checkTask"
                @triggerreminder="triggerreminder(task)"
              ></TasksCarousel>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
    <v-snackbar v-model="taskCheckSnack">
      {{ $t("tasks.checked") }} {{ checkedTask ? checkedTask.name : "" }}
      <v-btn color="primary" text @click="undoCheckTask">
        {{ $t("commands.undo") }}
      </v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import TasksCarousel from "@/components/tasks/TasksCarousel.vue";
import { mapGetters } from "vuex";

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
  data: () => ({
    taskCheckSnack: false,
    checkedTask: null
  }),
  computed: {
    ...mapGetters("tasks", ["getTodaysTasks", "onDemandTasks"])
  },
  methods: {
    async checkTask(task) {
      this.loading = true;
      // if this is a single task, show 'undo' snackbar
      if (task.mode == 0 || task.mode == 1) {
        this.checkedTask = task;
        this.taskCheckSnack = true;
      } else if (task.checked) {
        //On-Demand
        this.$store.dispatch(
          "showSnackbar",
          this.$t("store.tasks.undoOnDemandError")
        );
        this.loading = false;
        return;
      }

      // Perform check task
      try {
        await this.$store.dispatch("tasks/updateTaskChecked", {
          task,
          checked: !task.checked
        });
        await this.fetchTasks();
      } catch (err) {
        this.$store.dispatch("showSnackbar", this.$t("tasks.errors.checkTask"));
        console.warn(err);
      }
      this.loading = false;
    },
    async undoCheckTask() {
      if (!this.checkedTask) return;
      this.loading = true;
      this.taskCheckSnack = false;
      try {
        await this.$store.dispatch("tasks/updateTaskChecked", {
          task: this.checkedTask,
          checked: false
        });
        await this.fetchTasks();
      } catch (err) {
        this.$store.dispatch("showSnackbar", this.$t("tasks.errors.undo"));
        console.warn(err);
      }
      this.checkedTask = null;
      this.loading = false;
    },
    async triggerReminder(task) {
      this.loading = true;
      try {
        await this.$store.dispatch("tasks/triggerReminder", task);
        this.$store.dispatch(
          "showSnackbar",
          this.$t("tasks.reminderMessage", {
            user: this.getUserName(task.assigned),
            task: task.name
          })
        );
      } catch (err) {
        this.$store.dispatch(
          "showSnackbar",
          this.$t("tasks.errors.triggerReminder")
        );
      }
      this.loading = false;
    }
  }
};
</script>

<style></style>
