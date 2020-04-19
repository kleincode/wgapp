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
                    {{ getIcons()[getTodaysTasks[0].icon] }}
                  </v-icon>
                  <div class="font-regular pt-4 display-1">
                    {{ getTodaysTasks[0].name }}
                    <br />
                    <v-btn icon @click="checkedTasks(getTodaysTasks[0])">
                      <v-icon v-if="getTodaysTasks[0].checked"
                        >check_box</v-icon
                      >
                      <v-icon v-else>check_box_outline_blank</v-icon>
                    </v-btn>
                    <v-btn icon @click="reminder(getTodaysTasks[0])"
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
                :class="RepeatingTasksCard.missed ? 'red' : 'primary'"
              >
                <v-list-item-avatar>
                  <v-icon>{{ getIcons()[task.icon] }}</v-icon>
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
                  <v-btn icon @click="checkedTasks(task)">
                    <v-icon v-if="task.checked">check_box</v-icon>
                    <v-icon v-else>check_box_outline_blank</v-icon>
                  </v-btn>
                  <v-btn icon @click="reminder(task)"
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
          @reminder="reminder"
          @checktask="checkedTasks"
        ></UpcomingTasksCard>
      </v-col>
      <v-col cols="12" md="6">
        <RepeatingTasksCard
          :repeating-tasks="repeatingTasks"
          :loading="loading"
        ></RepeatingTasksCard>
      </v-col>
      <v-col cols="12" md="6">
        <TasksLogCard :tasks="loggedTasks" :loading="loading"></TasksLogCard
      ></v-col>
    </v-row>
    <v-snackbar v-model="taskCheckSnack">
      Checked {{ checkedTask.name }}
      <v-btn color="primary" text @click="undoSingleTask(checkedTask)">
        undo
      </v-btn>
    </v-snackbar>
  </v-container>
</template>
<script>
import icons from "@/assets/icons.js";
import { mapGetters } from "vuex";
import RepeatingTasksCard from "@/components/RepeatingTasksCard.vue";
import UpcomingTasksCard from "@/components/UpcomingTasksCard.vue";
import TasksLogCard from "@/components/TasksLogCard.vue";
import {
  checkStatus,
  computeNextDueDay,
  isToday,
  getOnDemandStatus,
  getSingleStatus,
  formatDateString
} from "@/assets/tasksHelper.js";

