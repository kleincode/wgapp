<template>
  <v-container
    :class="$vuetify.breakpoint.smAndDown ? 'pt-0 px-4' : ''"
    :style="{ paddingBottom: $vuetify.application.top + 'px' }"
  >
    <v-row justify="center">
      <v-col xl="9" lg="10" md="12">
        <!-- Add event fab button -->
        <v-fab-transition>
          <v-btn
            v-if="!$vuetify.breakpoint.smAndDown && gapiSignedIn"
            fixed
            fab
            bottom
            right
            color="accent"
            :elevation="6"
            @click="editEventDialog = true"
            ><v-icon>add</v-icon></v-btn
          >
        </v-fab-transition>

        <!-- Select calendars -->
        <v-select
          v-if="!$vuetify.breakpoint.smAndDown"
          v-show="!gapiNotSignedIn"
          v-model="calendarsSelected"
          :items="allCalendars"
          return-object
          item-text="summary"
          small-chips
          :label="
            gapiSignedIn
              ? $t('calendar.selectCalendars')
              : $t('calendar.notSignedIn')
          "
          multiple
          solo
          :disabled="!gapiSignedIn"
          :loading="loading"
          prepend-icon="refresh"
          @click:prepend="updateG"
          @change="updateG"
        >
          <template v-slot:selection="{ item, index }">
            <v-chip
              v-if="index < ($vuetify.breakpoint.smAndDown ? 1 : 3)"
              :color="item.backgroundColor"
              small
            >
              <span>{{ item.summary }}</span>
            </v-chip>
            <span
              v-if="index === ($vuetify.breakpoint.smAndDown ? 1 : 3)"
              class="grey--text caption"
              >(+{{
                calendarsSelected.length -
                  ($vuetify.breakpoint.smAndDown ? 1 : 3)
              }}
              {{ $t("calendar.others") }})</span
            >
          </template>
        </v-select>

        <!-- Warning if feature disabled -->
        <v-alert v-if="_initialized && !calendarEnabled" type="warning">
          <i18n path="calendar.notActivated" tag="span">
            <template #settings>
              <router-link :to="{ name: 'Settings' }">{{
                $t("calendar.settingsLinkText")
              }}</router-link>
            </template>
          </i18n>
        </v-alert>

        <!-- Warning if not connected to gapi -->
        <v-alert v-if="_initialized && gapiNotSignedIn" type="warning">
          <i18n path="calendar.notConnected" tag="span">
            <template #settings>
              <router-link :to="{ name: 'Settings' }">{{
                $t("calendar.settingsLinkText")
              }}</router-link>
            </template>
          </i18n>
        </v-alert>

        <v-row>
          <v-col cols="12" class="pa-0">
            <!-- Calendar toolbar sheet -->
            <v-sheet :elevation="$vuetify.breakpoint.smAndDown ? 0 : 6">
              <v-toolbar flat>
                <!-- Today button -->
                <v-btn
                  text
                  :class="$vuetify.breakpoint.smAndDown ? '' : 'mr-4'"
                  :disabled="!gapiSignedIn"
                  color="primary"
                  :icon="$vuetify.breakpoint.smAndDown"
                  @click="setToday"
                >
                  <v-icon v-if="$vuetify.breakpoint.smAndDown">today</v-icon>
                  {{ $vuetify.breakpoint.smAndDown ? "" : $t("general.today") }}
                </v-btn>

                <!-- Calendar navigation and title -->
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

                <!-- Select display timespan -->
                <v-menu bottom right>
                  <template v-slot:activator="{ on }">
                    <div v-on="on">
                      <v-btn
                        text
                        :disabled="!gapiSignedIn"
                        :class="$vuetify.breakpoint.smAndDown ? 'pa-0' : ''"
                      >
                        <span v-if="!$vuetify.breakpoint.smAndDown">{{
                          viewToLabel[calendarView]
                        }}</span>
                        <v-icon v-if="$vuetify.breakpoint.smAndDown">{{
                          viewToIcon[calendarView]
                        }}</v-icon>
                        <v-icon right>mdi-menu-down</v-icon>
                      </v-btn>
                    </div>
                  </template>
                  <v-list>
                    <v-list-item @click="calendarView = 'day'">
                      <v-list-item-title>Day</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="calendarView = 'week'">
                      <v-list-item-title>Week</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="calendarView = 'month'">
                      <v-list-item-title>Month</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="calendarView = '4day'">
                      <v-list-item-title>4 days</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-toolbar>
            </v-sheet>
            <!-- Calendar sheet -->
            <v-sheet :elevation="$vuetify.breakpoint.smAndDown ? 0 : 6">
              <v-calendar
                v-show="gapiSignedIn"
                ref="calendar"
                v-model="focus"
                style="min-height: 60vh"
                color="primary"
                :events="events"
                :event-color="getEventColor"
                :event-text-color="getEventTextColor"
                :now="today"
                :locale="finaleLocale"
                :type="calendarView"
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
                    <v-toolbar-title
                      v-text="selectedEvent.name"
                    ></v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="editEvent"><v-icon>edit</v-icon></v-btn>
                    <v-btn icon @click="deleteEvent"
                      ><v-icon>delete</v-icon></v-btn
                    >
                  </v-toolbar>
                  <v-card-text>
                    <span
                      v-text="
                        selectedEvent.description ||
                          $t('calendar.noDescription')
                      "
                    ></span>
                  </v-card-text>
                </v-card>
              </v-menu>
            </v-sheet>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <EditEventDialog
      :show="editEventDialog"
      :calendars="allCalendars"
      :event="selectedEvent"
      :add="addMode"
      @close="closeEventDialog"
      @closeSuccessfull="successfullyCloseEventDialog"
      @closeSuccessfullEdit="successfullyCloseEventDialogEdit"
    ></EditEventDialog>
    <v-footer v-if="$vuetify.breakpoint.smAndDown" fixed padless>
      <v-fab-transition>
        <v-btn
          v-if="gapiSignedIn"
          absolute
          fab
          top
          right
          color="accent"
          :elevation="2"
          @click="editEventDialog = true"
          ><v-icon>add</v-icon></v-btn
        >
      </v-fab-transition>
      <!-- Select calendars, height equals toolbar height -->
      <v-select
        v-show="!gapiNotSignedIn"
        v-model="calendarsSelected"
        :height="$vuetify.application.top"
        :items="allCalendars"
        return-object
        item-text="summary"
        small-chips
        :label="
          gapiSignedIn
            ? $t('calendar.selectCalendars')
            : $t('calendar.notSignedIn')
        "
        multiple
        solo
        hide-details
        :disabled="!gapiSignedIn"
        :loading="loading"
        :elevation="6"
        @change="updateG"
      >
        <template v-slot:selection="{ item, index }">
          <v-chip
            v-if="index < ($vuetify.breakpoint.smAndDown ? 1 : 3)"
            :color="item.backgroundColor"
            small
          >
            <span>{{ item.summary }}</span>
          </v-chip>
          <span
            v-if="index === ($vuetify.breakpoint.smAndDown ? 1 : 3)"
            class="grey--text caption"
            >(+{{
              calendarsSelected.length - ($vuetify.breakpoint.smAndDown ? 1 : 3)
            }}
            {{ $t("calendar.others") }})</span
          >
        </template>
      </v-select>
    </v-footer>
  </v-container>
