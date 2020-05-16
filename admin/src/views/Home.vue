<template>
  <v-container>
    <h1 class="display-2 mt-12 mb-6">Statistics</h1>
    <v-row justify="center">
      <v-col cols="12" md="4" class="text-center mb-2">
        <StatCard
          title="Users"
          :value="users"
          icon="person"
          color="primary"
        ></StatCard>
      </v-col>
      <v-col cols="12" md="4" class="text-center">
        <StatCard title="Households" :value="households" icon="home"></StatCard>
      </v-col>
      <v-col cols="12" md="4" class="text-center">
        <StatCard
          title="Errors in 48h"
          :value="errorCount"
          icon="error"
          :error="error"
          color="warning"
        ></StatCard>
      </v-col>
    </v-row>
    <h1 class="display-2 mt-12 mb-4">Logs</h1>
    <v-row>
      <v-col cols="12">
        <v-card :elevation="7">
          <v-card-title class="headline">New critical errors</v-card-title>
          <ErrorLog :logs="critErrors" class="pa-2"></ErrorLog>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card :elevation="7">
          <v-card-title class="headline">Last reviewed errors</v-card-title>
          <ErrorLog
            :logs="reviewedErrors"
            class="pa-2"
            :reviewed="true"
            @deleteLog="deleteLog"
          ></ErrorLog>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card :elevation="7">
          <v-card-title class="headline"
            >Complete log (48h)
            <v-spacer></v-spacer>
            <v-select
              label="Log level"
              style="max-width: 250px"
              v-model="level"
              :items="getLevels"
            ></v-select>
          </v-card-title>
          <Log :logs="completeLog" class="pa-2"></Log>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import StatCard from "@/components/StatCard.vue";
import ErrorLog from "@/components/ErrorLog.vue";
import Log from "@/components/Log.vue";

import loglevels from "@/assets/loglevels.js";

export default {
  name: "Home",
  components: {
    StatCard,
    ErrorLog,
    Log
  },
  data: () => ({
    logs: [],
    level: 2,
    users: 0,
    households: 0
  }),
  computed: {
    getLevels() {
      return loglevels;
    },
    completeLog() {
      return this.logs.filter(log => log.level <= this.level);
    },
    critErrors() {
      return this.logs.filter(log => log.level == 0 && !log.reviewed);
    },
    reviewedErrors() {
      return this.logs.filter(log => log.level == 0 && !!log.reviewed);
    },
    errorCount() {
      return this.logs.filter(log => log.level == 0).length;
    },
    error() {
      return this.errorCount > 10;
    }
  },
  mounted() {
    this.reload();
  },
  methods: {
    async reload() {
      try {
        let { data } = await this.$http.get("/_/fetchlog");
        if (data.success) {
          this.logs = data.data;
          this.users = data.users[0].c;
          this.households = data.households[0].c;
        } else {
          console.error("Error fetching log");
        }
      } catch (err) {
        console.error("Error fetching log", err);
      }
    },
    deleteLog(log) {
      this.logs.splice(this.logs.indexOf(log.log), 1);
    }
  }
};
</script>
