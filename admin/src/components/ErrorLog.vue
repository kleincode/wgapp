<template>
  <v-expansion-panels accordion hover color="grey">
    <v-expansion-panel :elevation="4" v-for="(log, i) in logs" :key="i">
      <v-expansion-panel-header>
        <div style="display: flex">
          <v-chip :color="getCategory(log.category).color">{{
            getCategory(log.category).text
          }}</v-chip>
          <span class="title ml-3">{{
            log.handlername + ": " + log.message
          }}</span>
          <v-spacer></v-spacer>
          <v-chip small class="mr-2 mt-1">
            {{ new Date(log.date).toLocaleString() }}</v-chip
          >
        </div>
      </v-expansion-panel-header>
      <v-expansion-panel-content class="pt-3">
        <span class="stacktrace">
          {{ log.stacktrace }}
        </span>
        <div v-if="!(Object.keys(log.req).length === 0)">
          <v-divider v-if="log.stacktrace != ''"></v-divider>
          <div v-if="log.req.uid">
            <span class="font-weight-bold">UID: </span> {{ log.req.uid }}
          </div>
          <div v-if="!(Object.keys(log.req.body).length === 0)">
            <span class="font-weight-bold">BODY: </span> {{ log.req.body }}
          </div>
          <div v-if="!(Object.keys(log.req.query).length === 0)">
            <span class="font-weight-bold">QUERY: </span> {{ log.req.query }}
          </div>
        </div>
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
    async setReviewed(log) {
      const { data } = await this.$http.post("/_/updatelog", {
        id: log.id,
        reviewed: true
      });
      if (data.success) {
        log.reviewed = true;
      }
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
