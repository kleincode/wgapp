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
                  v-if="tasks.length > 0"
                  :class="tasks[0].missed ? 'red' : 'primary'"
                >
                  <div class="overline">DUE TODAY</div>
                  <v-icon style="font-size: 10em" x-large>
                    {{
                    tasks[0].icon
                    }}
                  </v-icon>
                  <div class="font-regular pt-4 display-1">
                    {{ tasks[0].name }}
                    <v-btn icon @click="checkedTasks(tasks[0].id)">
                      <v-icon x-large>check_box_outline_blank</v-icon>
                    </v-btn>
                  </div>
                  <div class="caption pt-2">{{ tasks[0].time }}</div>
                  <v-divider class="mt-4 mb-4"></v-divider>
                  <v-chip>
                    <v-avatar left>
                      <img src="https://randomuser.me/api/portraits/men/81.jpg" />
                    </v-avatar>
                    {{ tasks[0].assigned }}
                  </v-chip>
                </v-card>
                <v-card raised class="main-task text-center secondary" v-else>
                  <div class="overline text--disabled">DUE TODAY</div>
                  <v-icon class="text--disabled" style="font-size: 10em" x-large>bathtub</v-icon>
                  <div class="font-regular pt-4 display-1 text--disabled">Nothing to do</div>
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
            <div v-if="tasks.length > 1">
              <v-list-item v-for="(task, i) in tasks.slice(1, tasks.length)" :key="'task-' + i">
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
                        <img src="https://randomuser.me/api/portraits/men/81.jpg" />
                      </v-avatar>
                      {{ task.assigned }}
                    </v-chip>
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-icon>
                  <v-btn icon @click="checkedTasks(task.id)">
                    <v-icon>check_box_outline_blank</v-icon>
                  </v-btn>
                </v-list-item-icon>
              </v-list-item>
            </div>
            <v-list-item v-else>
              <v-list-item-avatar>
                <v-icon class="text--disabled">hourglass_empty</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="text--disabled">Nothing to do</v-list-item-title>
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
                <v-icon>{{ task.icon }}</v-icon>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title class="pb-2 task-entry">
                  {{ task.name }}
                  <div class="overline pl-2 pt-1">- {{ task.day }}, {{ task.time }}</div>
                </v-list-item-title>
                <v-list-item-subtitle>
                  <v-chip>
                    <v-avatar left>
                      <img src="https://randomuser.me/api/portraits/men/81.jpg" />
                    </v-avatar>
                    {{ task.assigned }}
                  </v-chip>
                </v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-icon>
                <v-hover>
                  <v-btn icon @click="checkedTasks(task.id)">
                    <v-icon v-if="task.checked">check_box</v-icon>
                    <v-icon v-else>check_box_outline_blank</v-icon>
                  </v-btn>
                </v-hover>
                <v-hover>
                  <v-btn icon :to="{ name: 'EditTask', params: { id: 1 } }">
                    <v-icon>edit</v-icon>
                  </v-btn>
                </v-hover>
              </v-list-item-icon>
            </v-list-item>
          </v-list>
          <div style="text-align: center" class="text--disabled pb-12 pt-8" v-else>
            <v-icon style="font-size: 10em" class="text--disabled">hourglass_empty</v-icon>
            <br />No tasks added yet
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import icons from "@/assets/icons.js";

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
          data.data.forEach(element => {
            let correctedStartDate = new Date(element.startDate.substr(0, 19));
            correctedStartDate.setHours(correctedStartDate.getHours() + 2);
            let nextDueDay = this.computeNextDueDay(
              new Date(),
              correctedStartDate,
              element.repetitionDays,
              element.repetitionUnit,
              element.repetitionEvery
            );
            console.info("NextDueDay for " + element.name + " is " + nextDueDay);
            let lastExecution = new Date(element.lastExecution.substr(0, 19));
            lastExecution.setHours(lastExecution.getHours() + 2);
            let taskStatus = this.checkStatus(
              lastExecution,
              nextDueDay,
              element.repetitionDays,
              element.repetitionEvery,
              element.repetitionUnit,
              correctedStartDate,
              new Date()
            );
            this.tasks.push({
              id: element.id,
              name: element.name,
              assigned: element.assignedMember,
              day: this.formatDateString(nextDueDay),
              time: element.time.substr(0, 5),
              lastExecution: lastExecution,
              missed: !taskStatus,
              checked: taskStatus == 2,
              icon: icons[element.icon]
            });
          });
        }
      } catch (err) {
        console.error(err);
      }
    },

    //2=done today, 1=not done but okay, 0=missed
    checkStatus(lastExecution, nextDueDay, repDays, repEvery, repUnit, startDate, curDate) {
      let repDayInts = repDays.map(day => this.mapWeekdayToInt(day));
      nextDueDay = new Date(nextDueDay);
      if (curDate < startDate) {
        console.log("in the future");
        //in the future
        return 1;
      }
      if (this.isToday(nextDueDay, curDate)) {
        console.log("isToday");
        if (this.isToday(curDate, lastExecution)) {
          return 2;
        }
      }
      let max = -1;
      let lastDueDay = new Date(curDate);
      for (let i = 0; i < repDayInts.length; i++) {
        if (repDayInts[i] > max && repDayInts[i] < curDate.getDay()) {
          max = repDayInts[i];
        }
      }
      if (max == -1) {
        //change intervall
        lastDueDay = this.shiftIntervall(nextDueDay, -repEvery, repUnit);
        console.log("changed intervall to " + lastDueDay);
        max = -1;
        for (let i = 0; i < repDayInts.length; i++) {
            console.log("max :" + max + " - repday" + repDayInts[i]);
          if (repDayInts[i] > max) {
            console.log("max updated:");
            max = repDayInts[i];
          }
        }
      } 
      if (max == -1) {
        console.log("repDays: " + repDayInts);
        console.log("lastExec: " + lastExecution);
        console.log("lastDueDay: " + lastDueDay);
        console.error("Unexpected status: no repDays given");
        return;
      }
      lastDueDay.setDate(lastDueDay.getDate() + (max - lastDueDay.getDay()));
      console.log("lastDueDay: " + lastDueDay);
      console.log("lastExec: " + lastExecution);

      lastDueDay.setHours(0, 0, 0, 1);
      let endLastDueDay = new Date(lastDueDay);
      endLastDueDay.setHours(23, 59, 59, 0);
      if (lastExecution < lastDueDay) {
        console.log("missed");
        return 0;
      }
      return 1;
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
          console.log(startDate);
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
          console.log(prevTempDate);
          res = this.computeNextDueInWeek(curDate, repDayInts, prevTempDate);
        }
        return res;
      }
    },

    computeNextDueInWeek(curDate, repDayInts, prevTempDate) {
      prevTempDate = new Date(prevTempDate);
      let day = prevTempDate.getDay();
      if (day > 0) {
        let minShift = 8;
        for (let i = 0; i < repDayInts.length; i++) {
          if (repDayInts[i] != 0) {
            if (repDayInts[i] >= day && repDayInts[i] < minShift) {
              minShift = repDayInts[i];
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
          return prevTempDate;
        } else {
          prevTempDate.setDate(prevTempDate.getDate() + 1);
          return this.computeNextDueInWeek(curDate, repDayInts, prevTempDate);
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

    async checkedTasks(id) {
      await this.$http.post("/_/checktask", {id});
      await this.fetchTasks();
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
    }
  },

  mounted() {
    this.fetchTasks();
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