<template>
  <v-container>
    <h1 class="display-2">{{ $t("tasks.title") }}</h1>
    <v-row>
      <v-col cols="12">
        <v-card
          :elevation="6"
          class="text-center"
          :loading="loading"
          style="height: 100%"
        >
          <h2 class="title pt-8">{{ $t("tasks.todaystasks") }}</h2>
          <div class="container">
            <v-row justify="center">
              <v-col cols="12" md="12">
                <center>
                  <div v-if="getTodaysTasks.length > 0">
                    <v-carousel
                      v-if="showCarousel"
                      cycle
                      height="auto"
                      hide-delimiter-background
                      show-arrows-on-hover
                      :show-arrows="todaysTaskChunks.length > 1"
                    >
                      <v-carousel-item
                        v-for="(chunk, i) in todaysTaskChunks"
                        :key="i"
                      >
                        <v-row justify="center">
                          <v-col
                            v-for="(task, j) in chunk"
                            :key="j"
                            cols="12"
                            md="5"
                          >
                            <LargeTaskDisplay
                              :task="task"
                              :user-images="userImages"
                              @checktask="checkTask"
                            ></LargeTaskDisplay>
                          </v-col>
                        </v-row>
                      </v-carousel-item>
                    </v-carousel>
                    <v-list v-else>
                      <v-list-item v-for="(task, j) in getTodaysTasks" :key="j">
                        <LargeTaskDisplay
                          :task="task"
                          :user-images="userImages"
                          @checktask="checkTask"
                        ></LargeTaskDisplay>
                      </v-list-item>
                    </v-list>
                  </div>
                  <v-row v-else>
                    <v-col cols="12" md="6">
                      <LargeTaskDisplay class="text-center"></LargeTaskDisplay>
                    </v-col>
                  </v-row>
                </center>
              </v-col>
            </v-row>
          </div>
        </v-card>
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
import LargeTaskDisplay from "@/components/LargeTaskDisplay.vue";

export default {
  name: "Tasks",
  components: {
    RepeatingTasksCard,
    UpcomingTasksCard,
    TasksLogCard,
    LargeTaskDisplay
  },
  data: () => ({
    userImages: {},
    loading: false,
    taskCheckSnack: false,
    checkedTask: null
  }),
  computed: {
    todaysTaskChunks() {
      var chunk = require("chunk");
      return chunk(this.getTodaysTasks, 2);
    },
    showCarousel() {
      return !(
        this.$vuetify.breakpoint.name == "xs" ||
        this.$vuetify.breakpoint.name == "sm"
      );
    },
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
