<template>
  <v-container fluid>
    <h1 class="display-2 pb-6">Settings</h1>
    <v-tabs
      v-model="tab"
      class="elevation-2"
      :vertical="$vuetify.breakpoint.mdAndUp"
    >
      <v-tabs-slider></v-tabs-slider>

      <v-tab href="#tab-user">
        User
      </v-tab>
      <v-tab href="#tab-household">
        Household
      </v-tab>
      <v-tab-item value="tab-user">
        <v-card flat tile>
          <v-card-text>
            <div class="container">
              <div class="display-1">General</div>
              <v-switch v-model="darkDesign" label="Dark design"></v-switch>
              <v-divider class="mt-8 mb-8"></v-divider>
              <div class="display-1 mb-2">Integrations</div>
              <div class="title pt-2">Google Calendar</div>
              <p>
                You can add your Google Calendar to view all your events in the
                'Calendar'-Tab. The next events will also be displayed in the
                Dashboard.
              </p>
              <div
                :style="{ display: $vuetify.breakpoint.mdAndUp ? 'flex' : '' }"
              >
                <v-btn
                  v-if="signInState == 2"
                  color="primary"
                  @click="calendarSignIn"
                  >Sign in</v-btn
                >
                <v-btn
                  v-if="signInState == 1"
                  color="red"
                  @click="calendarSignOut"
                  >Sign out</v-btn
                >
                <div :class="$vuetify.breakpoint.mdAndUp ? 'pl-4' : 'pt-4'">
                  <div class="overline">Status:</div>
                  {{ signInDescription }}
                </div>
              </div>
              <div class="title pt-6">Philipps Hue</div>
              You can add your Philipps Hue Account to control your smart home
              devices.

              <v-divider class="mt-8 mb-8"></v-divider>

              <div class="display-1 mb-2">Household</div>
            </div>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item value="tab-household">
        <v-card flat tile>
          <v-card-text>
            <div class="headline">Household settings</div>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-container>
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
  name: "Settings",
  data: () => ({
    tab: [],
    tabs: 2,
    signInDescription: "Connecting...",
    signInState: 0
  }),
  computed: {
    darkDesign: {
      set(val) {
        this.$vuetify.theme.dark = val;
        localStorage.setItem("darktheme", val);
      },
      get() {
        return this.$vuetify.theme.dark;
      }
    }
  },
  created() {
    if (!gapiLoaded) {
      const gapiscript = document.createElement("script");
      gapiscript.src = "https://apis.google.com/js/api.js?onload=onGapiload";
      window.onGapiload = () => handleClientLoad(this.onSignIn, this.onSignOut);
      document.body.appendChild(gapiscript);
    }
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
    }
  }
};
</script>
