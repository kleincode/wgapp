<template>
  <HelpArticle title="Dashboard" :path="path">
    <template v-slot:content>
      <div class="headline mb-1 font-weight-bold">Dashboard</div>
      <p class="text-justify body-1">
        Hi there! This page is your overview and start screen. You don't quite
        like it here yet? Look under the settings and see what you can do.
      </p>

      <v-card
        :to="reference"
        color="primary lighten-1"
        class="title white--text text-center fill-height"
      >
        Set your dashboard
      </v-card>
    </template>
  </HelpArticle>
</template>
<script>
import HelpArticle from "@/components/HelpArticle.vue";
export default {
  name: "DashboardHelp",
  components: { HelpArticle },
  data: () => ({
    path: [
      {
        text: "Jeff",
        to: { name: "Help" },
        exact: true,
        disabled: false
      },
      {
        text: "Dashboard",
        disabled: true,
        exact: true,
        to: { name: "Help" }
      }
    ],
    reference: { name: "H-Settings" }
  })
};
</script>
