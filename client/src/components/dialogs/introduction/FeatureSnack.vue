<template>
  <v-snackbar v-model="show" style="bottom: 5em" :timeout="0" color="accent">
    <div>
      <v-icon color="white">info</v-icon>
      <v-btn v-if="last" text @click="introductionState = 15">{{
        $t("introduction.finishTutorial")
      }}</v-btn>
      {{ text }}
    </div>
    <v-btn v-if="!last" text @click="introductionState = 0">{{
      $t("introduction.endTutorial")
    }}</v-btn>
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
    },
    last: {
      type: Boolean,
      default: () => false
    }
  },
  computed: {
    introductionState: {
      get() {
        return this.$store.state.userSettings.introductionState;
      },
      set(value) {
        this.$store.commit("userSettings/set_key", {
          key: "introductionState",
          value
        });
      }
    },
    show() {
      return this.introductionState == this.showState;
    }
  }
};
</script>

<style></style>
