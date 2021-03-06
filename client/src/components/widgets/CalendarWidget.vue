<template>
  <Widget
    :title="$t('widgets.calendar.title')"
    :loading="loading"
    :error="error"
    :large="calendarWidgetLarge"
    :context-items="contextItems"
    @context-action="contextAction"
    @togglesize="calendarWidgetLarge = !calendarWidgetLarge"
  >
    <template v-if="!error">
      <v-carousel
        v-if="upcomingEvents && upcomingEvents.length > 0"
        cycle
        hide-delimiter-background
        :show-arrows="false"
        height="95%"
        delimiter-icon="fiber_manual_record"
        class="bottom-carousel"
        :interval="9000"
        :dark="$vuetify.theme.dark"
        :light="!$vuetify.theme.dark"
      >
        <v-carousel-item v-for="(event, i) in upcomingEvents" :key="i">
          <v-row v-if="calendarWidgetLarge" align="center" justify="center">
            <v-col cols="12" class="text-center">
              <v-icon style="font-size: 6em" :color="event.color">event</v-icon>
            </v-col>
            <v-col cols="12">
              <div class="display-2">{{ event.summary }}</div>
            </v-col>
            <v-col cols="12">
              <div class="overline">
                {{ formattedTime(event) }}
              </div>
              <p>
                {{ "" || event.description }}
              </p>
            </v-col>
          </v-row>
          <v-row v-else align="center" justify="center">
            <v-col cols="2">
              <v-icon x-large :color="event.color">event</v-icon>
            </v-col>
            <v-col cols="8">
              <div class="headline headline-break">{{ event.summary }}</div>
              <div class="overline">
                {{ formattedTime(event) }}
              </div>
            </v-col>
          </v-row>
        </v-carousel-item>
      </v-carousel>
      <div v-else>
        <v-row
          class="headline text--disabled mt-3"
          height="120"
          justify="center"
          align="center"
        >
          <div v-if="calendarWidgetLarge" class="text-center mt-12">
            <v-icon style="font-size: 3em" class="mr-1">event</v-icon>
            <p>{{ $t("widgets.calendar.noEvents") }}</p>
          </div>
          <div v-else>
            <v-icon class="mr-1">event</v-icon>
            {{ $t("widgets.calendar.noEvents") }}
          </div>
        </v-row>
      </div>
    </template>
    <template v-else>
      <p class="mb-12 mt-4" style="height: 60%">
        {{ $t("widgets.calendar.configError") }}
      </p>
      <v-btn text block to="/settings/dashboard">{{
        $t("navigation.settings")
      }}</v-btn>
    </template>
  </Widget>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import Widget from "./Widget";
import {
  handleClientLoad,
  listUpcomingEvents,
  signedIn,
  gapiLoaded,
  listCalendars
} from "@/assets/googleCalendar.js";
import { isToday } from "@/assets/tasksHelper.js";

export default {
  name: "CalendarWidget",
  components: {
    Widget
  },
  data: () => ({
    loading: false,
    upcomingEvents: []
  }),
  computed: {
    error() {
      return (
        this._initialized && (!this.calendarEnabled || this.gapiNotSignedIn)
      );
    },
    contextItems() {
      return [
        {
          action: "calendar",
          text: this.$t("widgets.calendar.calendarPage"),
          icon: "event"
        },
        {
          action: "settings",
          text: this.$t("widgets.settings"),
          icon: "settings"
        }
      ];
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
    calendarWidgetLarge: {
      set(val) {
        this.$store.commit("userSettings/set_key", {
          key: "calendarWidgetLarge",
          value: val
        });
      },
      get() {
        return this.$store.state.userSettings.calendarWidgetLarge;
      }
    },
    ...mapState("userSettings", ["locale"]),
    ...mapGetters("userSettings", ["formatTimeHMWithoutS", "formatDateYMD"]),
    fullTime() {
      return this.formatTimeHMS(this.now);
    },
    ...mapState("userSettings", ["calendarEnabled", "locale", "_initialized"])
  },
  async created() {
    if (this.calendarEnabled && !gapiLoaded) await this.loadGapi();
  },
  async mounted() {
    this.gapiSignedIn = false;
    this.gapiNotSignedIn = false;
    this.initLocale(this.locale);
    if (this.calendarEnabled && signedIn) {
      await this.fetch();
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
      window.onGapiload = () => handleClientLoad(this.fetch, this.signInFailed);
      document.body.appendChild(gapiscript);
    },
    async fetch() {
      this.loading = true;
      let calendars = await listCalendars();
      let calIds = [];

      this.calendarsSelected.forEach(calid => {
        let cal = calendars.find(el => el.id == calid);
        if (cal) {
          calIds.push(calid);
        } else {
          //not in list anymore
          console.log("deleted", cal);
          this.calendarsSelected.splice(
            this.calendarsSelected.indexOf(calid),
            1
          );
        }
      });

      let now = new Date();
      let later = new Date();

      later.setHours(later.getHours() + 24);
      this.upcomingEvents = await listUpcomingEvents(
        now,
        later,
        calIds,
        calendars
      );
      this.loading = false;
    },
    signInFailed() {
      this.gapiSignedIn = false;
      this.gapiNotSignedIn = true;
    },
    contextAction(item) {
      switch (item.action) {
        case "settings":
          this.$router.push({ name: "DashboardSettings", hash: "#calendar" });
          break;
        case "calendar":
          this.$router.push({ name: "Calendar" });
      }
    },
    formattedTime(event) {
      if (!event) return "";
      if (!event.start.dateTime) {
        //all day event
        let start = new Date(event.start.date);
        if (isToday(start, new Date())) {
          return this.$t("widgets.calendar.today");
        } else {
          return this.$t("widgets.calendar.tomorrow");
        }
      } else {
        let start = new Date(event.start.dateTime);
        let day = "";
        if (isToday(start, new Date())) {
          day = this.$t("widgets.calendar.today");
        } else {
          day = this.$t("widgets.calendar.tomorrow");
        }

        let time = this.formatTimeHMWithoutS(start);
        return day + " - " + time;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.headline-break {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
</style>
