<template>
  <v-container fluid>
    <h1 class="display-2 pb-6">Calendar</h1>

    <v-select
      v-show="!gapiNotSignedIn"
      v-model="calendarsSelected"
      :items="allCalendarsStrings"
      chips
      :label="gapiSignedIn ? 'Choose Calendars' : 'Not signed in'"
      multiple
      outlined
      :disabled="!gapiSignedIn"
      @change="updateG"
    ></v-select>
    <v-alert v-if="!calendarEnabled" type="warning">
      Please refer to the
      <router-link :to="{ name: 'Settings' }">settings</router-link> to activate
      this feature.
    </v-alert>
    <v-alert v-if="gapiNotSignedIn" type="warning">
      Please refer to the
      <router-link :to="{ name: 'Settings' }">settings</router-link> to connect
      to the Google services.
    </v-alert>

    <v-btn icon :disabled="!gapiSignedIn" @click="updateG"
      ><v-icon>refresh</v-icon></v-btn
    >

    <v-row class="fill-height">
      <v-col>
        <v-sheet height="64">
          <v-toolbar flat>
            <v-btn
              text
              :class="$vuetify.breakpoint.smAndDown ? '' : 'mr-4'"
              :disabled="!gapiSignedIn"
              color="primary"
              :icon="$vuetify.breakpoint.smAndDown"
              @click="setToday"
            >
              <v-icon v-if="$vuetify.breakpoint.smAndDown">today</v-icon>
              {{ $vuetify.breakpoint.smAndDown ? "" : "Today" }}
            </v-btn>
            <v-btn fab text small @click="prev">
              <v-icon small>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn fab text small @click="next">
              <v-icon small>mdi-chevron-right</v-icon>
            </v-btn>
            <v-toolbar-title
              :class="$vuetify.breakpoint.smAndDown ? '' : 'ml-4'"
              >{{ title }}</v-toolbar-title
            >
            <v-spacer></v-spacer>
            <v-menu bottom right>
              <template v-slot:activator="{ on }">
                <div v-on="on">
                  <v-btn
                    text
                    :disabled="!gapiSignedIn"
                    :class="$vuetify.breakpoint.smAndDown ? 'pa-0' : ''"
                  >
                    <span v-if="!$vuetify.breakpoint.smAndDown">{{
                      typeToLabel[type]
                    }}</span>
                    <v-icon v-if="$vuetify.breakpoint.smAndDown">{{
                      typeToIcon[type]
                    }}</v-icon>
                    <v-icon right>mdi-menu-down</v-icon>
                  </v-btn>
                </div>
              </template>
              <v-list>
                <v-list-item @click="type = 'day'">
                  <v-list-item-title>Day</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'week'">
                  <v-list-item-title>Week</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'month'">
                  <v-list-item-title>Month</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = '4day'">
                  <v-list-item-title>4 days</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar>
        </v-sheet>
        <v-sheet height="600">
          <v-calendar
            v-show="gapiSignedIn"
            ref="calendar"
            v-model="focus"
            color="primary"
            :events="events"
            :event-color="getEventColor"
            :now="today"
            :type="type"
            :weekdays="[1, 2, 3, 4, 5, 6, 0]"
            @click:event="showEvent"
            @click:more="viewDay"
            @click:date="viewDay"
            @change="updateRange"
          ></v-calendar>
          <v-menu
            v-model="selectedOpen"
            :close-on-content-click="false"
            :activator="selectedElement"
            offset-x
            max-width="350px"
          >
            <v-card width="350px" flat>
              <v-toolbar :color="selectedEvent.color" dark>
                <v-toolbar-title v-text="selectedEvent.name"></v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <span
                  v-text="selectedEvent.description || 'No description'"
                ></span>
              </v-card-text>
            </v-card>
          </v-menu>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapState } from "vuex";
import {
  handleClientLoad,
  listUpcomingEvents,
  listCalendars,
  signedIn,
  gapiLoaded
} from "@/assets/googleCalendar.js";

