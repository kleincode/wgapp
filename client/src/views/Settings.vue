<template>
  <v-container>
    <v-row justify="center">
      <v-col xl="9" lg="10" md="12">
        <h1 class="display-2 pb-6">Settings</h1>
        <v-tabs
          class="elevation-2"
          :vertical="$vuetify.breakpoint.mdAndUp"
          :show-arrows="!$vuetify.breakpoint.mdAndUp"
          center-active
        >
          <v-tab
            v-for="tab in tabs"
            :key="`tab-${tab.link}`"
            :to="`/settings/${tab.link}`"
          >
            {{ tab.name }}
          </v-tab>
          <v-tabs-items>
            <router-view></router-view>
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
  })
};
</script>
