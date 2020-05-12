<template>
  <v-container>
    <v-overlay
      v-if="getState > 0 && getState < 11"
      :value="overlay"
      :opacity="0.8"
      absolute
    >
      <h1 class="display-2">{{ $t("settings.introLocked") }}</h1>
      {{ $t("settings.introLockedDescription") }}
    </v-overlay>
    <v-row justify="center">
      <v-col xl="9" lg="10" md="12">
        <h1 class="display-2 pb-6">{{ $t("settings.title") }}</h1>
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
    overlay: true
  }),
  computed: {
    getState() {
      return this.$store.state.userSettings.introductionState;
    },
    tabs() {
      return [
        {
          name: this.$t("settings.general.title"),
          link: "general"
        },
        {
          name: this.$t("settings.dashboard.title"),
          link: "dashboard"
        },
        {
          name: this.$t("settings.integrations.title"),
          link: "integrations"
        }
      ];
    }
  }
};
</script>
