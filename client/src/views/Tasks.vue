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
                    <v-btn icon @click="checkedTasks(getTodaysTasks[0])">
                      <v-icon v-if="getTodaysTasks[0].checked"
                        >check_box</v-icon
                      >
                      <v-icon v-else>check_box_outline_blank</v-icon>
                    </v-btn>
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
                    Nothing to do
                  </div>
                  <div class="caption pt-2 text--disabled">--:--</div>
                  <v-divider class="mt-4 mb-4"></v-divider>
                  <v-chip style="width: 30%">
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
                  <v-btn icon @click="checkedTasks(task)">
                    <v-icon v-if="task.checked">check_box</v-icon>
                    <v-icon v-else>check_box_outline_blank</v-icon>
                  </v-btn>
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
                <v-btn icon>
                  <v-icon class="text--disabled">check</v-icon>
                </v-btn>
              </v-list-item-icon>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="8">
        <v-card outlined :loading="loading" style="height: 100%">
          <v-card-title>
            <v-row>
              <v-col cols="9" md="10" lg="10">
                <h2 class="title">Upcoming Tasks</h2>
              </v-col>
              <v-col class="text-right" cols="3" md="2" lg="2">
                <v-btn fab class="mx-2 primary" :to="{ name: 'AddTask' }">
                  <v-icon>add</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <!--TIMED TASKS -->
            <div class="title">Timed tasks</div>
            <v-list v-if="timedTasks.length > 0">
              <v-list-item
                v-for="(task, i) in timedTasks"
                :key="'task-' + i"
                :class="task.missed ? 'red' : ''"
              >
                <v-list-item-avatar>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon
                        :color="task.mode == 1 ? '' : 'primary'"
                        x-large
                        v-on="on"
                        >{{ task.icon }}</v-icon
                      >
                    </template>
                    <span>{{
                      task.mode == 0
                        ? "This is a repeating task"
                        : "This is a one-time task"
                    }}</span>
                  </v-tooltip>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title class="pb-2 task-entry">
                    {{ task.name }}
                    <div class="overline pl-2 pt-1">
                      - {{ task.day }}, {{ task.time }}
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
                    <v-btn icon @click="checkedTasks(task)">
                      <v-icon v-if="task.checked">check_box</v-icon>
                      <v-icon v-else>check_box_outline_blank</v-icon>
                    </v-btn>
                  </v-hover>
                  <v-hover>
                    <v-btn
                      icon
                      :to="{ name: 'EditTask', params: { id: task.id } }"
                    >
                      <v-icon>edit</v-icon>
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
                >hourglass_empty</v-icon
              >
              <br />No timed tasks added yet
            </div>

            <!--ON DEMAND TASKS -->
            <div class="title">On-Demand Tasks</div>
            <v-list v-if="onDemandTasks.length > 0">
              <v-list-item
                v-for="(task, i) in onDemandTasks"
                :key="'task-' + i"
                :class="task.missed ? 'red' : ''"
              >
                <v-list-item-avatar>
                  <v-icon color="warning" x-large>{{ task.icon }}</v-icon>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title class="pb-2 task-entry">
                    {{ task.name }}
                    <div class="overline pl-2 pt-1">
                      - last: {{ formatLastExecution(task) }}
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
                    <v-btn icon @click="checkedTasks(task)">
                      <v-icon v-if="task.checked">check_box</v-icon>
                      <v-icon v-else>check_box_outline_blank</v-icon>
                    </v-btn>
                  </v-hover>
                  <v-hover>
                    <v-btn
                      icon
                      :to="{ name: 'EditTask', params: { id: task.id } }"
                    >
                      <v-icon>edit</v-icon>
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
                >hourglass_empty</v-icon
              >
              <br />No on-demand tasks added yet
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card outlined :loading="loading" style="height: 100%">
          <v-card-title>
            <h2 class="title">Manage repeating tasks</h2>
          </v-card-title>
          <v-card-text>
            <v-list v-if="repeatingTasks.length > 0">
              <v-list-item
                v-for="(task, i) in repeatingTasks"
                :key="'task-' + i"
              >
                <v-list-item-avatar>
                  <v-icon x-large>{{ task.icon }}</v-icon>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title class="pb-2 task-entry">
                    {{ task.name }}
                    <div class="overline pl-2 pt-1">
                      - {{ task.day }}, {{ task.time }}
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
                    <v-btn
                      icon
                      :to="{ name: 'EditTask', params: { id: task.id } }"
                    >
                      <v-icon>edit</v-icon>
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
                >hourglass_empty</v-icon
              >
              <br />No repeating tasks added yet
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card outlined :loading="loading" style="height: 100%">
          <v-card-title>
            <h2 class="title">Old tasks</h2>
          </v-card-title>
        </v-card></v-col
      >
    </v-row>
  </v-container>
