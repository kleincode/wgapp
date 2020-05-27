<template>
  <v-container>
    <router-view></router-view>
    <v-bottom-navigation
      :style="{
        left: $vuetify.application.left + 'px',
        paddingRight: $vuetify.application.left + 'px'
      }"
      grow
      fixed
      color="primary"
      class="elevation-24"
    >
      <v-btn :to="{ name: 'FinancesOverview' }" exact>
        <span>{{ $t("finances.tabs.overview") }}</span>
        <v-icon>bar_chart</v-icon>
      </v-btn>
      <v-btn :to="{ name: 'ExpensesTable' }" exact>
        <span>{{ $t("finances.tabs.expenses") }}</span>
        <v-icon>table_chart</v-icon>
      </v-btn>
      <v-btn :to="{ name: 'MonthlyCharges' }" exact>
        <span>{{ $t("finances.tabs.monthlyCharges") }}</span>
        <v-icon>repeat</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-container>
</template>
<script>
export default {
  name: "Finances"
};
</script>
