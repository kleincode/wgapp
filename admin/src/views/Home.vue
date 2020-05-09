<template>
  <v-container>
    <h1 class="display-2 mt-12 mb-6">Statistics</h1>
    <v-row justify="center">
      <v-col cols="12" md="3" class="text-center mb-2">
        <StatCard title="Users" :value="42" icon="person"></StatCard>
      </v-col>
      <v-col cols="12" md="3" class="text-center">
        <StatCard title="Households" :value="13" icon="home"></StatCard>
      </v-col>
      <v-col cols="12" md="3" class="text-center">
        <StatCard title="Errors in 24h" :value="23" icon="error" :error="error"></StatCard>
      </v-col>
    </v-row>
    <h1 class="display-2 mt-12 mb-4">Logs</h1>
    <v-row>
      <v-col cols="12" md="6">
        <v-card :elevation="7">
          <v-card-title class="headline">Critical errors</v-card-title>
          <v-card-content>
            <Log :logs="logs"></Log>
          </v-card-content>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card :elevation="7">
          <v-card-title class="headline">Other errors</v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import StatCard from "@/components/StatCard.vue";
import Log from "@/components/Log.vue";

export default {
  name: "Home",
  components: {
    StatCard,
    Log
  },
  data: () => ({
    error: false,
    logs: [
      {
        title: "Some error"
      }
    ]
  })
};
</script>
