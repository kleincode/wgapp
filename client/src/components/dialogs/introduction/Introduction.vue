<template>
  <div>
    <IntroductionDialog v-if="introductionState == 1"></IntroductionDialog>
    <!--2: Create household or join household-->
    <FeatureSnack :show-state="2" text=""></FeatureSnack>
    <DashboardDialog
      v-if="introductionState == 3"
      :next-state="4"
    ></DashboardDialog>
    <FeatureSnack :show-state="4" text="Click 'Shopping'"></FeatureSnack>
  </div>
</template>

<script>
import IntroductionDialog from "@/components/dialogs/introduction/IntroductionDialog.vue";
import DashboardDialog from "@/components/dialogs/introduction/DashboardDialog.vue";
import FeatureSnack from "@/components/dialogs/introduction/FeatureSnack.vue";
export default {
  name: "Introduction",
  components: {
    IntroductionDialog,
    DashboardDialog,
    FeatureSnack
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
    showShopping() {
      return this.introductionState == 4;
    }
  }
};
</script>

<style></style>
