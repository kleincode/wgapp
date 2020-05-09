<template>
  <v-list>
    <v-list-item v-for="(log, i) in logs" :key="i">
      {{log.title}}
    </v-list-item>
  </v-list>
</template>

<script>
export default {
    name: "Log",
    props: {
      logs: {
        type: Array,
        default: () => []
      }
    }
}
</script>

<style>

</style>