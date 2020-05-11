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
            {{ $t("settings.integrations.calendar.state") }}
          </div>
          {{ signInDescription }}
        </div>
      </div>
      <!-- PHILIPS HUE -->
      <div class="title pt-6">{{ $t("settings.integrations.hue.title") }}</div>
      {{ $t("settings.integrations.hue.description") }}
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
  handleSignoutClick
} from "@/assets/googleCalendar.js";

export default {
  name: "IntegrationsSettings",
  data: () => ({
    signInDescription: "Connecting...",
    signInState: 0
  }),
  computed: {
    calendarEnabled: {
      set(val) {
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
  },
  methods: {
    calendarSignIn() {
      handleAuthClick(this.onSignIn, this.onSignOut);
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
    onSignIn() {
      this.signInState = 1;
      this.updateSignInDescription();
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
