<template>
  <v-expansion-panels accordion hover color="grey">
    <v-expansion-panel :elevation="4" v-for="(log, i) in logs" :key="i">
      <v-expansion-panel-header>
        <div style="display: flex">
          <v-chip :color="getCategory(log.cat).color">{{
            getCategory(log.cat).text
          }}</v-chip>
          <span class="title ml-3">{{ log.title }}</span>
          <v-spacer></v-spacer>
          <v-chip small class="mr-2 mt-1">
            {{ new Date(log.timestamp).toLocaleString() }}</v-chip
          >
        </div>
      </v-expansion-panel-header>
      <v-expansion-panel-content class="pt-3">
        <span class="stacktrace">{{ log.stack }}</span>
        <div class="text-right" v-if="!reviewed">
          <v-btn color="green" @click="setReviewed(log)"
            >Mark as Reviewed</v-btn
          >
        </div>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import errorcategories from "@/assets/errorcategories.js";

export default {
  name: "Log",
  props: {
    logs: {
      type: Array,
      default: () => []
    },
    reviewed: {
      type: Boolean,
      default: () => false
    }
  },
  methods: {
    getCategory(index) {
      return errorcategories[index];
    },
    setReviewed(log) {
      console.log("Mark log as reviewed.", log);
    }
  }
};
</script>

<style>
.stacktrace {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: inherit;
}
</style>
