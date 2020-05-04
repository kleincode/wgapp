<template>
  <v-snackbar v-model="show" :timeout="0" color="primary">
    <div>
      <v-icon>info</v-icon>
      {{ text }}
    </div>
    <v-btn text @click="introductionState = 0">End Tutorial</v-btn>
  </v-snackbar>
</template>

<script>
export default {
  name: "FeatureSnack",
  props: {
    showState: {
      type: Number,
      default: () => 0
    },
    value: {
      type: Boolean,
      default: () => false
    },
    text: {
      type: String,
      default: () => ""
    }
  },
  computed: {
    introductionState: {
      get() {
        return this.$store.state.userSettings.introductionState;
      },
      set(value) {
        this.$store.commit("set_key", { key: "introductionState", value });
      }
    },
    show() {
      return this.introductionState == this.showState;
    }
  }
};
</script>

<style></style>
