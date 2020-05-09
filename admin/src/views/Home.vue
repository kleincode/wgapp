<template>
  <v-container>
    <h1 class="display-2 mt-12 mb-6">Statistics</h1>
    <v-row justify="center">
      <v-col cols="12" md="4" class="text-center mb-2">
        <StatCard
          title="Users"
          :value="42"
          icon="person"
          color="primary"
          :trend="1"
        ></StatCard>
      </v-col>
      <v-col cols="12" md="4" class="text-center">
        <StatCard
          title="Households"
          :value="13"
          :trend="-1"
          icon="home"
        ></StatCard>
      </v-col>
      <v-col cols="12" md="4" class="text-center">
        <StatCard
          title="Errors in 24h"
          :value="4"
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
          <v-card-content>
            <ErrorLog :logs="critErrors" class="pa-2"></ErrorLog>
          </v-card-content>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card :elevation="7">
          <v-card-title class="headline">Last reviewed errors</v-card-title>
          <v-card-content>
            <ErrorLog
              :logs="reviewedErrors"
              class="pa-2"
              :reviewed="true"
            ></ErrorLog>
          </v-card-content>
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
    error: false,
    logs: [
      {
        cat: 0,
        title: "Some error",
        level: 0,
        reviewed: false,
        timestamp: 1589041616232,
        stack: `SyntaxError: J:DokumenteNodeJSWGAppwgappadminsrccomponentsLog.vue: Unexpected token, expected "," (26:4)
  24 |   name: "Log",
  25 |   data: () => ({ssds
> 26 |     categories: [
     |     ^
  27 |       {
  28 |         text: "General",
  29 |         color: "blue"


 @ ./src/components/Log.vue?vue&type=script&lang=js& 1:0-331 1:347-350 1:352-680 1:352-680
 @ ./src/components/Log.vue
 @ ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/babel-loader/lib!./node_modules/vuetify-loader/lib/loader.js??ref--18-0!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/views/Home.vue?vue&type=script&lang=js&
 @ ./src/views/Home.vue?vue&type=script&lang=js&
 @ ./src/views/Home.vue
 @ ./src/router/index.js
 @ ./src/main.js
 @ multi (webpack)-dev-server/client?http://192.168.22.27:8080/sockjs-node (webpack)/hot/dev-server.js ./src/main.js`
      },
      {
        cat: 1,
        title: "Another error",
        level: 0,
        reviewed: true,
        timestamp: 1589041616000,
        stack: "This is a stacktrace"
      },
      {
        cat: 2,
        title: "Another error",
        level: 2,
        reviewed: false,
        timestamp: 1589031610500,
        stack: "Well it's only a info"
      },
      {
        cat: 3,
        title: "Another error",
        level: 1,
        reviewed: true,
        timestamp: 1588021610000,
        stack: "I think that's a warning"
      },
      {
        cat: 4,
        title: "Another error",
        level: 3,
        reviewed: true,
        timestamp: 1587011600550,
        stack: "This is a stacktrace. That's very fine."
      },
      {
        cat: 5,
        title: "Another error",
        level: 3,
        reviewed: false,
        timestamp: 1586001600050,
        stack: "This is a stacktrace. That's very fine."
      }
    ],
    level: 2
  }),
  computed: {
    getLevels() {
      return loglevels;
    },
    completeLog() {
      return this.logs.filter(log => log.level <= this.level);
    },
    critErrors() {
      return this.logs.filter(log => !log.reviewed);
    },
    reviewedErrors() {
      return this.logs.filter(log => log.reviewed);
    }
  }
};
</script>
