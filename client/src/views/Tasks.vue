<template>
  <v-container>
    <h1 class="display-2">Tasks</h1>
    <v-row>
      <v-col cols="12" md="6" lg="4">
        <v-card outlined class="text-center" :loading="loading">
          <h2 class="title pt-8">Today's Tasks</h2>
          <div class="container">
            <v-row justify="center">
              <v-col cols="12" md="10">
                <v-card
                  v-if="getTodaysTasks.length > 0"
                  raised
                  class="main-task text-center"
                  :class="getTodaysTasks[0].missed ? 'red' : 'primary'"
                >
                  <div class="overline">DUE TODAY</div>
                  <v-icon style="font-size: 10em" x-large>
                    {{ getTodaysTasks[0].icon }}
                  </v-icon>
                  <div class="font-regular pt-4 display-1">
                    {{ getTodaysTasks[0].name }}
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
                    <v-avatar left>
                      <img
                        src="https://randomuser.me/api/portraits/men/81.jpg"
                      />
                    </v-avatar>
                    {{ getUserName(getTodaysTasks[0].assigned) }}
                  </v-chip>
                </v-card>
                <v-card v-else raised class="main-task text-center secondary">
                  <div class="overline text--disabled">DUE TODAY</div>
                  <v-icon class="text--disabled" style="font-size: 10em" x-large
                    >bathtub</v-icon
                  >
                  <div class="font-regular pt-4 display-1 text--disabled">
                    Just chillin'
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
          <div class="overline">other:</div>
          <v-list avatar class="text-left pl-4">
            <div v-if="getTodaysTasks.length > 1">
              <v-list-item
                v-for="(task, i) in getTodaysTasks.slice(
                  1,
                  getTodaysTasks.length
                )"
                :key="'task-' + i"
              >
                <v-list-item-avatar>
                  <v-icon>{{ task.icon }}</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="task-entry">
                    {{ task.name }}
                    <div class="overline pl-2 pt-1">- {{ task.time }}</div>
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    <v-chip small>
                      <v-avatar style="max-height: 80%; max-width: 90%" left>
                        <img
                          src="https://randomuser.me/api/portraits/men/81.jpg"
                        />
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
                <v-list-item-title class="text--disabled"
                  >Nothing to do</v-list-item-title
                >
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
          :on-demand-tasks="onDemandTasks"
          :timed-tasks="timedTasks"
          :loading="loading"
          @reminder="triggerReminder"
          @checktask="checkTask"
        ></UpcomingTasksCard>
      </v-col>
      <v-col cols="12" md="6">
        <RepeatingTasksCard
          :repeating-tasks="repeatingTasks"
          :loading="loading"
        ></RepeatingTasksCard>
      </v-col>
      <v-col cols="12" md="6">
        <v-card outlined :loading="loading" style="height: 100%">
          <v-card-title>
            <h2 class="title">Recently finished tasks</h2>
          </v-card-title>
          <v-card-text>
            <v-list v-if="oldSingleTasks.length > 0">
              <v-list-item
                v-for="(task, i) in oldSingleTasks"
                :key="'task-' + i"
              >
                <v-list-item-avatar>
                  <v-icon x-large color="grey">{{ task.icon }}</v-icon>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title class="pb-2 task-entry">
                    {{ task.name }}
                    <div class="overline pl-2 pt-1">
                      - {{ format(new Date(task.day)) }}
                    </div>
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    <v-chip>
                      <v-avatar left>
                        <img
                          src="https://randomuser.me/api/portraits/men/81.jpg"
                        />
                      </v-avatar>
                      {{ getUserName(task.assigned) }}
                    </v-chip>
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-icon>
                  <v-hover>
                    <v-btn icon @click="checkTask(task)">
                      <v-icon v-if="task.checked">check_box</v-icon>
                      <v-icon v-else>check_box_outline_blank</v-icon>
                    </v-btn>
                  </v-hover>
                </v-list-item-icon>
              </v-list-item>
            </v-list>
            <div
              v-else
              style="text-align: center"
              class="text--disabled pb-12 pt-8"
            >
              <v-icon style="font-size: 10em" class="text--disabled"
                >format_list_numbered</v-icon
              >
              <br />You really need to start getting stuff done!
            </div>
          </v-card-text>
        </v-card></v-col
      >
    </v-row>
  </v-container>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { formatDateString } from "@/assets/tasksHelper";
import RepeatingTasksCard from "@/components/RepeatingTasksCard.vue";
import UpcomingTasksCard from "@/components/UpcomingTasksCard.vue";

export default {
  name: "Tasks",
  components: {
    RepeatingTasksCard,
    UpcomingTasksCard
  },
  data: () => ({
    loading: false
  }),
  computed: {
    ...mapState("tasks", ["oldSingleTasks"]),
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
      } catch (err) {
        this.$store.dispatch(
          "showSnackbar",
          err || "Could not fetch tasks. Please try again later."
        );
        console.warn(err);
      }
      this.loading = false;
    },
    async checkTask(task) {
      this.loading = true;
      try {
        await this.$store.dispatch("tasks/checkTask", task);
        await this.fetchTasks();
      } catch (err) {
        this.$store.dispatch(
          "showSnackbar",
          err || "Could not check task. Please try again later."
        );
        console.warn(err);
      }
      this.loading = false;
    },
    async triggerReminder(task) {
      this.loading = true;
      try {
        await this.$store.dispatch("tasks/triggerReminder", task);
        this.$store.dispatch(
          "showSnackbar",
          "You've reminded " +
            this.getUserName(task.assigned) +
            " of " +
            task.name
        );
      } catch (err) {
        this.$store.dispatch(
          "showSnackbar",
          err || "Error triggering the reminder."
        );
      }
      this.loading = false;
    },
    format: formatDateString
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
