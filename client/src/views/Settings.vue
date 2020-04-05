<template>
  <v-container fluid>
    <h1 class="display-2 pb-6">Settings</h1>
    <v-tabs v-model="tab" class="elevation-2" vertical>
      <v-tabs-slider></v-tabs-slider>

      <v-tab :key="user" :href="tab - user">
        User
      </v-tab>
      <v-tab :key="household" :href="tab - household">
        Household
      </v-tab>
      <v-tab-item :key="user" :value="user">
        <v-card flat tile>
          <v-card-text>
            <div class="container">
              <div class="display-1">General</div>
              <v-switch label="Dark design"></v-switch>
              <v-divider class="mt-8 mb-8"></v-divider>
              <div class="display-1 mb-2">Integrations</div>
              <div class="title pt-2">Google Calendar</div>
              <p>
                You can add your Google Calendar to view all your events in the
                'Calendar'-Tab. The next events will also be displayed in the
                Dashboard.
              </p>
              <v-switch label="Activate Calendar Integration"></v-switch>
              <div style="display: flex">
                <v-btn text outlined>Sign in</v-btn>
                <div class="pl-2">
                  <div class="overline">Status:</div>
                  Already signed in.
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
      <v-tab-item :key="household" :value="user">
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
export default {
  name: "Settings",
  data: () => ({
    tab: [],
    tabs: 2
  })
};
</script>
