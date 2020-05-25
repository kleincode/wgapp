<template>
  <v-card style="height: 100%">
    <v-card-title>
      {{ $t("finances.expenses") }}
      <v-spacer></v-spacer>
      <edit-expense-dialog
        ref="editDialog"
        v-model="editExpense"
        @committed="onExpenseCommit"
      ></edit-expense-dialog>
    </v-card-title>
    <v-data-table
      :headers="tableHeaders"
      :items="expenses"
      :options.sync="tableOptions"
      :server-items-length="tableTotalItems"
      :loading="tableLoading"
      :no-data-text="$t('finances.empty.expenses')"
      must-sort
    >
      <template v-slot:item.uid="{ item }">
        {{ getUserName(item.uid) }}
      </template>
      <template v-slot:item.date="{ item }">
        {{ formatDateRelative(item.date) }}
      </template>
      <template v-slot:item.amount="{ item }">
        {{ getCurrency((item.amount / 100).toFixed(2)) }}
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          v-if="item.receipt"
          small
          class="mr-2"
          color="primary"
          @click="openReceipt(item)"
          >camera_alt</v-icon
        >
        <v-icon v-else small class="mr-2" @click="openReceipt(item)"
          >add_a_photo</v-icon
        >
        <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>
    <receipt-dialog ref="receiptDialog"></receipt-dialog>
    <confirm-dialog
      v-model="deleteDialogVisible"
      :loading="deleteDialogLoading"
      @positive="deleteConfirm"
      @negative="deleteDialogVisible = false"
    >
      {{ $t("finances.confirmDeleteItem", { item: deleteDescription }) }}
    </confirm-dialog>
  </v-card>
</template>
<script>
import { mapGetters } from "vuex";

import EditExpenseDialog from "@/components/dialogs/EditExpenseDialog.vue";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog.vue";
import ReceiptDialog from "@/components/dialogs/ReceiptDialog.vue";

export default {
  name: "Finances",
  components: {
    EditExpenseDialog,
    ConfirmDialog,
    ReceiptDialog
  },
  data: () => ({
    tableOptions: {
      sortBy: ["date"],
      sortDesc: [true]
    },
    tableTotalItems: 2,
    tableLoading: null,
    expenses: [],
    editExpense: {
      description: "",
      amount: 0
    },
    deleteDialogVisible: false,
    deleteId: -1,
    deleteDescription: "",
    deleteDialogLoading: false
  }),
  computed: {
    tableHeaders() {
      return [
        {
          text: this.$t("finances.expenseTable.expense"),
          align: "start",
          value: "description"
        },
        {
          text: this.$t("finances.expenseTable.member"),
          value: "uid",
          sortable: false
        },
        { text: this.$t("finances.expenseTable.date"), value: "date" },
        { text: this.$t("finances.expenseTable.amount"), value: "amount" },
        {
          text: this.$t("finances.expenseTable.actions"),
          value: "actions",
          sortable: false
        }
      ];
    },
    ...mapGetters(["getUserName"]),
    ...mapGetters("userSettings", ["formatDateRelative"])
  },
  watch: {
    tableOptions: {
      handler() {
        this.updateTable();
      },
      deep: true
    }
  },
  mounted() {},
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
        params: {
          p: this.tableOptions.page - 1,
          ps: this.tableOptions.itemsPerPage,
          s: this.tableOptions.sortBy[0],
          desc: this.tableOptions.sortDesc[0] ? true : null
        }
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
        if (data.success) {
          this.deleteDialogVisible = false;
          this.$store.dispatch("showSnackbar", "Item deleted.");
          this.updateTable();
        } else this.$store.dispatch("showSnackbar", data.message);
      } catch (err) {
        this.deleteDialogLoading = false;
        this.$store.dispatch(
          "showSnackbar",
          "Communication error. Please try again later."
        );
        console.error(err);
      }
    },

    //HELPER
    getCurrency(val) {
      if (val == 0) {
        val = 0.0;
      }
      return new Intl.NumberFormat(
        this.$store.state.userSettings.locale || undefined,
        {
          style: "currency",
          currency: this.$store.state.userSettings.currency
        }
      ).format(val);
    },
    openReceipt(item) {
      this.$refs.receiptDialog.open(item);
    },
    onExpenseCommit(receiptItem) {
      if (receiptItem) this.openReceipt(receiptItem);
      this.updateTable();
    }
  }
};
</script>
