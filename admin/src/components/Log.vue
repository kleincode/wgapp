<template>
  <v-list
    style="max-height: 1000px; overflow: scroll; overflow-x: hidden; display: flex; flex-direction: column-reverse;"
  >
    <div v-for="(log, i) in logs" :key="i">
      <v-list-item style="display: inherit">
        <v-list-item-title class="title"> </v-list-item-title>
        <v-list-item-subtitle>
          <p class="stacktrace mt-1">
            <v-chip small :color="getLevel(log.level).color" class="mr-2 mb-1">
              {{
                getLevel(log.level).text +
                  " - " +
                  new Date(log.timestamp).toLocaleString()
              }}
            </v-chip>
            {{ log.stack }}
          </p>
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
