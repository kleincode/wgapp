<template>
  <div>
    <IntroductionDialog v-if="introductionState == 1"></IntroductionDialog>
    <!--2: Create household or join household-->
    <FeatureSnack :show-state="2" text="Continue"></FeatureSnack>
    <!--Dashboard-->
    <FeaturesDialog
      v-if="introductionState == 3"
      :text="$t('introduction.dashboard.text')"
      :subtext="$t('introduction.dashboard.subtext')"
      color="primary"
      :next-state="4"
    ></FeaturesDialog>
    <FeatureSnack
      :show-state="4"
      :text="$t('introduction.clickShopping')"
    ></FeatureSnack>
    <!--Shopping-->
    <FeaturesDialog
      v-if="introductionState == 5"
      :text="$t('introduction.shopping.text')"
      :subtext="$t('introduction.shopping.subtext')"
      color="warning"
      :next-state="6"
    ></FeaturesDialog>
    <FeatureSnack
      :show-state="6"
      :text="$t('introduction.clickFinances')"
    ></FeatureSnack>
    <!--Finances-->
    <FeaturesDialog
      v-if="introductionState == 7"
      :text="$t('introduction.finances.text')"
      :subtext="$t('introduction.finances.subtext')"
      color="pink darken-2"
      :next-state="8"
    ></FeaturesDialog>
    <FeatureSnack
      :show-state="8"
      :text="$t('introduction.clickTasks')"
    ></FeatureSnack>
    <!--Tasks-->
    <FeaturesDialog
      v-if="introductionState == 9"
      :text="$t('introduction.tasks.text')"
      :subtext="$t('introduction.tasks.subtext')"
      color="purple darken-2"
      :next-state="10"
    ></FeaturesDialog>
    <FeatureSnack
      :show-state="10"
      :text="$t('introduction.clickManageHousehold')"
    ></FeatureSnack>
    <!--Household Manager-->
    <FeaturesDialog
      v-if="introductionState == 11"
      :text="$t('introduction.manageHousehold.text')"
      :subtext="$t('introduction.manageHousehold.subtext')"
      color="red lighten-1"
      :next-state="12"
    ></FeaturesDialog>
    <FeatureSnack
      :show-state="12"
      :text="$t('introduction.clickSettings')"
    ></FeatureSnack>
    <!--Settings-->
    <FeaturesDialog
      v-if="introductionState == 13"
      :text="$t('introduction.settings.text')"
      :subtext="$t('introduction.settings.subtext')"
      color="warning"
      :next-state="14"
    ></FeaturesDialog>
    <FeatureSnack :show-state="14" text="" last></FeatureSnack>
    <!--Finish-->
    <FeaturesDialog
      v-if="introductionState == 15"
      :text="$t('introduction.end.text')"
      :subtext="$t('introduction.end.subtext')"
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
