<template>
  <Widget
    :title="$t('widgets.tasks.title')"
    :content-pad="false"
    :large="tasksWidgetLarge"
    :context-items="contextItems"
    :loading="loading"
    @context-action="contextAction"
    @togglesize="tasksWidgetLarge = !tasksWidgetLarge"
  >
    <template v-if="getTodaysTasks.length">
      <v-carousel
        cycle
        hide-delimiter-background
        :show-arrows="false"
        height="95%"
        delimiter-icon="fiber_manual_record"
        :interval="10000"
        :dark="$vuetify.theme.dark"
        :light="!$vuetify.theme.dark"
      >
        <v-carousel-item
          v-for="(task, i) in getTodaysTasks"
          :key="i"
          class="pl-5 pr-5"
        >
          <v-row v-if="tasksWidgetLarge" style="height: 100%">
            <v-col cols="12" class="text-center">
              <v-icon
                style="font-size: 5em"
                large
                :color="task.missed ? 'red' : 'primary'"
                >{{ getIcon(task.icon) || "event_note" }}</v-icon
              >
              <h2 class="display-1 mt-4">
                {{ task.name || $t("widgets.tasks.unnamedTask") }}
              </h2>
              <p :class="task.missed ? 'red--text' : ''" class="ma-0">
                {{ getDisplayDue(task) }}
              </p>
              <v-chip class="mt-1">
                <v-avatar
                  style="max-height: 80%; max-width: 90%"
                  left
                  color="green"
                >
                  <span class="white--text">{{
                    getUserInitials(task.assigned)
                  }}</span>
                </v-avatar>
                {{ getUserName(task.assigned) }}
              </v-chip>
            </v-col>
            <v-col cols="12" class="text-center">
              <v-btn
                v-if="task.missed"
                icon
                class="ml-2 mt-1"
                @click="triggerReminder(task)"
              >
                <v-icon>notifications_active</v-icon>
              </v-btn>
              <v-btn icon @click="checkTask(task)">
                <v-icon v-if="task.checked">check_box</v-icon>
                <v-icon v-else>check_box_outline_blank</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-list-item v-else>
            <v-list-item-avatar>
              <v-icon large :color="task.missed ? 'red' : 'primary'">{{
                getIcon(task.icon) || "event_note"
              }}</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title
                class="task-entry"
                :color="task.missed ? 'red' : ''"
              >
                {{ task.name || $t("widgets.tasks.unnamedTask") }}
                <div
                  class="overline pl-2 pt-1"
                  :class="task.missed ? 'red--text' : false"
                >
                  - {{ task.time || $t("general.today") }}
                </div>
              </v-list-item-title>
              <v-list-item-subtitle>
                <v-chip class="mt-1">
                  <v-avatar
                    style="max-height: 80%; max-width: 90%"
                    left
                    color="green"
                  >
                    <span class="white--text">{{
                      getUserInitials(task.assigned)
                    }}</span>
                  </v-avatar>
                  {{ getUserName(task.assigned) }}
                </v-chip>
                <v-btn
                  v-if="task.missed"
                  icon
                  class="ml-2 mt-1"
                  @click="triggerReminder(task)"
                >
                  <v-icon>notifications_active</v-icon>
                </v-btn>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-carousel-item>
      </v-carousel>
      <v-snackbar v-model="taskCheckSnack">
        {{ $t("tasks.checked") }} {{ checkedTask ? checkedTask.name : "" }}
        <v-btn color="primary" text @click="undoCheckTask">
          {{ $t("commands.undo") }}
        </v-btn>
      </v-snackbar>
    </template>
    <div v-else style="text-align: center" class="text--disabled">
      <v-icon style="font-size: 4em" class="text--disabled"
        >access_alarm</v-icon
      >
      <br />{{ $t("widgets.tasks.done") }}
    </div>
  </Widget>
</template>

<script>
import icons from "@/assets/icons.js";
import { mapGetters } from "vuex";
import Widget from "./Widget";
import { isToday } from "@/assets/tasksHelper.js";

export default {
  name: "TasksWidget",
  components: {
    Widget
  },
  data: () => ({
    loading: false,
    lastUpdate: null,
    taskCheckSnack: false,
    checkedTask: null
  }),
  computed: {
    contextItems() {
      return [
        {
          action: "refresh",
          text: this.$t("commands.refresh"),
          icon: "refresh",
          subtext: this.$t("widgets.lastUpdated", {
            time: this.lastUpdate
              ? this.formatTimeHM(this.lastUpdate)
              : this.$t("widgets.never")
          })
        },
        {
          action: "tasks",
          text: this.$t("widgets.tasks.tasksPage"),
          icon: "list"
        },
        {
          action: "settings",
          text: this.$t("widgets.settings"),
          icon: "settings"
        }
      ];
    },
    tasksWidgetLarge: {
      set(val) {
        this.$store.commit("userSettings/set_key", {
          key: "tasksWidgetLarge",
          value: val
        });
      },
      get() {
        return this.$store.state.userSettings.tasksWidgetLarge;
      }
    },
    ...mapGetters(["getUserName", "getUserInitials"]),
    ...mapGetters("tasks", ["getTodaysTasks"]),
    ...mapGetters("userSettings", ["formatTimeHM", "formatDateYMD"])
  },
  mounted() {
    this.update();
    this.clockIntervalID = setInterval(() => this.update(), 5 * 60 * 1000);
  },
  beforeDestroy() {
    clearInterval(this.clockIntervalID);
  },
  methods: {
    async update() {
      this.loading = true;
      try {
        await this.$store.dispatch("tasks/fetchTasks");
        this.lastUpdate = new Date();
      } catch (err) {
        if (typeof err === "string") {
          this.$store.dispatch("showSnackbar", err);
        }
      }
      this.loading = false;
    },
    async triggerReminder(task) {
      this.loading = true;
      try {
        await this.$store.dispatch("tasks/triggerReminder", task);
        this.$store.dispatch(
          "showSnackbar",
          this.$t("widgets.tasks.notificationSentTo", {
            name: this.getUserName(task.assigned)
          })
        );
      } catch (err) {
        this.$store.dispatch("showSnackbar", err);
      }
      this.loading = false;
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
        await this.update();
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
        await this.update();
      } catch (err) {
        this.$store.dispatch("showSnackbar", this.$t("tasks.errors.undo"));
        console.warn(err);
      }
      this.checkedTask = null;
      this.loading = false;
    },
    getDisplayDue(task) {
      if (task.missed) {
        let date = new Date(task.lastDueDay);
        if (isToday(date, new Date())) {
          return task.time || this.$t("general.today");
        } else {
          return this.formatDateYMD(date) + " - " + task.time;
        }
      } else {
        return task.time || this.$t("general.today");
      }
    },
    contextAction(item) {
      switch (item.action) {
        case "refresh":
          this.update();
          break;
        case "tasks":
          this.$router.push({ name: "TasksOverview" });
          break;
        case "settings":
          this.$router.push({ name: "DashboardSettings", hash: "#tasks" });
      }
    },
    getIcon: index => icons[index]
  }
};
</script>
<style lang="scss" scoped>
.task-entry {
  display: flex;
}
</style>
