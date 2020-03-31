<template>
  <div>
    <div class="md-layout md-gutter md-alignment-top-center">
      <md-card class="finances-card">
        <md-card-header>
          <div class="md-title">Finances</div>
        </md-card-header>
        <md-card-content>
          <div class="md-layout md-gutter md-alignment-top-center fill-width">
            <div
              class="md-layout-item md-xsmall-size-100 md-small-size-50 md-medium-size-33 md-xlarge-size-25 flex-item"
              v-for="(member, i) in members"
              :key="'finavt-' + i"
            >
              <md-avatar class="md-avatar-icon md-accent">A</md-avatar>
              <div class="pushleft">
                <div class="md-body-2">
                  {{ member.firstname }} {{ member.lastname }}
                </div>
                <div class="md-caption">
                  {{ Math.floor(member.sum / 100) }},{{
                    ("0" + (member.sum % 100)).slice(-2)
                  }}
                  €
                </div>
              </div>
            </div>
          </div>
        </md-card-content>
      </md-card>
    </div>
    <div
      class="md-layout md-gutter md-alignment-top-center"
      style="margin-top: 40px;"
    >
      <md-card class="finances-card">
        <md-table v-model="expenses">
          <md-table-toolbar>
            <h1 class="md-title">Expenses</h1>
          </md-table-toolbar>
          <md-table-row slot="md-table-row" slot-scope="{ item }">
            <md-table-cell md-label="Expense" md-sort-by="expense">{{
              item.expense
            }}</md-table-cell>
            <md-table-cell md-label="Member" md-sort-by="member">{{
              item.member
            }}</md-table-cell>
            <md-table-cell md-label="Date" md-sort-by="date" md-numeric>{{
              item.date
            }}</md-table-cell>
            <md-table-cell md-label="Amount" md-sort-by="amount" md-numeric>{{
              item.amount
            }}</md-table-cell>
          </md-table-row>
          <!--<md-table-pagination slot="md-table-pagination" />-->
        </md-table>
        <table-pagination></table-pagination>
      </md-card>
    </div>
  </div>
</template>
<script>
import TablePagination from "@/components/TablePagination.vue";

export default {
  name: "Finances",
  components: {
    TablePagination
  },
  data: () => ({
    members: [
      {
        firstname: "Max",
        lastname: "Mustermann",
        sum: 13452
      },
      {
        firstname: "Gundula",
        lastname: "Gause",
        sum: 245
      },
      {
        firstname: "Klaus",
        lastname: "Kleber",
        sum: 1614
      }
    ],
    expenses: [
      {
        expense: "Tiefkühlpizzaaa!",
        member: "Felix Kleinsteuber",
        date: 1585475790,
        amount: 164
      },
      {
        expense: "Einkauf",
        member: "Max Mustermann",
        date: 1585375790,
        amount: 2354
      }
    ]
  })
};
</script>
<style lang="scss" scoped>
.finances-card {
  min-width: 50%;
  max-width: 90%;
  width: 700px;
}
.fill-width {
  width: 100%;
}
.flex-item {
  display: flex;
  & > .pushleft {
    margin: 0 auto 0 0;
  }
}
</style>
