<template>
  <v-card outlined class="widget-card">
      <v-card-title>{{ title }} </v-card-title>
      <v-card-text>
        <slot></slot>
      </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "Widget",
  props: {
    title: String
  }
};
</script>

<style lang="scss" scoped>
.widget-card {
  width: 100%;
  height: 100%;
}
</style>