export default {
  name: "Tasks",
  components: {
    RepeatingTasksCard,
    UpcomingTasksCard,
    TasksLogCard
  },
  data: () => ({
    tasks: [],
    loggedTasks: [],
    loading: false,
    checkedTask: {},
    taskCheckSnack: false
  }),
  computed: {
    getTodaysTasks() {
      return this.timedTasks.filter(task => {
        if (task.mode == 0) {
          return isToday(task.dueDay, new Date());
        } else {
          return isToday(task.nextDueDay, new Date());
        }
      });
    },
    repeatingTasks() {
      return this.tasks.filter(task => task.mode == 1);
    },
    timedTasks() {
      let curDate = new Date();
      return this.tasks.filter(
        task =>
          task.mode == 1 ||
          (task.mode == 0 && (task.dueDay > curDate || task.missed))
      );
    },
    onDemandTasks() {
      return this.tasks.filter(task => task.mode == 2);
    },
    ...mapGetters(["getUserName", "getUserInitials", "getUserSelect"])
  },
  mounted() {
    this.fetchTasks();
  },
  methods: {
    async fetchTasks() {
      this.loading = true;
      try {
        const { data } = await this.$http.get("/_/fetchtasks");
        if (data.success) {
          this.tasks = [];
          let curDateBegin = new Date();
          curDateBegin.setHours(0, 0, 1, 0);
          let curDateEnd = new Date();
          curDateEnd.setHours(12, 59, 59, 0);
          let curDate = new Date();
          curDate.setHours(12, 0, 0, 0);
          data.data.forEach(element => {
            let lastExecution = new Date(element.lastExecution);
            if (isNaN(lastExecution.getTime())) {
              lastExecution = new Date(0);
            }
            switch (element.mode) {
              case 0: {
                //Single
                let correctedStartDate = new Date(element.startDate);
                let time = element.time.substr(0, 5);
                let status = getSingleStatus(correctedStartDate, lastExecution);
                this.tasks.push({
                  id: element.id,
                  mode: element.mode,
                  name: element.name,
                  assigned: element.assignedMember,
                  day: formatDateString(correctedStartDate),
                  nextDueDay: correctedStartDate,
                  startDate: correctedStartDate,
                  dueDay: correctedStartDate,
                  time: time,
                  missed: status == 1,
                  checked: status == 2,
                  icon: element.icon
                });
                break;
              }
              case 1: {
                //Repeating
                let correctedStartDate = new Date(
                  element.startDate.substr(0, 19)
                );
                correctedStartDate.setHours(correctedStartDate.getHours() + 13);
                if (element.repetitionDays.length == 0) {
                  this.$store.dispatch(
                    "showSnackbar",
                    "Error while fetching data. The repetitionDays configuration is empty. Please contact support."
                  );
                  return;
                }
                let nextDueDay = computeNextDueDay(
                  curDate,
                  correctedStartDate,
                  element.repetitionDays,
                  element.repetitionUnit,
                  element.repetitionEvery
                );
                lastExecution.setHours(lastExecution.getHours() + 2);
                let taskStatus = checkStatus(
                  lastExecution,
                  nextDueDay,
                  element.repetitionDays,
                  element.repetitionEvery,
                  element.repetitionUnit,
                  correctedStartDate,
                  curDateBegin,
                  curDateEnd
                );
                this.tasks.push({
                  id: element.id,
                  mode: element.mode,
                  name: element.name,
                  startDate: correctedStartDate,
                  repetitionDays: element.repetitionDays,
                  repetitionEvery: element.repetitionEvery,
                  repetitionUnit: element.repetitionUnit,
                  assigned: element.assignedMember,
                  day: formatDateString(nextDueDay),
                  iteratingMode: element.iteratingMode,
                  nextDueDay: new Date(nextDueDay),
                  time: element.time.substr(0, 5),
                  lastExecution: lastExecution,
                  missed: !taskStatus[0],
                  checked: taskStatus[0] == 2,
                  icon: element.icon,
                  lastDueDay: taskStatus[1]
                });
                break;
              }
              case 2: {
                //On-Demand
                this.tasks.push({
                  id: element.id,
                  mode: element.mode,
                  name: element.name,
                  assigned: element.assignedMember,
                  lastExecution: lastExecution,
                  checked: getOnDemandStatus(new Date(), lastExecution),
                  icon: element.icon
                });
                break;
              }
            }
          });
          this.loggedTasks = [];
          data.loggedTasks.forEach(task => {
            this.loggedTasks.push({
              name: task.name,
              time: task.time,
              icon: task.icon,
              assigned: task.assignedMember
            });
          });
          this.sortTasks();
        } else {
          this.$store.dispatch(
            "showSnackbar",
            "Error while fetching data. Please try again later."
          );
          console.error(data);
        }
      } catch (err) {
        this.$store.dispatch(
          "showSnackbar",
          "Error while fetching data. Please try again later."
        );
        console.error(err);
        this.loading = false;
      }
      this.loading = false;
    },

    async checkedTasks(task) {
      let lastExecution, assignedMember, due;
      let users = this.getUserSelect.map(entry => entry.value);
      let index = users.indexOf(task.assigned);
      if (task.mode == 0) {
        //single task
        this.checkSingleTask(task);
        return;
      }
      if (!task.checked) {
        //check
        switch (task.mode) {
          case 1: {
            if (task.missed) {
              lastExecution = new Date(task.lastDueDay).toString();
            } else {
              lastExecution = new Date().toString();
            }
            if (task.iteratingMode) {
              assignedMember = users[this.nextAssignedMember(users, index)];
            } else {
              assignedMember = task.assigned;
            }
            let curDate = new Date();
            if (new Date() < task.nextDueDay) {
              due = task.nextDueDay;
            } else {
              curDate.setDate(curDate.getDate() + 1);
              due = computeNextDueDay(
                curDate,
                task.startDate,
                task.repetitionDays,
                task.repetitionUnit == "Weeks" ? 0 : 1,
                task.repetitionEvery
              );
            }
            due = new Date(
              due.toISOString().substr(0, 10) + "T" + task.time + ":00.000Z"
            ).toISOString();
            break;
          }
          case 2:
            assignedMember = users[this.nextAssignedMember(users, index)];
            lastExecution = new Date().toISOString();
            due = "";
            break;
        }
      } else {
        //uncheck
        switch (task.mode) {
          case 1: {
            let date = new Date(task.lastDueDay);
            date.setDate(date.getDate() - 1);
            lastExecution = date.toString();
            if (task.iteratingMode) {
              assignedMember = users[this.previousAssignedMember(users, index)];
            } else {
              assignedMember = task.assigned;
            }
            due = new Date(
              task.lastDueDay.toISOString().substr(0, 10) +
                "T" +
                task.time +
                ":00.000Z"
            ).toISOString();
            break;
          }
          case 2:
            //you can't undo on-demand tasks
            this.$store.dispatch(
              "showSnackbar",
              "You can't undo on-demand tasks. The task will automatically undone 2h after it was checked."
            );
            this.loading = false;
            return;
        }
      }
      let id = task.id;
      this.pushNewTaskAction(task);
      this.finishCheck(id, lastExecution, assignedMember, due);
    },

    async checkSingleTask(task) {
      if (!task.checked) {
        this.checkedTask = task;
        this.taskCheckSnack = true;
        let lastExecution = new Date().toString();
        let assignedMember = task.assigned;
        let due = task.dueDay;
        await this.pushNewTaskAction(task);
        await this.finishCheck(task.id, lastExecution, assignedMember, due);
      }
    },

    async pushNewTaskAction(task) {
      let id = task.id;
      let time = new Date().toISOString();
      let name = task.name;
      let assignedMember = task.assigned;
      let icon = task.icon;
      let done = !task.checked;
      try {
        await this.$http.post("/_/pushtaskaction", {
          id,
          time,
          name,
          assignedMember,
          icon,
          done
        });
      } catch (err) {
        console.log(err);
        this.$store.dispatch(
          "showSnackbar",
          "Error while pushing to task log."
        );
      }
    },

    async finishCheck(id, lastExecution, assignedMember, due) {
      const { data } = await this.$http.post("/_/checktask", {
        id,
        lastExecution,
        assignedMember,
        due
      });
      if (data.success == false) {
        this.$store.dispatch(
          "showSnackbar",
          "Error while checking task. Please try again later."
        );
        console.error(data.message);
      }
      await this.fetchTasks();
      this.loading = false;
    },

    async undoSingleTask(task) {
      this.taskCheckSnack = false;
      let lastExecution = "0";
      let assignedMember = task.assigned;
      let due = task.dueDay;
      this.pushNewTaskAction(task);
      this.finishCheck(task.id, lastExecution, assignedMember, due);
    },

    nextAssignedMember(users, index) {
      if (users.length > index + 1) {
        return index + 1;
      } else {
        return 0;
      }
    },

    previousAssignedMember(users, index) {
      if (0 < index) {
        return index - 1;
      } else {
        return users.length - 1;
      }
    },

    async reminder(task) {
      try {
        let id = task.id;
        const { data } = await this.$http.post("/_/pushreminder", {
          id
        });
        if (data.success) {
          this.$store.dispatch(
            "showSnackbar",
            "You've reminded " +
              this.getUserName(task.assigned) +
              " of " +
              task.name
          );
        } else {
          this.$store.dispatch(
            "showSnackbar",
            "Error triggering the reminder."
          );
        }
      } catch (err) {
        this.$store.dispatch("showSnackbar", "Server Error.");
        console.log(err);
      }
    },

    format(str) {
      return formatDateString(str);
    },

    sortTasks() {
      this.tasks.sort((a, b) => a.nextDueDay - b.nextDueDay);
      this.loggedTasks.sort((a, b) => new Date(b.time) - new Date(a.time));
    },

    getIcons() {
      return icons;
    }
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
