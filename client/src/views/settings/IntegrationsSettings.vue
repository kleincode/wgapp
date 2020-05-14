<template>
  <v-card flat tile>
    <v-card-text>
      <div class="display-1 mb-2">{{ $t("settings.integrations.title") }}</div>
      <!-- CALENDAR -->
      <div class="title mb-2">
        {{ $t("settings.integrations.calendar.title") }}
      </div>
      <p>
        {{ $t("settings.integrations.calendar.exp") }}
      </p>
      <v-switch
        v-model="calendarEnabled"
        :label="$t('settings.integrations.calendar.lbl')"
      ></v-switch>
      <div
        :style="{
          display: $vuetify.breakpoint.mdAndUp ? 'flex' : ''
        }"
      >
        <v-btn
          v-if="signInState == 2"
          color="primary"
          :disabled="!calendarEnabled"
          @click="calendarSignIn"
          >{{ $t("commands.signing") }}</v-btn
        >
        <v-btn
          v-if="signInState == 1"
          color="red"
          :disabled="!calendarEnabled"
          @click="calendarSignOut"
          >{{ $t("commands.signout") }}</v-btn
        >
        <div :class="$vuetify.breakpoint.mdAndUp ? 'pl-4' : 'pt-4'">
          <div class="overline">
            {{ $t("settings.integrations.calendar.status") }}:
          </div>
          {{ signInDescription }}
        </div>
      </div>
      <div class="subtitle-1 mt-8 mb-2">
        Automatic home calendar status
        <v-chip v-if="loadingCalendarStatus" small text>Loading...</v-chip>
        <v-chip
          v-if="!(calendarId === undefined) && calendarId != ''"
          color="success"
          small
          text
          >Activated</v-chip
        >
        <v-chip
          v-if="!(calendarId === undefined) && calendarId == ''"
          color="warning"
          small
          text
          >No Calendar</v-chip
        >
      </div>
      <p>
        You can create a Google Calendar which will automatically be shared with
        all members of this household. If new people join your household or
        activate their integration you need to resync the invitations.
      </p>
      <v-btn
        v-if="
          !(calendarId === undefined) && calendarId == '' && signInState == 1
        "
        color="success"
        :disabled="loadingCalendar"
        :loading="loadingCalendar"
        @click="createHomeCalendar"
        >Create Home Calendar</v-btn
      >
      <v-btn
        v-if="
          !(calendarId === undefined) && calendarId != '' && signInState == 1
        "
        :disabled="loadingCalendar"
        >Delete Home Calendar</v-btn
      >
      <v-btn
        v-if="
          !(calendarId === undefined) && calendarId != '' && signInState == 1
        "
        :disabled="loadingCalendar"
        text
        @click="resyncCalendar"
        >Resync invitations</v-btn
      >
      <!-- PHILIPS HUE -->
      <div class="title pt-6">{{ $t("settings.integrations.hue.title") }}</div>
      {{ $t("settings.integrations.hue.exp") }}
    </v-card-text>
  </v-card>
</template>
<script>
import {
  handleClientLoad,
  handleAuthClick,
  signedIn,
  gapiLoaded,
  user,
  syncSharing,
  handleSignoutClick,
  createHomeCalendar
} from "@/assets/googleCalendar.js";

export default {
  name: "IntegrationsSettings",
  data: () => ({
    signInDescription: "Connecting...",
    signInState: 0,
    loadingCalendar: false,
    loadingCalendarStatus: false,
    calendarId: undefined,
    members: []
  }),
  computed: {
    calendarEnabled: {
      async set(val) {
        this.$store.commit("userSettings/set_key", {
          key: "calendarEnabled",
          value: val
        });
      },
      get() {
        return this.$store.state.userSettings.calendarEnabled;
      }
    }
  },
  watch: {
    calendarEnabled(val) {
      if (val && !this.gapiLoaded) this.loadGapi();
    }
  },
  created() {
    if (this.calendarEnabled && !gapiLoaded) this.loadGapi();
  },
  mounted() {
    this.signInState = signedIn ? 1 : 2;
    this.updateSignInDescription();
    this.fetchHomeCalendar();
  },
  methods: {
    calendarSignIn() {
      handleAuthClick(this.onSignIn, this.onSignOut);
    },
    async createHomeCalendar() {
      this.loadingCalendar = true;
      let res = await createHomeCalendar();
      this.loadingCalendar = false;
      if (res) {
        this.calendarId = res;
        this.$store.dispatch(
          "showSnackbar",
          "Successfully created home calendar."
        );
      } else {
        this.$store.dispatch("showSnackbar", "Error creating home calendar.");
      }
    },
    updateSignInDescription() {
      if (signedIn)
        this.signInDescription =
          "Signed in (" +
          (user && user.getBasicProfile
            ? user.getBasicProfile().getEmail()
            : "Unknown email") +
          ")";
      else this.signInDescription = "Not signed in";
    },
    async updateGmailDB() {
      try {
        let gmail = user.getBasicProfile().getEmail();
        const { data } = await this.$http.post("/_/updategmail", {
          gmail: gmail
        });
        return data.success;
      } catch (err) {
        this.$store.dispatch("showSnackbar", "Error updating gmail in db.");
        console.error("Error updating gmail in db.", err);
        return false;
      }
    },
    onSignIn() {
      this.signInState = 1;
      this.updateSignInDescription();
      let success = this.updateGmailDB();
      if (!success) {
        this.$store.dispatch(
          "showSnackbar",
          "Couldn't update gmail address in db."
        );
      }
      setTimeout(this.updateSignInDescription, 1000);
    },
    onSignOut() {
      this.signInState = 2;
      this.signInDescription = "Not signed in";
    },
    calendarSignOut() {
      handleSignoutClick(this.onSignOut);
      this.signInState = 2;
    },
    async resyncCalendar() {
      let res = await syncSharing(this.members, this.calendarId);
      if (res) {
        this.$store.dispatch("showSnackbar", "Successfully resynced calendar.");
      } else {
        this.$store.dispatch("showSnackbar", "Couldn't resync calendar");
      }
    },
    async fetchHomeCalendar() {
      try {
        this.loadingCalendarStatus = true;
        const { data } = await this.$http.get("/_/fetchhousehold");
        if (!data.success) {
          this.$store.dispatch(
            "showSnackbar",
            "Couldn't fetch household information."
          );
        } else {
          this.calendarId = data.calendar;
          this.members = data.members;
        }
      } catch (err) {
        console.error("Error fetching household information.", err);
        this.$store.dispatch(
          "showSnackbar",
          "Error fetching household information."
        );
      }
      this.loadingCalendarStatus = false;
    },
    loadGapi() {
      this.signInState = 0;
      this.signInDescription = "Loading Google API...";
      const gapiscript = document.createElement("script");
      gapiscript.src = "https://apis.google.com/js/api.js?onload=onGapiload";
      window.onGapiload = () => handleClientLoad(this.onSignIn, this.onSignOut);
      document.body.appendChild(gapiscript);
    }
  }
};
</script>
