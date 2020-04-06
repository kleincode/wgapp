<template>
  <v-container fluid>
    <h1 class="display-2 pb-6">Tasks</h1>
    <v-row>
      <v-col cols="12" md="6" lg="4">
        <v-card outlined class="text-center">
          <h2 class="title pt-8 pb-12">Today's Tasks:</h2>
          <div class="container">
            <v-row justify="center">
              <v-col cols="12" md="10">
                <v-card
                  raised
                  class="main-task text-center"
                  v-if="getTodaysTasks.length > 0"
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
                <v-card raised class="main-task text-center secondary" v-else>
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

          <v-divider class="mt-4 mb-4"></v-divider>
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
        <v-card outlined>
          <v-row>
            <v-col cols="9" md="10" lg="10">
              <h2 class="title pl-8 pt-4">All Tasks:</h2>
            </v-col>
            <v-col class="text-right pt-5 pr-8" cols="3" md="2" lg="2">
              <v-btn fab class="mx-2 primary" :to="{ name: 'AddTask' }">
                <v-icon>add</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-list v-if="tasks.length > 0">
            <v-list-item
              v-for="(task, i) in tasks"
              :key="'task-' + i"
              :class="task.missed ? 'red' : ''"
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
            style="text-align: center"
            class="text--disabled pb-12 pt-8"
            v-else
          >
            <v-icon style="font-size: 10em" class="text--disabled"
              >hourglass_empty</v-icon
            >
            <br />No tasks added yet
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import icons from "@/assets/icons.js";
import { mapGetters } from "vuex";

