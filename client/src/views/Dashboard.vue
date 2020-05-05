<template>
  <v-container>
    <v-overlay
      v-if="!userInHousehold"
      :value="overlay"
      :opacity="0.8"
      absolute
      class="pa-4"
    >
      <h1 class="display-3">You're not in a household yet.</h1>
      <p class="title mt-2">Please join a household or create your own.</p>
      <v-row align="center">
        <v-col cols="12" md="6">
          <v-btn color="primary" block @click="join">
            join household
          </v-btn>
        </v-col>
        <v-col cols="12" md="6">
          <v-btn color="primary" block @click="create">
            create household
          </v-btn>
        </v-col>
      </v-row>
    </v-overlay>
    <h1 class="display-2 mb-6" style="max-width: 80%">
      {{ message }}
    </h1>
    <v-row v-if="userInHousehold" align="stretch">
      <v-col
        v-if="clockWidgetEnabled"
        cols="12"
        sm="6"
        lg="4"
        xl="3"
        class="widget-col"
      >
        <ClockWidget />
      </v-col>
      <v-col
        v-if="weatherWidgetEnabled"
        cols="12"
        sm="6"
        lg="4"
        xl="3"
        class="widget-col"
      >
        <WeatherWidget />
      </v-col>
      <v-col
        v-if="tasksWidgetEnabled"
        cols="12"
        sm="6"
        lg="4"
        xl="3"
        class="widget-col"
      >
        <TasksWidget />
      </v-col>
      <v-col
        v-if="financesWidgetEnabled"
        cols="12"
        sm="6"
        lg="4"
        xl="3"
        class="widget-col"
      >
        <FinancesWidget />
      </v-col>
      <v-col
        v-if="statusWidgetEnabled"
        cols="12"
        sm="6"
        lg="4"
        xl="3"
        class="widget-col"
      >
        <StatusWidget />
      </v-col>
      <v-col
        v-if="homeWidgetEnabled"
        cols="12"
        sm="6"
        lg="4"
        xl="3"
        class="widget-col"
      >
        <ImHomeWidget />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from "vuex";

import ClockWidget from "@/components/widgets/ClockWidget.vue";
import WeatherWidget from "@/components/widgets/WeatherWidget.vue";
import TasksWidget from "@/components/widgets/TasksWidget.vue";
import FinancesWidget from "@/components/widgets/FinancesWidget.vue";
import StatusWidget from "@/components/widgets/StatusWidget.vue";
import ImHomeWidget from "@/components/widgets/ImHomeWidget.vue";

export default {
  name: "Dashboard",
  components: {
    ClockWidget,
    WeatherWidget,
    TasksWidget,
    FinancesWidget,
    StatusWidget,
    ImHomeWidget
  },
  data: () => ({
    overlay: true
  }),
  computed: {
    ...mapState(["userInHousehold"]),
    ...mapState("userSettings", [
      "clockWidgetEnabled",
      "weatherWidgetEnabled",
      "tasksWidgetEnabled",
      "financesWidgetEnabled",
      "statusWidgetEnabled",
      "homeWidgetEnabled"
    ]),
    ...mapGetters(["getName"]),
    message() {
      let time = new Date();
      if (time.getHours() < 5) {
        //late night
        let number = Math.floor(Math.random() * 2);
        switch (number) {
          case 0:
            return "Any late night thoughts, " + this.getName + "?";
          default:
            return "How's the party going " + this.getName + "?";
        }
      } else if (time.getHours() < 10) {
        //morning
        let number = Math.floor(Math.random() * 5);
        switch (number) {
          case 0:
            return "Morning sunshine!";
          case 1:
            return "Wakey wakey rise n’ shine!";
          case 2:
            return "Rise and shine, it's time for wine!";
          case 3:
            return "Have a great day, " + this.getName + "!";
          default:
            return "Good Morning, " + this.getName + "!";
        }
      } else if (time.getHours() < 14) {
        //noon
        let number = Math.floor(Math.random() * 3);
        switch (number) {
          case 0:
            return "Hi, " + this.getName + "!";
          case 1:
            return "What's up, " + this.getName + "?";
          default:
            return "How you doin?";
        }
      } else if (time.getHours() < 18) {
        let number = Math.floor(Math.random() * 3);
        switch (number) {
          case 0:
            return "Hi, " + this.getName + "!";
          case 1:
            return "Nice to see you, " + this.getName + "!";
          default:
            return "How was your day, " + this.getName + "?";
        }
      } else if (time.getHours() < 22) {
        //evening
        let number = Math.floor(Math.random() * 3);
        switch (number) {
          case 0:
            return "Netflix and chill?";
          case 1:
            return "Good evening, " + this.getName + "!";
          default:
            return "How was your day, " + this.getName + "?";
        }
      } else {
        //night
        let number = Math.floor(Math.random() * 3);
        switch (number) {
          case 0:
            return "Good Night, " + this.getName + "!";
          case 1:
            return "Go get your beauty sleep, " + this.getName + "!";
          default:
            return "Sleep well, " + this.getName + "!";
        }
      }
    }
  },
  methods: {
    join() {
      this.introductionState = 2;
      this.$router.push({ path: "/household/join" });
      this.dialog = false;
    },
    create() {
      this.introductionState = 2;
      this.$router.push({ path: "/household/create" });
      this.dialog = false;
    }
  }
};
</script>
