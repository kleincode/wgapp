<template>
  <v-container>
    <h1 class="display-2">{{ $t("tasks.title") }}</h1>
    <v-row>
      <v-col cols="12">
        <div class="container">
          <v-row justify="center">
            <v-col cols="12" md="12">
              <TasksCarousel
                :tasks="getTodaysTasks"
                :user-images="userImages"
                @checktask="checkTask"
              ></TasksCarousel>
            </v-col>
            <v-col cols="12" md="12">
              <TasksCarousel
                :tasks="onDemandTasks"
                :user-images="userImages"
                small
                @checktask="checkTask"
              ></TasksCarousel>
            </v-col>
          </v-row>
        </div>
      </v-col>
      <v-col cols="12" md="6" lg="8">
        <UpcomingTasksCard
          :user-images="userImages"
          :on-demand-tasks="onDemandTasks"
          :timed-tasks="timedTasks"
          :loading="loading"
          @reminder="triggerReminder"
          @checktask="checkTask"
        ></UpcomingTasksCard>
      </v-col>
      <v-col cols="12" md="6">
        <RepeatingTasksCard
          :user-images="userImages"
          :repeating-tasks="repeatingTasks"
          :loading="loading"
        ></RepeatingTasksCard>
      </v-col>
      <v-col cols="12" md="6">
        <TasksLogCard
          :user-images="userImages"
          :tasks="loggedTasks"
          :loading="loading"
        ></TasksLogCard>
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
import icons from "@/assets/icons.js";
import { mapState, mapGetters } from "vuex";
import { fetchProfileImg } from "@/assets/profileimagesHelper.js";
import RepeatingTasksCard from "@/components/RepeatingTasksCard.vue";
import UpcomingTasksCard from "@/components/UpcomingTasksCard.vue";
import TasksLogCard from "@/components/TasksLogCard.vue";
import TasksCarousel from "@/components/tasks/TasksCarousel.vue";

export default {
  name: "Tasks",
  components: {
    RepeatingTasksCard,
    UpcomingTasksCard,
    TasksLogCard,
    TasksCarousel
  },
  data: () => ({
    userImages: {},
    loading: false,
    taskCheckSnack: false,
    checkedTask: null
  }),
  computed: {
    ...mapState("tasks", ["loggedTasks", "tasks"]),
    ...mapGetters("tasks", [
      "getTodaysTasks",
      "repeatingTasks",
      "timedTasks",
      "onDemandTasks"
    ]),
    ...mapGetters([
      "getUserName",
      "getUserInitials",
      "getHouseholdUsersAsItemList"
    ])
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
    },
    getIcon: index => icons[index]
  }
};
</script>
<style lang="scss">
.v-carousel__controls__item {
  color: grey !important;
}
</style>