export default {
  name: "Tasks",
  data: () => ({
    tasks: []
  }),

  methods: {
    async fetchTasks() {
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
            let correctedStartDate = new Date(element.startDate.substr(0, 19));
            correctedStartDate.setHours(correctedStartDate.getHours() + 13);
            let nextDueDay = this.computeNextDueDay(
              curDate,
              correctedStartDate,
              element.repetitionDays,
              element.repetitionUnit,
              element.repetitionEvery
            );
            let lastExecution = new Date(element.lastExecution.substr(0, 19));
            lastExecution.setHours(lastExecution.getHours() + 2);
            let taskStatus = this.checkStatus(
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
          });
          this.sortTasks();
        }
      } catch (err) {
        console.error(err);
      }
    },

    //2=done today, 1=not done but okay, 0=missed
    checkStatus(
      lastExecution,
      nextDueDay,
      repDays,
      repEvery,
      repUnit,
      startDate,
      curDateBegin,
      curDateEnd
    ) {
      let repDayInts = repDays.map(day => this.mapWeekdayToInt(day));
      nextDueDay = new Date(nextDueDay);
      if (curDateEnd < startDate) {
        //in the future
        if (
          curDateBegin < lastExecution ||
          this.isToday(curDateBegin, lastExecution)
        ) {
          return [2, new Date()];
        }
        return [1, null];
      }
      if (
        curDateBegin < lastExecution ||
        this.isToday(curDateBegin, lastExecution)
      ) {
        return [2, new Date()];
      }
      let max = -1;
      let lastDueDay = new Date(curDateBegin);
      for (let i = 0; i < repDayInts.length; i++) {
        if (repDayInts[i] > max && repDayInts[i] < curDateBegin.getDay()) {
          max = repDayInts[i];
        }
      }
      if (max == -1) {
        //change intervall
        lastDueDay = this.shiftIntervall(nextDueDay, -repEvery, repUnit);
        max = -1;
        for (let i = 0; i < repDayInts.length; i++) {
          if (repDayInts[i] > max) {
            max = repDayInts[i];
          }
        }
      }
      if (max == -1) {
        return;
      }
      lastDueDay.setDate(lastDueDay.getDate() + (max - lastDueDay.getDay()));

      lastDueDay.setHours(0, 0, 0, 1);
      let endLastDueDay = new Date(lastDueDay);
      endLastDueDay.setHours(23, 59, 59, 0);
      if (lastExecution < lastDueDay) {
        return [0, lastDueDay];
      }
      return [1, lastDueDay];
    },

    isToday(date, curDate) {
      return (
        date.getDate() == curDate.getDate() &&
        date.getMonth() == curDate.getMonth() &&
        date.getYear() == curDate.getYear()
      );
    },

    computeNextDueDay(
      curDate,
      startDateInput,
      repetitionDays,
      repetitionUnit,
      repetitionEvery
    ) {
      let repDayInts = repetitionDays.map(day => this.mapWeekdayToInt(day));
      let startDate = new Date(startDateInput);
      if (curDate < startDate) {
        let res = this.computeNextDueInWeek(curDate, repDayInts, startDate);
        if (res == null) {
          startDate = this.shiftToNextIntervall(
            startDate,
            repetitionEvery,
            repetitionUnit
          );
          res = this.computeNextDueInWeek(curDate, repDayInts, startDate);
        }
        return res;
      } else {
        let tempDate = new Date(startDate);
        let prevTempDate;
        while (curDate > tempDate) {
          prevTempDate = new Date(tempDate);
          tempDate = this.shiftToNextIntervall(
            tempDate,
            repetitionEvery,
            repetitionUnit
          );
        }
        let res = this.computeNextDueInWeek(curDate, repDayInts, prevTempDate);
        if (res == null) {
          startDate = this.shiftToNextIntervall(
            prevTempDate,
            repetitionEvery,
            repetitionUnit
          );
          res = this.computeNextDueInWeek(curDate, repDayInts, prevTempDate);
        }
        return res;
      }
    },

    isSameWeek(d1, d2) {
      let date1 = new Date(d1),
        date2 = new Date(d2);
      if (date1.getDay() == 0) {
        date1.setDate(date1.getDate() - 6);
      } else {
        date1.setDate(date1.getDate() - date1.getDay() + 1);
      }
      if (date2.getDay() == 0) {
        date2.setDate(date2.getDate() - 6);
      } else {
        date2.setDate(date2.getDate() - date2.getDay() + 1);
      }
      return this.isToday(date1, date2);
    },

    computeNextDueInWeek(curDate, repDayInts, prevTempDate) {
      prevTempDate = new Date(prevTempDate);
      let day = prevTempDate.getDay();
      if (curDate.getDay() > 0) {
        let minShift = 8;
        for (let i = 0; i < repDayInts.length; i++) {
          if (repDayInts[i] != 0) {
            if (repDayInts[i] >= day && repDayInts[i] < minShift) {
              let sameWeek = this.isSameWeek(curDate, prevTempDate);
              if (
                (sameWeek && repDayInts[i] >= curDate.getDay()) ||
                !sameWeek
              ) {
                minShift = repDayInts[i];
              }
            }
          } else {
            if (7 < minShift) {
              minShift = 7;
            }
          }
        }
        if (minShift == 7) {
          prevTempDate.setDate(
            prevTempDate.getDate() + (6 - prevTempDate.getDay() + 1)
          );
          return prevTempDate;
        }
        prevTempDate.setDate(
          prevTempDate.getDate() + (minShift - prevTempDate.getDay())
        );
        if (prevTempDate < curDate || minShift == 8) {
          return null;
        }
        return prevTempDate;
      } else {
        if (repDayInts.includes(0)) {
          return curDate;
        } else {
          return null;
        }
      }
    },

    shiftToNextIntervall(date, repEvery, repUnit) {
      if (repUnit == 0) {
        date.setDate(date.getDate() + 7 * repEvery);
        return this.setToMonday(date);
      } else {
        date.setDate(date.getDate() + 28 * repEvery);
        return this.setToMonday(date);
      }
    },

    shiftIntervall(date, repEvery, repUnit) {
      if (repUnit == 0) {
        date.setDate(date.getDate() + 7 * repEvery);
        return date;
      } else {
        date.setDate(date.getDate() + 28 * repEvery);
        return date;
      }
    },

    setToMonday(date) {
      if (date.getDay() == 0) {
        date.setDate(date.getDate() - 6);
      } else {
        date.setDate(date.getDate() - date.getDay() + 1);
      }
      return date;
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
      let lastExecution, assignedMember;
      let users = this.getUserSelect.map(entry => entry.value);
      let index = users.indexOf(task.assigned);
      if (!task.checked) {
        //check
        lastExecution = new Date().toString();
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
        console.error(data.message);
      }
      await this.fetchTasks();
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

    mapWeekdayToInt(repetitionDay) {
      switch (repetitionDay) {
        case "monday":
          return 1;
        case "tuesday":
          return 2;
        case "thursday":
          return 3;
        case "wednesday":
          return 4;
        case "friday":
          return 5;
        case "saturday":
          return 6;
        case "sunday":
          return 0;
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
  },

  mounted() {
    this.fetchTasks();
  },

  computed: {
    getTodaysTasks() {
      return this.tasks.filter(task => {
        return this.isToday(task.nextDueDay, new Date());
      });
    },

    ...mapGetters(["getUserName", "getUserInitials", "getUserSelect"])
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
