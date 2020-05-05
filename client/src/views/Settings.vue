<template>
  <v-container>
    <v-overlay
      v-if="getState > 0 && getState < 11"
      :value="overlay"
      :opacity="0.8"
      absolute
    >
      <h1 class="display-2">We're not yet here!</h1>
      Move on with your tutorial of click 'End tutorial' at the bottom.
    </v-overlay>
    <v-row justify="center">
      <v-col xl="9" lg="10" md="12">
        <h1 class="display-2 pb-6">Settings</h1>
        <v-tabs
          class="elevation-2"
          :vertical="$vuetify.breakpoint.mdAndUp"
          :show-arrows="!$vuetify.breakpoint.mdAndUp"
          center-active
          :elevation="6"
        >
          <v-tab
            v-for="tab in tabs"
            :key="`tab-${tab.link}`"
            :to="`/settings/${tab.link}`"
          >
            {{ tab.name }}
          </v-tab>
          <v-tabs-items v-if="getState >= 11 || getState <= 0">
            <transition name="fade-transition" mode="out-in">
              <router-view></router-view>
            </transition>
          </v-tabs-items>
        </v-tabs>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: "Settings",
  data: () => ({
    overlay: true,
    tabs: [
      {
        name: "General",
        link: "general"
      },
      {
        name: "Dashboard",
        link: "dashboard"
      },
      {
        name: "Integrations",
        link: "integrations"
      }
    ]
  }),
  computed: {
    getState() {
      return this.$store.state.userSettings.introductionState;
    }
  }
};
</script>
