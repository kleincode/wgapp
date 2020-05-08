<template>
  <v-container>
    <h1 class="display-2">Tasks</h1>
    <v-row>
      <v-col cols="12" md="6" lg="4">
        <v-card
          :elevation="6"
          class="text-center"
          :loading="loading"
          style="height: 100%"
        >
          <h2 class="title pt-8">{{ $t("tasks.todaystasks") }}</h2>
          <div class="container">
            <v-row justify="center">
              <v-col cols="12" md="10">
                <v-card
                  v-if="getTodaysTasks.length > 0"
                  class="main-task text-center"
                  :class="getTodaysTasks[0].missed ? 'red' : 'accent'"
                  :elevation="6"
                >
                  <div class="overline">{{ $t("tasks.duetoday") }}</div>
                  <v-icon style="font-size: 10em" x-large>
                    {{ getIcon(getTodaysTasks[0].icon) }}
                  </v-icon>
                  <div class="font-regular pt-4 display-1">
                    {{ getTodaysTasks[0].name }}
                    <br />
                    <v-btn icon @click="checkTask(getTodaysTasks[0])">
                      <v-icon v-if="getTodaysTasks[0].checked"
                        >check_box</v-icon
                      >
                      <v-icon v-else>check_box_outline_blank</v-icon>
                    </v-btn>
                    <v-btn icon @click="triggerReminder(getTodaysTasks[0])"
                      ><v-icon>notifications_active</v-icon></v-btn
                    >
                  </div>
                  <div class="caption pt-2">{{ getTodaysTasks[0].time }}</div>
                  <v-divider class="mt-4 mb-4"></v-divider>
                  <v-chip>
                    <v-avatar
                      :color="
                        !userImages[getTodaysTasks[0].assigned] ? 'primary' : ''
                      "
                      left
                    >
                      <v-img
                        v-show="userImages[getTodaysTasks[0].assigned]"
                        :src="userImages[getTodaysTasks[0].assigned]"
                      ></v-img>
                      <span
                        v-show="!userImages[getTodaysTasks[0].assigned]"
                        class="white--text"
                      >
                        {{ getUserInitials(getTodaysTasks[0].assigned) }}
                      </span>
                    </v-avatar>
                    {{ getUserName(getTodaysTasks[0].assigned) }}
                  </v-chip>
                </v-card>
                <v-card
                  v-else
                  class="main-task text-center secondary lighten-2"
                  :elevation="6"
                >
                  <div class="overline text--disabled">
                    {{ $t("tasks.duetoday") }}
                  </div>
                  <v-icon class="text--disabled" style="font-size: 10em" x-large
                    >bathtub</v-icon
                  >
                  <div class="font-regular pt-4 display-1 text--disabled">
                    {{ $t("tasks.chill") }}
                  </div>
                  <div class="caption pt-2 text--disabled">--:--</div>
                  <v-divider class="mt-4 mb-4"></v-divider>
                  <v-chip disabled style="width: 30%">
                    <v-avatar left></v-avatar>
                  </v-chip>
                </v-card>
              </v-col>
            </v-row>
          </div>

          <v-divider class="mb-4"></v-divider>
          <div class="overline">{{ $t("tasks.other") }}</div>
          <v-list avatar class="text-left pl-4">
            <div v-if="getTodaysTasks.length > 1">
              <v-list-item
                v-for="(task, i) in getTodaysTasks.slice(
                  1,
                  getTodaysTasks.length
                )"
                :key="'task-' + i"
                :class="task.missed ? 'red' : ''"
              >
                <v-list-item-avatar>
                  <v-icon>{{ getIcon(task.icon) }}</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="task-entry">
                    {{ task.name }}
                    <div class="overline pl-2 pt-1">- {{ task.time }}</div>
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    <v-chip small>
                      <v-avatar
                        :color="
                          !userImages[getTodaysTasks[0].assigned]
                            ? 'primary'
                            : ''
                        "
                        style="max-height: 80%; max-width: 90%"
                        left
                      >
                        <v-img
                          v-show="userImages[task.assigned]"
                          :src="userImages[task.assigned]"
                        ></v-img>
                        <span
                          v-show="!userImages[task.assigned]"
                          class="white--text headline"
                        >
                          {{ getUserInitials(task.assigned) }}
                        </span>
                      </v-avatar>
                      {{ getUserName(task.assigned) }}
                    </v-chip>
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-icon>
                  <v-btn icon @click="checkTask(task)">
                    <v-icon v-if="task.checked">check_box</v-icon>
                    <v-icon v-else>check_box_outline_blank</v-icon>
                  </v-btn>
                  <v-btn icon @click="triggerReminder(task)"
                    ><v-icon>notifications_active</v-icon></v-btn
                  >
                </v-list-item-icon>
              </v-list-item>
            </div>
            <v-list-item v-else>
              <v-list-item-avatar>
                <v-icon class="text--disabled">hourglass_empty</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="text--disabled">{{
                  $t("tasks.nothing")
                }}</v-list-item-title>
                <v-list-item-subtitle>
                  <div class="overline text--disabled">--:--</div>
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-icon>
                <v-btn icon disabled>
                  <v-icon class="text--disabled"
                    >check_box_outline_blank</v-icon
                  >
                </v-btn>
              </v-list-item-icon>
            </v-list-item>
          </v-list>
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
import { formatDateString } from "@/assets/tasksHelper";
import { fetchProfileImg } from "@/assets/profileimagesHelper.js";
import RepeatingTasksCard from "@/components/RepeatingTasksCard.vue";
import UpcomingTasksCard from "@/components/UpcomingTasksCard.vue";
import TasksLogCard from "@/components/TasksLogCard.vue";

export default {
  name: "Tasks",
  components: {
    RepeatingTasksCard,
    UpcomingTasksCard,
    TasksLogCard
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
        this.tasks.forEach(async task => {
          if (!this.userImages[task.assigned]) {
            this.$set(
              this.userImages,
              task.assigned,
              await fetchProfileImg(task.assigned)
            );
          }
        });
      } catch (err) {
        this.$store.dispatch(
          "showSnackbar",
          this.$i18n.t("tasks.errors.fetchTask")
        );
        console.warn(err);
      }
      this.loading = false;
    },
    async checkTask(task) {
      console.log(task);
      this.loading = true;
      // if this is a single task, show 'undo' snackbar
      if (task.mode == 0 || task.mode == 1) {
        this.checkedTask = task;
        this.taskCheckSnack = true;
      } else if (task.checked) {
        //On-Demand
        this.$store.dispatch(
          "showSnackbar",
          this.$i18n.t("store.tasks.undoOnDemand")
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
        this.$store.dispatch(
          "showSnackbar",
          this.$i18n.t("tasks.errors.checkTask")
        );
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
        this.$store.dispatch("showSnackbar", this.$i18n.t("tasks.errors.undo"));
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
          this.$i18n.t("tasks.reminder.part1") +
            this.getUserName(task.assigned) +
            this.$i18n.t("tasks.reminder.part2") +
            task.name +
            this.$i18n.t("tasks.reminder.part3")
        );
      } catch (err) {
        this.$store.dispatch(
          "showSnackbar",
          this.$i18n.t("tasks.errors.reminder")
        );
      }
      this.loading = false;
    },
    format: formatDateString,
    getIcon: index => icons[index]
  }
};
</script>
<style lang="scss" scoped>
.main-task {
  padding: 2em;
  margin: 2em;
  margin-bottom: 4em;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.task-entry {
  display: flex;
}
</style>
