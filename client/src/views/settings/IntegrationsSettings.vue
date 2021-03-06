<template>
  <v-card flat tile>
    <v-card-text>
      <div class="display-1 mb-2">{{ $t("settings.integrations.title") }}</div>
      <!-- CALENDAR -->
      <div class="title mb-2">
        {{ $t("settings.integrations.calendar.title") }}
      </div>
      <p>
        {{ $t("settings.integrations.calendar.description") }}
      </p>
      <v-switch
        v-model="calendarEnabled"
        :label="
          $t('settings.integrations.calendar.enableGoogleCalendarIntegration')
        "
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
          >{{ $t("commands.signIn") }}</v-btn
        >
        <v-btn
          v-if="signInState == 1"
          color="red"
          :disabled="!calendarEnabled"
          @click="calendarSignOut"
          >{{ $t("commands.signOut") }}</v-btn
        >
        <div :class="$vuetify.breakpoint.mdAndUp ? 'pl-4' : 'pt-4'">
          <div class="overline">
            {{ $t("settings.integrations.calendar.state") }}
          </div>
          {{ signInDescription }}
        </div>
      </div>
      <div class="subtitle-1 mt-8 mb-2">
        {{ $t("settings.integrations.calendar.autoHomeCalendarStatus") }}
        <v-chip v-if="loadingCalendarStatus" small text>Loading...</v-chip>
        <v-chip
          v-if="!(calendarId === undefined) && calendarId != ''"
          color="success"
          small
          text
          >{{ $t("settings.integrations.calendar.activated") }}</v-chip
        >
        <v-chip
          v-if="!(calendarId === undefined) && calendarId == ''"
          color="warning"
          small
          text
          >{{ $t("settings.integrations.calendar.noCalendar") }}</v-chip
        >
      </div>
      <p>
        {{ $t("settings.integrations.calendar.autoExplanation") }}
      </p>
      <v-btn
        v-if="
          !(calendarId === undefined) && calendarId == '' && signInState == 1
        "
        color="success"
        :disabled="loadingCalendar"
        :loading="loadingCalendar"
        @click="createHomeCalendar"
        >{{ $t("settings.integrations.calendar.createHomeCalendar") }}</v-btn
      >
      <div
        v-if="loadingCalendar || loadingResyncCalendar"
        class="text--secondary overline mt-2"
      >
        {{ $t("settings.integrations.calendar.sorryTakeAWhile") }}
      </div>
      <v-btn
        v-if="
          !(calendarId === undefined) && calendarId != '' && signInState == 1
        "
        :block="$vuetify.breakpoint.smAndDown"
        :disabled="loadingCalendar"
        @click="deleteDialogVisible = true"
        >{{ $t("settings.integrations.calendar.deleteHomeCalendar") }}</v-btn
      >
      <v-btn
        v-if="
          !(calendarId === undefined) && calendarId != '' && signInState == 1
        "
        :disabled="loadingCalendar"
        text
        :block="$vuetify.breakpoint.smAndDown"
        :class="$vuetify.breakpoint.smAndDown ? 'mt-3' : ''"
        :loading="loadingResyncCalendar"
        @click="resyncCalendar"
        >{{ $t("settings.integrations.calendar.resyncInvitations") }}</v-btn
      >
      <confirm-dialog
        v-model="deleteDialogVisible"
        :positive-option="$t('commands.continue')"
        :negative-option="$t('commands.cancel')"
        :loading="loadingDeleteCalendar"
        @positive="deleteHomeCalendar"
        @negative="deleteDialogVisible = false"
        >{{ $t("settings.integrations.calendar.confirmDelete") }}
      </confirm-dialog>
      <!-- PHILIPS HUE -->
      <div class="title pt-6">{{ $t("settings.integrations.hue.title") }}</div>
      {{ $t("settings.integrations.hue.description") }}
    </v-card-text>
  </v-card>
</template>
<script>
import ConfirmDialog from "@/components/dialogs/ConfirmDialog.vue";
import {
  handleClientLoad,
  handleAuthClick,
  signedIn,
  gapiLoaded,
  user,
  syncSharing,
  handleSignoutClick,
  deleteHomeCalendar,
  createHomeCalendar
} from "@/assets/googleCalendar.js";

export default {
  name: "IntegrationsSettings",
  components: {
    ConfirmDialog
  },
  data: () => ({
    signInDescription: "",
    signInState: 0,
    loadingCalendar: false,
    loadingResyncCalendar: false,
    loadingDeleteCalendar: false,
    loadingCalendarStatus: false,
    calendarId: undefined,
    members: [],
    deleteDialogVisible: false
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
        this.signInDescription = this.$t(
          "settings.integrations.calendar.signedIn",
          {
            email:
              user && user.getBasicProfile
                ? user.getBasicProfile().getEmail()
                : "settings.integrations.calendar.unknownEmail"
          }
        );
      else
        this.signInDescription = this.$t(
          "settings.integrations.calendar.notSignedIn"
        );
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
    async deleteHomeCalendar() {
      try {
        this.loadingDeleteCalendar = true;
        await deleteHomeCalendar(this.calendarId);
        this.deleteDialogVisible = false;
        this.$store.dispatch(
          "showSnackbar",
          "Successfully deleted home calendar."
        );
        this.calendarId = "";
      } catch (err) {
        console.error(err);
        this.$store.dispatch("showSnackbar", "Error deleting home calendar.");
      }
      this.loadingDeleteCalendar = false;
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
      this.signInDescription = this.$t(
        "settings.integrations.calendar.notSignedIn"
      );
    },
    calendarSignOut() {
      handleSignoutClick(this.onSignOut);
      this.signInState = 2;
    },
    async resyncCalendar() {
      this.loadingResyncCalendar = true;
      let res = await syncSharing(this.members, this.calendarId);
      if (res) {
        this.$store.dispatch("showSnackbar", "Successfully resynced calendar.");
      } else {
        this.$store.dispatch("showSnackbar", "Couldn't resync calendar");
      }
      this.loadingResyncCalendar = false;
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
      this.signInDescription = this.$t(
        "settings.integrations.calendar.loadingGapi"
      );
      const gapiscript = document.createElement("script");
      gapiscript.src = "https://apis.google.com/js/api.js?onload=onGapiload";
      window.onGapiload = () => handleClientLoad(this.onSignIn, this.onSignOut);
      document.body.appendChild(gapiscript);
    }
  }
};
</script>
