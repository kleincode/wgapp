<template>
  <v-list
    style="max-height: 1000px; overflow: scroll; overflow-x: hidden; display: flex; flex-direction: column-reverse;"
  >
    <div v-for="(log, i) in logs" :key="i">
      <v-list-item style="display: inherit">
        <v-list-item-title class="title"> </v-list-item-title>
        <v-list-item-subtitle>
          <v-chip small> {{ new Date(log.timestamp).toLocaleString() }}</v-chip>
          <p class="stacktrace mt-1">{{ log.stack }}</p>
        </v-list-item-subtitle>
      </v-list-item>
    </div>
  </v-list>
</template>

<script>
export default {
  name: "Log",
  data: () => ({
    categories: [
      {
        text: "General",
        color: "blue"
      },
      {
        text: "Dashboard",
        color: "purple darken-2"
      },
      {
        text: "Tasks",
        color: "amber darken-2"
      },
      {
        text: "Finances",
        color: "cyan"
      },
      {
        text: "Household",
        color: "green lighten-1"
      }
    ]
  }),
  props: {
    logs: {
      type: Array,
      default: () => []
    }
  },
  methods: {}
};
</script>

<style>
.stacktrace {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: inherit;
}
</style>