</template>
<script>
import { mapState } from "vuex";
import {
  handleClientLoad,
  listUpcomingEvents,
  listCalendars,
  deleteEvent,
  signedIn,
  gapiLoaded
} from "@/assets/googleCalendar.js";

import EditEventDialog from "@/components/dialogs/EditEventDialog.vue";
import { getForegroundColor } from "@/assets/colorHelper.js";

export default {
  name: "Calendar",
  components: {
    EditEventDialog
  },
  data: () => ({
    focus: "",
    viewToLabel: {
      month: "Month",
      week: "Week",
      day: "Day",
      "4day": "4 Days"
    },
    viewToIcon: {
      month: "view_module",
      week: "view_week",
      day: "view_day",
      "4day": "looks_4"
    },
    start: null,
    end: null,
    fetchStart: null,
    fetchEnd: null,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    eventData: [],
    events: [],
    allCalendars: [],
    calendars: [],
    gapiSignedIn: false,
    gapiNotSignedIn: false,
    loading: false,
    editEventDialog: false,
    addMode: true
  }),
  computed: {
    title() {
      const { start, end } = this;
      if (!start || !end) {
        return "";
      }
      switch (this.calendarView) {
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
          value: val.map(el => el.id)
        });
      },
      get() {
        const selectedIds = this.$store.state.userSettings.calendarsSelected;
        return this.allCalendars.filter(el => selectedIds.includes(el.id));
      }
    },
    calendarView: {
      set(val) {
        this.$store.commit("userSettings/set_key", {
          key: "calendarView",
          value: val
        });
      },
      get() {
        console.log(
          "selected cal view",
          this.$store.state.userSettings.calendarView
        );
        return this.$store.state.userSettings.calendarView;
      }
    },
    finaleLocale() {
      return this.locale || navigator.language;
    },
    ...mapState("userSettings", ["calendarEnabled", "locale", "_initialized"])
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
    this.viewToLabel["month"] = this.$t("calendar.timeViews.onemonth");
    this.viewToLabel["week"] = this.$t("calendar.timeViews.oneweek");
    this.viewToLabel["day"] = this.$t("calendar.timeViews.oneday");
    this.viewToLabel["4day"] = this.$t("calendar.timeViews.fourdays");
  },
  async mounted() {
    this.loading = true;
    this.gapiSignedIn = false;
    this.gapiNotSignedIn = false;
    this.initLocale(this.locale);
    if (this.calendarEnabled && signedIn) {
      await this.updateG();
      this.$refs.calendar.checkChange();
    }
    await this.$store.dispatch("userSettings/sync");
    this.loading = false;
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
      this.loading = true;
      this.gapiSignedIn = true;
      this.gapiNotSignedIn = false;
      let calendars = await listCalendars();
      this.allCalendars = calendars;
      this.updateRange({
        start: this.start,
        end: this.end,
        forceRefetch: true
      });
      this.loading = false;
    },
    // Called to fetch all events in that range
    async updateRange({ start, end, forceRefetch }) {
      if (!start || !end) return;
      this.start = start;
      this.end = end;
      if (!gapiLoaded) return;
      const startDate = new Date(start.date),
        endDate = new Date(end.date);
      // Check if the date range was already fetched
      if (
        !forceRefetch &&
        this.fetchStart &&
        this.fetchEnd &&
        startDate >= this.fetchStart &&
        endDate <= this.fetchEnd
      )
        return;
      // Out of fetched range --> refetch
      this.loading = true;
      let calIds = [];
      this.calendarsSelected.forEach(cal => {
        let index = this.allCalendars.findIndex(i => i.id === cal.id);
        if (index == -1) {
          //not in list anymore
          console.log("deleted", cal);
          this.calendarsSelected.splice(this.calendarsSelected.indexOf(cal), 1);
        } else {
          calIds.push(this.allCalendars[index].id);
        }
      });

      // We will fetch around two months before and after the current timespan as buffer (date constructor takes care of changing year appropriately)
      this.fetchStart = new Date(
        startDate.getFullYear(),
        startDate.getMonth() - 3,
        1
      );
      this.fetchEnd = new Date(
        startDate.getFullYear(),
        startDate.getMonth() + 3,
        31
      );
      // Now fetch the calculated timespan
      const eventData = await listUpcomingEvents(
        this.fetchStart,
        this.fetchEnd,
        calIds,
        this.allCalendars
      );
      // Finally, update the calendar events
      this.updateCalendarEvents(eventData);
      this.loading = false;
    },

    updateCalendarEvents(eventData) {
      this.events = [];
      if (eventData == null || eventData.length == 0) {
        return;
      }
      eventData.forEach(env => {
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
        this.events.push({
          id: env.id,
          calendarId: env.calendarId,
          name: env.summary,
          start: this.formatDate(start, !allDay),
          end: this.formatDate(end, !allDay),
          colorID: env.colorId,
          color: env.color,
          description: env.description
        });
      });
    },

    //Calendar handling
    viewDay({ date }) {
      this.focus = date;
      this.calendarView = "day";
    },
    getEventColor(event) {
      return event.color;
    },
    getEventTextColor(event) {
      return getForegroundColor(event.color);
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
    editEvent() {
      this.addMode = false;
      this.editEventDialog = true;
    },
    async deleteEvent() {
      try {
        await deleteEvent(this.selectedEvent.calendarId, this.selectedEvent.id);
        this.selectedOpen = false;
        this.events.splice(this.events.indexOf(this.selectedEvent), 1);
        this.$nextTick(() => (this.selectedEvent = {}));
        this.updateG();
        this.$store.dispatch("showSnackbar", "Successfully deleted event");
      } catch (err) {
        this.$store.dispatch("showSnackbar", "Error deleting the event");
        console.error(err);
      }
    },
    closeEventDialog() {
      this.editEventDialog = false;
      this.addMode = true;
    },
    successfullyCloseEventDialog() {
      this.updateG();
      this.selectedEvent = {};
      this.selectedElement = null;
      this.closeEventDialog();
    },
    successfullyCloseEventDialogEdit(changes) {
      this.updateG();
      this.selectedEvent.name = changes.name;
      this.selectedEvent.desc = changes.desc;
      this.closeEventDialog();
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
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
