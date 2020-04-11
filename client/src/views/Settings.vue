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

              <div class="display-1 mb-2">Dashboard</div>
              <!-- CLOCK WIDGET -->
              <div class="title pt-2">Clock Widget</div>
              <p>
                Old, but gold.
              </p>
              <v-switch
                v-model="clockWidgetEnabled"
                label="Enable clock widget"
              ></v-switch>
              <!-- WEATHER WIDGET -->
              <div class="title pt-2">Weather Widget</div>
              <p>
                The weather widget provides current weather data using the free
                <a href="https://openweathermap.org/" target="_blank"
                  >Open Weather Map</a
                >
                API.
              </p>
              <v-switch
                v-model="weatherWidgetEnabled"
                label="Enable weather widget"
              ></v-switch>
              <!-- TASKS WIDGET -->
              <div class="title pt-2">Tasks Widget</div>
              <p>
                This widget makes sure things are getting done in your home. No
                one ever dared to question its authority. (It might be useless
                at the moment, but the authority is already implemented.)
              </p>
              <v-switch
                v-model="tasksWidgetEnabled"
                label="Enable tasks widget"
              ></v-switch>

              <v-divider class="mt-8 mb-8"></v-divider>

              <div class="display-1 mb-2">Integrations</div>
              <!-- CALENDAR -->
              <div class="title pt-2">Calendar</div>
              <p>
                You can add your Google Calendar to view all your events in the
                'Calendar'-Tab. The next events will also be displayed in the
                Dashboard.
              </p>
              <v-switch
                v-model="calendarEnabled"
                label="Enable Google Calendar integration"
              ></v-switch>
              <div
                :style="{ display: $vuetify.breakpoint.mdAndUp ? 'flex' : '' }"
              >
                <v-btn
                  v-if="signInState == 2"
                  color="primary"
                  :disabled="!calendarEnabled"
                  @click="calendarSignIn"
                  >Sign in</v-btn
                >
                <v-btn
                  v-if="signInState == 1"
                  color="red"
                  :disabled="!calendarEnabled"
                  @click="calendarSignOut"
                  >Sign out</v-btn
                >
                <div :class="$vuetify.breakpoint.mdAndUp ? 'pl-4' : 'pt-4'">
                  <div class="overline">Status:</div>
                  {{ signInDescription }}
                </div>
              </div>
              <!-- PHILIPS HUE -->
              <div class="title pt-6">Philipps Hue</div>
              You can add your Philipps Hue Account to control your smart home
              devices.
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
        this.$store.commit("userSettings/set_key", {
          key: "darkMode",
          value: val
        });
        this.$vuetify.theme.dark = val;
      },
      get() {
        return this.$store.state.userSettings.darkMode;
      }
    },
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
    },
    weatherWidgetEnabled: {
      set(val) {
        this.$store.commit("userSettings/set_key", {
          key: "weatherWidgetEnabled",
          value: val
        });
      },
      get() {
        return this.$store.state.userSettings.weatherWidgetEnabled;
      }
    },
    clockWidgetEnabled: {
      set(val) {
        this.$store.commit("userSettings/set_key", {
          key: "clockWidgetEnabled",
          value: val
        });
      },
      get() {
        return this.$store.state.userSettings.clockWidgetEnabled;
      }
    },
    tasksWidgetEnabled: {
      set(val) {
        this.$store.commit("userSettings/set_key", {
          key: "tasksWidgetEnabled",
          value: val
        });
      },
      get() {
        return this.$store.state.userSettings.tasksWidgetEnabled;
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
