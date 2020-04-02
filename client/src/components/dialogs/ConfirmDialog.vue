<template>
  <v-dialog v-model="value" @input="onDialogToggle" @click:outside="onDialogToggle(false)" max-width="300">
    <v-card :loading="loading">
      <v-card-title class="headline">{{ title }}</v-card-title>

      <v-card-text>
        <slot></slot>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red darken-1" text @click="onNegativeOption">{{ negativeOption }}</v-btn>
        <v-btn color="green darken-1" text @click="onPositiveOption">{{ positiveOption }}</v-btn>
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
      default: "Confirm"
    },
    positiveOption: {
      type: String,
      default: "Yes"
    },
    negativeOption: {
      type: String,
      default: "No"
    },
    loading: {
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