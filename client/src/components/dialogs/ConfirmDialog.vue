<template>
  <v-dialog
    :value="value"
    :width="maxWidth"
    @input="onDialogToggle"
    @click:outside="onDialogToggle(false)"
  >
    <template #activator="{ on }">
      <slot name="activator" :on="on"></slot>
    </template>
    <v-card :loading="loading">
      <v-card-title class="headline">{{
        title || $t("commands.confirm")
      }}</v-card-title>

      <v-card-text>
        <slot></slot>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          :color="!invertColors ? 'red darken-1' : 'green darken-1'"
          text
          @click="onNegativeOption"
          >{{ negativeOption || $t("general.no") }}</v-btn
        >
        <v-btn
          :color="invertColors ? 'red darken-1' : 'green darken-1'"
          text
          @click="onPositiveOption"
          >{{ positiveOption || $t("general.yes") }}</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: "ConfirmDialog",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: null
    },
    positiveOption: {
      type: String,
      default: null
    },
    negativeOption: {
      type: String,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    },
    maxWidth: {
      type: Number,
      default: 300
    },
    invertColors: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onDialogToggle(visible) {
      this.$emit("input", visible);
    },
    onPositiveOption() {
      this.$emit("positive");
    },
    onNegativeOption() {
      this.$emit("negative");
    }
  }
};
</script>
