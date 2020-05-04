<template>
  <FeaturesDialog
    text="We are in the dashboard."
    subtext="Here you have an overview about all the features we support. You can configure everything in the Settings."
    color="primary"
    :next-state="4"
  ></FeaturesDialog>
</template>

<script>
import FeaturesDialog from "@/components/dialogs/introduction/FeaturesDialog.vue";
export default {
  name: "DashboardDialog",
  components: {
    FeaturesDialog
  },
  props: {
    nextState: {
      type: Number,
      default: () => 0
    }
  }
};
</script>

<style></style>
