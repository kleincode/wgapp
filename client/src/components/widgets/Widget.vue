<template>
  <v-card
    :loading="loading"
    :color="error ? 'red' : color"
    :elevation="6"
    :style="large ? 'height: 417px' : 'height: 200px'"
    style="display: flex; flex-flow: column; height: 100%;"
  >
    <v-card-title>
      {{ title }}
      <v-spacer></v-spacer>
      <v-icon v-if="error">error</v-icon>
      <v-menu v-if="!error && displayedContextItems.length">
        <template #activator="{ on }">
          <v-btn icon small v-on="on">
            <v-icon>more_vert</v-icon>
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item
            v-for="(item, index) in displayedContextItems"
            :key="index"
            @click="handleContextClick(item)"
          >
            <v-list-item-icon class="mr-4">
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.text }}</v-list-item-title>
              <v-list-item-subtitle v-if="item.subtext">{{
                item.subtext
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card-title>
    <v-card-text :class="{ 'pa-0': !contentPad }" style="flex-grow : 1;">
      <slot style="flex-grow : 1;"></slot>
      <div v-if="withFooter && !error" class="overline bottom-footer">
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
    },
    large: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: null
    }
  },
  computed: {
    displayedContextItems() {
      var items = JSON.parse(JSON.stringify(this.contextItems));
      if (this.large) {
        items.push({
          action: "toggleSize",
          text: this.$t("widgets.setSmall"),
          icon: "close_fullscreen"
        });
      } else {
        items.push({
          action: "toggleSize",
          text: this.$t("widgets.setLarge"),
          icon: "open_in_full"
        });
      }
      return items;
    }
  },
  methods: {
    handleContextClick(item) {
      if (item.action == "toggleSize") {
        this.$emit("togglesize");
      } else {
        this.$emit("context-action", item);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.bottom-footer {
  position: absolute;
  bottom: 15px;
  width: 90%;
}
</style>