</template>
<script>
import icons from "@/assets/icons.js";
import { mapGetters } from "vuex";
import {
  checkStatus,
  computeNextDueDay,
  isToday
} from "@/assets/repeatingTasksHelper.js";

export default {
  name: "Tasks",
  data: () => ({
    tasks: [],
    loading: false
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
      return this.tasks.filter(task => task.mode < 2);
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
            let lastExecution = new Date(element.lastExecution.substr(0, 19));
            switch (element.mode) {
              case 0: {
                //Single
                let correctedStartDate = new Date(
                  element.startDate.substr(0, 19)
                );
                let time = element.time.substr(0, 5);
                correctedStartDate.setHours(correctedStartDate.getHours() + 13);
                correctedStartDate.setHours(
                  parseInt(time.substr(0, 2)),
                  parseInt(time.substr(3, 2))
                );
                let status = this.getSingleStatus(
                  correctedStartDate,
                  lastExecution
                );
                this.tasks.push({
                  id: element.id,
                  mode: element.mode,
                  name: element.name,
                  assigned: element.assignedMember,
                  day: this.formatDateString(correctedStartDate),
                  dueDay: correctedStartDate,
                  time: time,
                  lastExecution: lastExecution,
                  missed: !status,
                  checked: status == 2,
                  icon: icons[element.icon]
                });
                break;
              }
              case 1: {
                //Repeating
                let correctedStartDate = new Date(
                  element.startDate.substr(0, 19)
                );
                correctedStartDate.setHours(correctedStartDate.getHours() + 13);
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
                  assigned: element.assignedMember,
                  day: this.formatDateString(nextDueDay),
                  iteratingMode: element.iteratingMode,
                  nextDueDay: new Date(nextDueDay),
                  time: element.time.substr(0, 5),
                  lastExecution: lastExecution,
                  missed: !taskStatus[0],
                  checked: taskStatus[0] == 2,
                  icon: icons[element.icon],
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
                  checked: this.getOnDemandStatus(lastExecution),
                  icon: icons[element.icon]
                });
                break;
              }
            }
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
      }
      this.loading = false;
    },

    formatLastExecution(task) {
      if (task.lastExecution.toString() == "Invalid Date") {
        return "none";
      } else {
        return this.formatDateString(task.lastExecution);
      }
    },

    getOnDemandStatus(lastExecution) {
      let curDate = new Date();
      curDate.setHours(curDate.getHours() - 2);
      if (curDate < lastExecution) {
        return 1;
      } else {
        return 2;
      }
    },

    getSingleStatus(dueDate, lastExecution) {
      let curDate = new Date();
      if (curDate < dueDate) {
        if (lastExecution.getTime() == 0) {
          return 0;
        } else {
          return 2;
        }
      } else {
        if (lastExecution.getTime() == 0) {
          return 1;
        } else {
          return 2;
        }
      }
    },

    formatDateString(date) {
      let curDate = new Date();
      if (
        date.getDate() == curDate.getDate() &&
        date.getMonth() == curDate.getMonth() &&
        date.getYear() == curDate.getYear()
      ) {
        return "Today";
      }
      curDate.setDate(curDate.getDate() + 1);
      if (
        date.getDate() == curDate.getDate() &&
        date.getMonth() == curDate.getMonth() &&
        date.getYear() == curDate.getYear()
      ) {
        return "Tomorrow";
      }
      return (
        this.mapIntoToWeekday(date.getDay()) +
        ", " +
        date.getDate() +
        ". " +
        (date.getMonth() + 1)
      );
    },

    async checkedTasks(task) {
      this.loading = true;
      let lastExecution, assignedMember;
      let users = this.getUserSelect.map(entry => entry.value);
      let index = users.indexOf(task.assigned);
      if (!task.checked) {
        //check
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
      } else {
        //uncheck
        let date = new Date(task.lastDueDay);
        date.setDate(date.getDate() - 1);
        lastExecution = date.toString();
        if (task.iteratingMode) {
          assignedMember = users[this.previousAssignedMember(users, index)];
        } else {
          assignedMember = task.assigned;
        }
      }
      let id = task.id;
      const { data } = await this.$http.post("/_/checktask", {
        id,
        lastExecution,
        assignedMember
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

    mapIntoToWeekday(day) {
      switch (day) {
        case 1:
          return "Monday";
        case 2:
          return "Tuesday";
        case 3:
          return "Thursday";
        case 4:
          return "Wednesday";
        case 5:
          return "Friday";
        case 6:
          return "Saturday";
        case 0:
          return "Sunday";
      }
    },

    sortTasks() {
      this.tasks.sort((a, b) => a.nextDueDay - b.nextDueDay);
    }
  }
};
</script>
<style lang="scss" scoped>
.tasks-card {
  min-width: 50%;
  max-width: 90%;
  width: 700px;
}
.fill-width {
  width: 100%;
}

.fill-height {
  height: 100%;
}

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
