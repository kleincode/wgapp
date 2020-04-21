<template>
  <v-container>
    <h1 class="display-2 mb-6">Help</h1>
    <v-tabs vertical>
      <v-tab>
        <v-icon left>help</v-icon>
      </v-tab>
      <v-tab>
        <v-icon left>money</v-icon>
        Finances
      </v-tab>
      <v-tab>
        <v-icon left>list</v-icon>
        Tasks
      </v-tab>
      <v-tab>
        <v-icon left>people</v-icon>
        Manage Household
      </v-tab>
      <v-tab-item>
        <v-card flat>
          <v-card-text><OverviewHelp></OverviewHelp> </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text><FinancesHelp></FinancesHelp> </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text> </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script>
import FinancesHelp from "@/views/help/FinancesHelp.vue";
import OverviewHelp from "@/views/help/OverviewHelp.vue";
export default {
  name: "Help",
  components: {
    FinancesHelp,
    OverviewHelp
  },
  data: () => ({})
};
</script>
