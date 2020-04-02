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
                  <v-icon style="font-size: 10em" x-large>{{
                    tasks[0].icon
                  }}</v-icon>
                  <div class="font-regular pt-4 display-1">
                    {{ tasks[0].name }}
                    <v-btn icon>
                      <v-icon x-large>check_box_outline_blank</v-icon>
                    </v-btn>
                  </div>
                  <div class="caption pt-2">{{ tasks[0].time }}</div>
                  <v-divider class="mt-4 mb-4"></v-divider>
                  <v-chip>
                    <v-avatar left>
                      <img
                        src="https://randomuser.me/api/portraits/men/81.jpg"
                      />
                    </v-avatar>
                    {{ tasks[0].assigned }}
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
            <div v-if="tasks.length > 1">
              <v-list-item
                v-for="(task, i) in tasks.slice(1, tasks.length)"
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
                      {{ task.assigned }}
                    </v-chip>
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-icon>
                  <v-btn icon>
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
                <v-icon>{{ task.icon }}</v-icon>
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
                    {{ task.assigned }}
                  </v-chip>
                </v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-icon>
                <v-hover>
                  <v-btn icon>
                    <v-icon>check_box_outline_blank</v-icon>
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
          data.data.forEach(element => {
            let correctedStartDate = new Date(element.startDate.substr(0, 19));
            correctedStartDate.setHours(correctedStartDate.getHours() + 2);
            this.tasks.push({
              name: element.name,
              assigned: element.assignedMember,
              day: this.computeNextDueDay(
                correctedStartDate,
                element.repetitionDays,
                element.repetitionUnit
              ),
              time: element.time.substr(0, 5),
              missed: false,
              icon: icons[element.icon]
            });
          });
        }
      } catch (err) {
        console.error(err);
      }
    },

    computeNextDueDay(startDate, repetitionDays, repetitionUnit) {
      let repDayInts = repetitionDays.map(day => this.mapWeekdayToInt(day));
      let curDate = new Date();
      if (curDate < startDate) {
        console.log("in the future");
        return this.computeNextDueInWeek(repDayInts, startDate);
      } else if (repetitionUnit) {
        //month
        let tempDate = new Date(startDate);
        let prevTempDate;
        while (curDate > tempDate) {
          prevTempDate = new Date(tempDate);
          tempDate.setMonth(tempDate.getMonth() + 1);
        }
        console.log("month - old prevTempDate: " + prevTempDate);
        let day = prevTempDate.getDay();
        if (prevTempDate.getDate() + (6 - day) < curDate) {
          console.log("month - Skip month");
          prevTempDate.setMonth(prevTempDate.getMonth() + 1);
          day = prevTempDate.getDay();
        }
        console.log("month - prevTempDate: " + prevTempDate);
        console.log("month - day: " + day);
        return this.computeNextDueInWeek(repDayInts, prevTempDate);
      } else {
        //week
        let tempDate = new Date(startDate);
        let prevTempDate;
        while (curDate > tempDate) {
          prevTempDate = new Date(tempDate);
          tempDate.setDate(tempDate.getDate() + 7);
        }
        return this.computeNextDueInWeek(repDayInts, prevTempDate);
      }
    },

    computeNextDueInWeek(repDayInts, prevTempDate) {
      let day = prevTempDate.getDay();
      console.log("day: " + day);
      if (day > 0) {
        let min = 8;
        for (let i = 0; i < repDayInts.length; i++) {
          console.log("repDay[" + i + "]: " + repDayInts[i]);
          if (repDayInts[i] != 0) {
            if (repDayInts[i] >= day && repDayInts[i] < min) {
              min = repDayInts[i];
            }
          } else {
            min = 7;
          }
        }
        console.log("min: " + min);
        if (min == 7) {
          prevTempDate.setDate(
            prevTempDate.getDate() + (6 - prevTempDate.getDay() + 1)
          );
          return prevTempDate;
        }
        if (min == 8) {
          console.log("date: " + prevTempDate);
          console.log("shift to next week by: " + (6 - day + 2));
          prevTempDate.setDate(prevTempDate.getDate() + (6 - day + 2));
          console.log("new date: " + prevTempDate);
          return this.computeNextDueInWeek(repDayInts, prevTempDate);
        }
        prevTempDate.setDate(
          prevTempDate.getDate() + (min - prevTempDate.getDay())
        );
        return prevTempDate;
      } else {
        if (repDayInts.includes(0)) {
          return prevTempDate;
        } else {
          prevTempDate.setDate(prevTempDate.getDate() + 1);
          return this.computeNextDueInWeek(repDayInts, prevTempDate);
        }
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
