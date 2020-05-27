<template>
  <v-container>
    <v-progress-linear
      v-if="loading"
      indeterminate
      class="mb-4"
    ></v-progress-linear>
    <router-view
      :user-images="userImages"
      :loading="loading"
      @checkTask="checkTask"
      @triggerreminder="triggerReminder"
      @update="fetchTasks"
    ></router-view>
    <v-bottom-navigation
      :style="{ left: $vuetify.application.left + 'px' }"
      grow
      fixed
      color="primary"
      class="elevation-24"
    >
      <v-btn :to="{ name: 'TasksOverview' }" exact>
        <span>{{ $t("tasks.tabs.overview") }}</span>
        <v-icon>bar_chart</v-icon>
      </v-btn>
      <v-btn :to="{ name: 'ViewTasks' }" exact>
        <span>{{ $t("tasks.tabs.list") }}</span>
        <v-icon>list</v-icon>
      </v-btn>
      <v-btn :to="{ name: 'TasksLog' }" exact>
        <span>{{ $t("tasks.tabs.log") }}</span>
        <v-icon>history</v-icon>
      </v-btn>
    </v-bottom-navigation>
    <v-snackbar v-model="taskCheckSnack">
      {{ $t("tasks.checked") }} {{ checkedTask ? checkedTask.name : "" }}
      <v-btn color="primary" text @click="undoCheckTask">
        {{ $t("commands.undo") }}
      </v-btn>
    </v-snackbar>
  </v-container>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { fetchProfileImg } from "@/assets/profileimagesHelper.js";

export default {
  name: "Tasks",
  data: () => ({
    userImages: {},
    loading: false,
    taskCheckSnack: false,
    checkedTask: null
  }),
  computed: {
    ...mapState("tasks", ["loggedTasks", "tasks"]),
    ...mapGetters(["getUserName"])
  },
  mounted() {
    this.fetchTasks();
  },
  methods: {
    async fetchTasks() {
      this.loading = true;
      try {
        await this.$store.dispatch("tasks/fetchTasks");
        this.tasks.forEach(async task => this.syncUserImages(task));
        this.loggedTasks.forEach(async task => this.syncUserImages(task));
      } catch (err) {
        this.$store.dispatch("showSnackbar", this.$t("tasks.errors.fetchTask"));
        console.warn(err);
      }
      this.loading = false;
    },
    async syncUserImages(task) {
      if (!this.userImages[task.assigned]) {
        this.$set(
          this.userImages,
          task.assigned,
          await fetchProfileImg(task.assigned)
        );
      }
    },
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
<style lang="scss">
.v-carousel__controls__item {
  color: grey !important;
}
</style>
