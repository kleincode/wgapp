<template>
  <v-list
    style="max-height: 700px; overflow: scroll; overflow-x: hidden; display: flex; flex-direction: column-reverse;"
  >
    <div v-for="(log, i) in logs" :key="i">
      <v-list-item style="display: inherit">
        <v-list-item-title class="title"> </v-list-item-title>
        <v-list-item-subtitle>
          <div class="stacktrace mt-1 mb-2">
            <v-chip small :color="getLevel(log.level).color" class="mr-2 mb-1">
              {{
                getLevel(log.level).text +
                  " - " +
                  new Date(log.date).toLocaleString()
              }}
            </v-chip>
            <span>{{ log.handlername + ": " + log.message }}</span>
            <div v-if="log.stacktrace != ''">{{ log.stacktrace }}</div>
            <div v-if="log.req != {}">{{ log.req }}</div>
          </div>
        </v-list-item-subtitle>
      </v-list-item>
    </div>
  </v-list>
</template>

<script>
import loglevels from "@/assets/loglevels.js";

export default {
  name: "Log",
  data: () => ({}),
  props: {
    logs: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    getLevel(index) {
      return loglevels[index];
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
