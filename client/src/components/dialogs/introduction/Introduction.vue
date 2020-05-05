<template>
  <div>
    <IntroductionDialog v-if="introductionState == 1"></IntroductionDialog>
    <!--2: Create household or join household-->
    <FeatureSnack :show-state="2" text="Continue"></FeatureSnack>
    <!--Dashboard-->
    <FeaturesDialog
      v-if="introductionState == 3"
      text="That's the dashboard."
      subtext="Here you have an overview about all the features we support. You can configure everything in the Settings later on."
      color="primary"
      :next-state="4"
    ></FeaturesDialog>
    <FeatureSnack :show-state="4" text="Click 'Shopping'"></FeatureSnack>
    <!--Shopping-->
    <FeaturesDialog
      v-if="introductionState == 5"
      text="You can write your shopping lists right here."
      subtext="You can add multiple lists and edit the items even offline. I will sync everything once your device is online. 
      Over time I will try to learn your usual shopping items and will autocomplete your items while you type."
      color="warning"
      :next-state="6"
    ></FeaturesDialog>
    <FeatureSnack :show-state="6" text="Click 'Finances'"></FeatureSnack>
    <!--Finances-->
    <FeaturesDialog
      v-if="introductionState == 7"
      text="Now we are in my finance system."
      subtext="You can add expenses and monthly charges here. I will evaluate everything else for you."
      color="pink darken-2"
      :next-state="8"
    ></FeaturesDialog>
    <FeatureSnack :show-state="8" text="Click 'Tasks'"></FeatureSnack>
    <!--Tasks-->
    <FeaturesDialog
      v-if="introductionState == 9"
      text="That's my task page."
      subtext="You can manage all tasks from here. I support single tasks, on-demand tasks and repeating tasks. If you activate push notifications I can even remind you of your tasks."
      color="purple darken-2"
      :next-state="10"
    ></FeaturesDialog>
    <FeatureSnack
      :show-state="10"
      text="Click 'Manage Household'"
    ></FeatureSnack>
    <!--Household Manager-->
    <FeaturesDialog
      v-if="introductionState == 11"
      text="Household manager"
      subtext="Invite new members and configure your household from here."
      color="red lighten-1"
      :next-state="12"
    ></FeaturesDialog>
    <FeatureSnack :show-state="12" text="Click 'Settings'"></FeatureSnack>
    <!--Settings-->
    <FeaturesDialog
      v-if="introductionState == 13"
      text="These are our settings."
      subtext="You can configure some general settings like language and notifications here. 
      You can also setup your dashboard in the corresponding tab. All supported integrations can configured 
      in the last tab."
      color="warning"
      :next-state="14"
    ></FeaturesDialog>
    <FeatureSnack :show-state="14" text="" last></FeatureSnack>
    <!--Finish-->
    <FeaturesDialog
      v-if="introductionState == 15"
      text="Thanks for having me!"
      subtext="If you have any questions check out our help or get in touch at "
      color="primary"
      :next-state="0"
      finish
    ></FeaturesDialog>
  </div>
</template>

<script>
import FeatureSnack from "@/components/dialogs/introduction/FeatureSnack.vue";
import IntroductionDialog from "@/components/dialogs/introduction/IntroductionDialog.vue";
import FeaturesDialog from "@/components/dialogs/introduction/FeaturesDialog.vue";
export default {
  name: "Introduction",
  components: {
    IntroductionDialog,
    FeaturesDialog,
    FeatureSnack
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
    showShopping() {
      return this.introductionState == 4;
    }
  },
  watch: {
    $route(newValue) {
      if (newValue.path == "/shopping" && this.introductionState <= 4) {
        this.introductionState = 5;
      } else if (newValue.path == "/finances" && this.introductionState <= 6) {
        this.introductionState = 7;
      } else if (newValue.path == "/tasks" && this.introductionState <= 8) {
        this.introductionState = 9;
      } else if (
        newValue.path == "/household" &&
        this.introductionState <= 10
      ) {
        this.introductionState = 11;
      } else if (newValue.path == "/settings" && this.introductionState <= 12) {
        this.introductionState = 13;
      }
    }
  }
};
</script>

<style></style>