export default {
  name: "Calendar",
  data: () => ({
    focus: "",
    type: "month",
    typeToLabel: {
      month: "Month",
      week: "Week",
      day: "Day",
      "4day": "4 Days"
    },
    typeToIcon: {
      month: "view_module",
      week: "view_week",
      day: "view_day",
      "4day": "looks_4"
    },
    start: null,
    end: null,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    eventData: [],
    events: [],
    allCalendarsStrings: [],
    calendars: [],
    gapiSignedIn: false,
    gapiNotSignedIn: false
  }),
  computed: {
    title() {
      const { start, end } = this;
      if (!start || !end) {
        return "";
      }
      switch (this.type) {
        case "month":
          return this.monthFormatter.format(new Date(start.date));
        case "week":
          return this.monthFormatter.format(new Date(start.date));
        case "4day":
          return (
            this.dateFormatter.format(new Date(start.date)) +
            " - " +
            this.dateFormatter.format(new Date(end.date))
          );
        case "day":
          return this.dateFormatter.format(new Date(start.date));
      }
      return "";
    },
    today() {
      let dat = new Date();
      return this.formatDate(dat, false);
    },
    calendarsSelected: {
      set(val) {
        this.$store.commit("userSettings/set_key", {
          key: "calendarsSelected",
          value: val
        });
      },
      get() {
        return this.$store.state.userSettings.calendarsSelected;
      }
    },
    ...mapState("userSettings", ["calendarEnabled", "locale"])
  },
  watch: {
    calendarEnabled(val) {
      if (val && !this.gapiLoaded) this.loadGapi();
    },
    locale(val) {
      this.initLocale(val);
    }
  },
  created() {
    if (this.calendarEnabled && !gapiLoaded) this.loadGapi();
  },
  async mounted() {
    this.gapiSignedIn = false;
    this.gapiNotSignedIn = false;
    this.initLocale(this.locale);
    if (this.calendarEnabled && signedIn) {
      await this.updateG();
      this.$refs.calendar.checkChange();
    }
  },
  methods: {
    initLocale(locale) {
      if (locale) locale = [locale, "en-US"];
      // in case the saved locale is invalid, en-US is backup
      else locale = undefined;
      this.timeFormatter = new Intl.DateTimeFormat(locale, {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit"
      });
      this.dateFormatter = new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      });
      this.monthFormatter = new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "long"
      });
    },
    loadGapi() {
      const gapiscript = document.createElement("script");
      gapiscript.src = "https://apis.google.com/js/api.js?onload=onGapiload";
      //on success: updateG, on fail: signInFailed
      window.onGapiload = () =>
        handleClientLoad(this.updateG, this.signInFailed);
      document.body.appendChild(gapiscript);
    },
    signInFailed() {
      this.gapiSignedIn = false;
      this.gapiNotSignedIn = true;
    },
    async updateG() {
      this.gapiSignedIn = true;
      this.gapiNotSignedIn = false;
      let startDate = new Date(this.start.date);
      let calendars = await listCalendars();
      this.allCalendarsStrings = calendars.map(cal => cal.summary);
      this.allCalendars = calendars;
      let calIds = this.calendarsSelected.map(
        cal => calendars[this.allCalendarsStrings.indexOf(cal)].id
      );
      this.eventData = await listUpcomingEvents(
        startDate,
        calIds,
        this.allCalendars
      );
      this.updateRange({ start: this.start, end: this.end });
    },

    //Calendar handling
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = this.today;
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        console.log(event);
        this.selectedElement = nativeEvent.target;
        setTimeout(() => (this.selectedOpen = true), 10);
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },

    updateRange({ start, end }) {
      const min = new Date(`${start.date}T00:00:00`);
      const max = new Date(`${end.date}T23:59:59`);
      this.start = start;
      this.end = end;
      this.setEvents(min, max);
    },

    setEvents(min, max) {
      this.events = [];
      if (this.eventData == null || this.eventData.length == 0) {
        return;
      }
      this.eventData.forEach(env => {
        let startStr = env.start.dateTime;
        let endStr = env.end.dateTime;
        let start, end, allDay;
        if (startStr == undefined) {
          allDay = true;
          start = new Date();
          start.setFullYear(env.start.date.substring(0, 4));
          start.setMonth(parseInt(env.start.date.substring(5, 7)) - 1);
          start.setDate(env.start.date.substring(8, 10));
          end = new Date();
          end.setFullYear(env.end.date.substring(0, 4));
          end.setMonth(parseInt(env.end.date.substring(5, 7)) - 1);
          end.setDate(parseInt(env.end.date.substring(8, 10)) - 1);
        } else {
          allDay = false;
          start = new Date(startStr);
          end = new Date(endStr);
        }
        if (start > min && end < max) {
          this.events.push({
            name: env.summary,
            start: this.formatDate(start, !allDay),
            end: this.formatDate(end, !allDay),
            colorID: env.colorId,
            color: env.color,
            description: env.description
          });
        }
      });
    },
    formatDate(a, withTime) {
      let year = a.getFullYear();
      let monthInt = a.getMonth() + 1;
      let month = monthInt < 10 ? "0" + monthInt : monthInt;
      let date = a.getDate() < 10 ? "0" + a.getDate() : a.getDate();
      let str = year + "-" + month + "-" + date;
      if (withTime) {
        let hours = a.getHours() < 10 ? "0" + a.getHours() : a.getHours();
        let minutes =
          a.getMinutes() < 10 ? "0" + a.getMinutes() : a.getMinutes();
        str = str + " " + hours + ":" + minutes;
      }
      return str;
    }
  }
};
</script>
