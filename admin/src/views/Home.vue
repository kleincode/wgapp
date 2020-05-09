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
        <StatCard
          title="Errors in 24h"
          :value="23"
          icon="error"
          :error="error"
        ></StatCard>
      </v-col>
    </v-row>
    <h1 class="display-2 mt-12 mb-4">Logs</h1>
    <v-row>
      <v-col cols="12">
        <v-card :elevation="7">
          <v-card-title class="headline">Critical errors</v-card-title>
          <v-card-content>
            <ErrorLog :logs="logs" class="pa-2"></ErrorLog>
          </v-card-content>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card :elevation="7">
          <v-card-title class="headline">Reviewed errors</v-card-title>
          <v-card-content>
            <ErrorLog :logs="logs" class="pa-2"></ErrorLog>
          </v-card-content>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card :elevation="7">
          <v-card-title class="headline">Complete log</v-card-title>
          <Log :logs="logs" class="pa-2"></Log>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import StatCard from "@/components/StatCard.vue";
import ErrorLog from "@/components/ErrorLog.vue";
import Log from "@/components/Log.vue";

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
        timestamp: 1589041616211,
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
        timestamp: 1589041616211,
        stack: "This is a stacktrace"
      },
      {
        cat: 2,
        title: "Another error",
        timestamp: 1589041616211,
        stack: "This is a stacktrace"
      },
      {
        cat: 3,
        title: "Another error",
        timestamp: 1589041616211,
        stack: "This is a stacktrace"
      },
      {
        cat: 4,
        title: "Another error",
        timestamp: 1589041616211,
        stack: "This is a stacktrace"
      }
    ]
  })
};
</script>
