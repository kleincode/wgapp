<template>
  <v-container fluid>
    <h1 class="display-2 pl-12 pb-6">Finances</h1>
    <v-row>
      <v-col cols="12" md="6" lg="4">
        <v-card>
          <v-list three-line avatar>
            <!-- TODO: enable member filtering -->
            <v-subheader>Members</v-subheader>
            <v-list-item-group color="primary">
              <v-list-item three-line v-for="(member, i) in members" :key="'finmem-' + i">
                <v-list-item-avatar size="48" color="teal" left>
                  <span
                    class="white--text headline"
                  >{{ member.firstname.substr(0,1).toUpperCase() }}{{ member.lastname.substr(0,1).toUpperCase() }}</span>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ member.firstname }} {{ member.lastname }}</v-list-item-title>
                  <v-list-item-subtitle>{{ Math.floor(member.sum / 100) }},{{ member.sum % 100 }} €</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="8">
        <v-card>
          <v-card-title>Expenses</v-card-title>
          <v-data-table
            :headers="tableHeaders"
            :items="expenses"
            :options.sync="tableOptions"
            :server-items-length="tableTotalItems"
            :loading="tableLoading"
          >
            <template v-slot:item.actions="{ item }">
              <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
              <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: "Finances",
  data: () => ({
    members: [
      {
        id: 0,
        firstname: "Max",
        lastname: "Mustermann",
        sum: 13452
      },
      {
        id: 1,
        firstname: "Gundula",
        lastname: "Gause",
        sum: 245
      },
      {
        id: 2,
        firstname: "Claus",
        lastname: "Kleber",
        sum: 1614
      }
    ],
    tableHeaders: [
      {
        text: "Expense",
        align: "start",
        value: "expense"
      },
      { text: "Member", value: "member" },
      { text: "Date", value: "date" },
      { text: "Amount", value: "amount" },
      { text: "Actions", value: "actions" }
    ],
    tableOptions: {},
    tableTotalItems: 2,
    tableLoading: true,
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
  }),
  methods: {
    editItem(item) {
      alert("editing " + item.expense)
    },
    deleteItem(item) {
      alert("deleting " + item.expense)
      let index = this.expenses.find(el => el.id === item.id);
      this.expenses.splice(index, 1);
    }
  }
};
</script>
<style lang="scss" scoped>
.round-avatar {
  border-radius: 50% !important;
}
</style>
