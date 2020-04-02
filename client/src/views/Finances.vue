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
              <v-list-item
                three-line
                v-for="(member, i) in members"
                :key="'finmem-' + i"
              >
                <v-list-item-avatar size="48" color="teal" left>
                  <span class="white--text headline"
                    >{{ member.firstname.substr(0, 1).toUpperCase()
                    }}{{ member.lastname.substr(0, 1).toUpperCase() }}</span
                  >
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title
                    >{{ member.firstname }}
                    {{ member.lastname }}</v-list-item-title
                  >
                  <v-list-item-subtitle
                    >{{ Math.floor(member.sum / 100) }},{{
                      member.sum % 100
                    }}
                    €</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="8">
        <v-card>
          <v-card-title>
            Expenses
            <v-spacer></v-spacer>
            <edit-expense-dialog
              v-model="editExpense"
              @committed="updateTable"
              ref="editDialog"
            ></edit-expense-dialog>
          </v-card-title>
          <v-data-table
            :headers="tableHeaders"
            :items="expenses"
            :options.sync="tableOptions"
            :server-items-length="tableTotalItems"
            :loading="tableLoading"
          >
            <template v-slot:item.actions="{ item }">
              <v-icon small class="mr-2" @click="editItem(item)"
                >mdi-pencil</v-icon
              >
              <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <confirm-dialog v-model="deleteDialogVisible" @positive="deleteConfirm" @negative="deleteDialogVisible = false" :loading="deleteDialogLoading">
      Are you sure you want to delete "{{ deleteDescription }}"?
    </confirm-dialog>
  </v-container>
</template>
<script>
import EditExpenseDialog from "@/components/dialogs/EditExpenseDialog.vue";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog.vue";

export default {
  name: "Finances",
  components: {
    EditExpenseDialog,
    ConfirmDialog
  },
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
        value: "description"
      },
      { text: "Member", value: "uid" },
      { text: "Date", value: "date" },
      { text: "Amount", value: "amount" },
      { text: "Actions", value: "actions" }
    ],
    tableOptions: {},
    tableTotalItems: 2,
    tableLoading: null,
    expenses: [
      {
        description: "Tiefkühlpizzaaa!",
        member: "Felix Kleinsteuber",
        date: 1585475790,
        amount: 164
      },
      {
        description: "Einkauf",
        member: "Max Mustermann",
        date: 1585375790,
        amount: 2354
      }
    ],
    editExpense: {
      description: "",
      amount: 0
    },
    deleteDialogVisible: false,
    deleteId: -1,
    deleteDescription: "",
    deleteDialogLoading: false
  }),
  methods: {
    updateTable() {
      this.tableLoading = true;
      this.loadData()
        .then(res => {
          if (res.success) {
            this.expenses = res.data;
            this.tableTotalItems = res.totalCount;
          } else alert(res.message);
          this.tableLoading = false;
        })
        .catch(err => {
          console.log("Error while fetching finances table.", err);
          this.tableLoading = false;
        });
    },
    async loadData() {
      const { data } = await this.$http.get("/_/fetchfinances", {
        p: this.tableOptions.page - 1,
        ps: this.tableOptions.itemsPerPage
      });

      if (data.success) {
        return {
          success: true,
          data: data.data,
          page: data.page,
          totalCount: data.entries,
          memberTotals: data.totals
        };
      } else return { success: false, message: data.message };
    },
    async commitDelete(fid) {
      const { data } = await this.$http.post("/_/delexpense", {
        id: fid
      });
      return data;
    },
    editItem(item) {
      this.$refs.editDialog.startEdit(item);
    },
    deleteItem(item) {
      this.deleteId = item.fid;
      this.deleteDescription = item.description;
      this.deleteDialogVisible = true;
    },
    async deleteConfirm() {
      this.deleteDialogLoading = true;
      try {
        let data = await this.commitDelete(this.deleteId);
        this.deleteDialogLoading = false;
        if(data.success) {
          this.deleteDialogVisible = false;
          this.$store.dispatch(
            "showSnackbar",
            "Item deleted."
          );
          this.updateTable();
        } else this.$store.dispatch(
            "showSnackbar",
            data.message
          );
      } catch(err) {
        this.deleteDialogLoading = false;
        this.$store.dispatch(
          "showSnackbar",
          "Communication error. Please try again later."
        );
        console.error(err);
      }
    }
  },
  watch: {
    tableOptions: {
      handler() {
        this.updateTable();
      },
      deep: true
    }
  }
};
</script>
<style lang="scss" scoped>
.round-avatar {
  border-radius: 50% !important;
}
</style>
