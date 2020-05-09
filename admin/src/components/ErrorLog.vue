<template>
  <v-expansion-panels accordion hover color="grey">
    <v-expansion-panel :elevation="4" v-for="(log, i) in logs" :key="i">
      <v-expansion-panel-header>
        <div style="display: flex">
          <v-chip :color="categories[log.cat].color">{{
            categories[log.cat].text
          }}</v-chip>
          <span class="title ml-3">{{ log.title }}</span>
        </div>
      </v-expansion-panel-header>
      <v-expansion-panel-content class="pt-3">
        <span class="stacktrace">{{ log.stack }}</span>
        <div class="text-right">
          <v-btn color="green">Mark as Reviewed</v-btn>
        </div>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
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
