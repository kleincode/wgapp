<template>
  <v-container>
    <h1 class="display-2 mt-12 mb-6">Statistics</h1>
    <v-row justify="center">
      <v-col cols="12" md="4" class="text-center mb-2">
        <v-card :elevation="7">
          <v-card-content class="pa-8">
            <v-row justify="center">
              <v-col cols="12" md="2">
                <v-icon color="black" style="font-size: 8em">person</v-icon>
              </v-col>
              <v-col cols="12" md="5">
                <div class="display-4 mb-3">24</div>
                <div class="overline" style="font-size: 1em !important">
                  Users
                </div>
              </v-col>
            </v-row>
          </v-card-content>
        </v-card>
      </v-col>
      <v-col cols="12" md="4" class="text-center">
        <v-card :elevation="7">
          <v-card-content class="pa-8">
            <v-row justify="center">
              <v-col cols="12" md="2">
                <v-icon color="black" style="font-size: 8em">home</v-icon>
              </v-col>
              <v-col cols="12" md="5">
                <div class="display-4 mb-3">24</div>
                <div class="overline" style="font-size: 1em !important">
                  Households
                </div>
              </v-col>
            </v-row>
          </v-card-content>
        </v-card>
      </v-col>
    </v-row>
    <v-card class="mt-8">
      <v-card-title class="display-2">Log</v-card-title>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "Home"
};
</script>
