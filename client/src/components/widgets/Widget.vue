<template>
  <v-card
    outlined
    class="widget-card"
    :loading="loading"
    :color="error ? 'red' : null"
  >
    <v-card-title
      >{{ title }} <v-spacer></v-spacer> <v-icon v-if="error">error</v-icon>
    </v-card-title>
    <v-card-text>
      <slot></slot>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "Widget",
  props: {
    title: {
      type: String,
      default: "Widget"
    },
    loading: {
      type: Boolean,
      default: false
    },
    error: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
.widget-card {
  width: 100%;
  height: 100%;
}
</style>
