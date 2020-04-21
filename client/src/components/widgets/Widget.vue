<template>
  <v-card
    outlined
    class="widget-card"
    :loading="loading"
    :color="error ? 'red' : null"
  >
    <v-card-title>
      {{ title }}
      <v-spacer></v-spacer>
      <v-icon v-if="error">error</v-icon>
      <v-menu v-if="!error && contextItems.length">
        <template #activator="{ on }">
          <v-btn icon small v-on="on">
            <v-icon>more_vert</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in contextItems"
            :key="index"
            @click="$emit('context-action', item)"
          >
            <v-list-item-title>{{ item.text }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card-title>
    <v-card-text :class="{ 'pa-0': !contentPad, 'mb-6': withFooter }">
      <slot></slot>
      <div v-if="withFooter && !error" class="overline widget-footer">
        <slot name="footer"></slot>
      </div>
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
    },
    contentPad: {
      type: Boolean,
      default: true
    },
    withFooter: {
      type: Boolean,
      default: false
    },
    contextItems: {
      type: Array,
      default: () => []
    }
  }
};
</script>

<style lang="scss" scoped>
.widget-card {
  width: 100%;
  height: 100%;
}
.widget-footer {
  position: absolute;
  bottom: 16px;
}
</style>
