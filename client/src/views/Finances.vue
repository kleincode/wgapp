<template>
  <v-container>
    <div style="display:flex">
      <h1 class="display-2 ml-12 mb-6" style="max-width: 80%">Finances</h1>
      <v-spacer></v-spacer>
      <v-select
        :items="timespanes"
        v-model="choosenTimeSpan"
        item-value="value"
        label="Choose time span"
      ></v-select>
    </div>
    <v-row align="stretch">
      <v-col cols="12" md="6" lg="4">
        <v-card style="height: 100%">
          <v-card-title>
            Member Expenses
          </v-card-title>
          <v-list three-line avatar>
            <v-subheader>Members</v-subheader>
            <v-list-item-group
              color="primary"
              v-model="filterMember"
              @change="updateTable"
            >
              <v-list-item
                three-line
                v-for="member in memberTotals"
                :key="'finmem-' + member.id"
                :value="member.id"
              >
                <v-list-item-avatar size="48" color="primary" left>
                  <span class="white--text headline">
                    {{ getUserInitials(member.id) }}
                  </span>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ getUserName(member.id) }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ (member.total / 100).toFixed(2) }} €
                  </v-list-item-subtitle>
                  <v-progress-linear
                    :value="memberTotalFunction(member.total)"
                  ></v-progress-linear>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="8">
        <v-card style="height: 100%">
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
            must-sort
          >
            <template v-slot:item.uid="{ item }">
              {{ getUserName(item.uid) }}
            </template>
            <template v-slot:item.date="{ item }">
              {{ renderDate(item.date) }}
            </template>
            <template v-slot:item.amount="{ item }">
              {{ (item.amount / 100).toFixed(2) }} €
            </template>
            <template v-slot:item.actions="{ item }">
              <v-icon small class="mr-2" @click="editItem(item)"
                >mdi-pencil</v-icon
              >
              <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <v-card style="height: 100%">
          <v-card-title>
            Monthly charges
            <v-spacer></v-spacer>
            <v-btn
              icon
              @click="monCharEditMode = !monCharEditMode"
              :color="monCharEditMode ? 'primary' : ''"
              ><v-icon>edit</v-icon></v-btn
            >
            <EditMonthlyChargesDialog
              v-model="editMonthlyCharges"
              @committed="fetchMonthlyData"
              ref="editMonthlyChargesDialog"
            ></EditMonthlyChargesDialog>
          </v-card-title>
          <v-container>
            <v-list>
              <v-list-item v-for="(charge, i) in monthlyCharges" :key="i">
                <v-list-item-icon>
                  <v-icon>{{ getIcon(charge.icon) }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ charge.name }}</v-list-item-title>
                  <v-list-item-subtitle
                    >payed by:
                    {{ charge.responsibleUser }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-icon>
                  {{ charge.amount }} {{ currency }}
                  <v-slide-x-reverse-transition>
                    <div v-show="monCharEditMode">
                      <v-btn
                        small
                        icon
                        @click="editMonChargeItem(charge)"
                        class="ml-2"
                        ><v-icon>edit</v-icon></v-btn
                      >
                      <v-btn
                        small
                        icon
                        color="error"
                        @click="deleteMonthlyCharge(charge)"
                        ><v-icon>delete</v-icon></v-btn
                      >
                    </div>
                  </v-slide-x-reverse-transition>
                </v-list-item-icon>
              </v-list-item>
            </v-list>
          </v-container>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="8">
        <v-card style="height: 100%">
          <v-card-title>
            Shared Expenses: March 2020
            <v-spacer></v-spacer>
            <v-dialog v-model="editBudgetDialog" max-width="600px">
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on" color="primary"
                  ><v-icon>edit</v-icon></v-btn
                >
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">Edit monthly budget</span>
                </v-card-title>
                <v-card-text>
                  <v-text-field
                    label="Amount"
                    v-model="tempTotalMonthlyBudget"
                    outlined
                    append-icon="euro"
                  ></v-text-field>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="saveMonthlyBudget"
                      >ok</v-btn
                    >
                    <v-btn text @click="editBudgetDialog = false">cancel</v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-dialog>
          </v-card-title>
          <v-container>
            <v-row justify="center">
              <v-col
                cols="12"
                md="4"
                :class="usedThisMonth > totalMonthlyBudget ? 'red--text' : ''"
              >
                <div class="text-center">
                  <div class="overline">used</div>
                  <div class="display-1">
                    {{ usedThisMonth }} {{ currency }}
                  </div>
                </div>
              </v-col>
              <v-col cols="1" class="text-center d-sm-none d-md-flex"
                ><v-divider vertical></v-divider
              ></v-col>
              <v-col cols="12" md="4">
                <div class="text-center">
                  <div class="overline">target total</div>
                  <div class="display-1">
                    {{ totalMonthlyBudget }} {{ currency }}
                  </div>
                </div>
              </v-col>
            </v-row>
            <v-list-item>
              <v-list-item-avatar size="48" color="secondary" left>
                <span class="white--text headline">
                  <v-icon xLarge>home</v-icon>
                </span>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  Monthly charges
                </v-list-item-title>
              </v-list-item-content>
              <v-list-item-icon
                >{{ usedMonthlyBudget }} {{ currency }}</v-list-item-icon
              >
            </v-list-item>
            <v-list-item>
              <v-list-item-avatar size="48" color="secondary" left>
                <span class="white--text headline">
                  <v-icon xLarge>person</v-icon>
                </span>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  Member charges
                </v-list-item-title>
              </v-list-item-content>
              <v-list-item-icon
                >{{ usedMonthlyBudget }} {{ currency }}</v-list-item-icon
              >
            </v-list-item>
          </v-container>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <v-card style="height: 100%">
          <v-card-title>
            Compensation Payments
          </v-card-title>
          <v-card-text>
            Calculate compensation payments for all member expenses since the
            last billing.
            <div class="text-center pt-8 pb-4">
              <span class="overline" style="font-size: 1em !important">
                last Billing
              </span>
              <h1 class="display-1">01.04.2020</h1>
            </div>
          </v-card-text>
          <v-card-actions
            ><v-btn color="primary" block>New Bill</v-btn></v-card-actions
          >
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="8">
        <v-card style="height: 100%">
          <v-card-title>Trend Expenses</v-card-title>
          <v-card-text
            ><v-sparkline
              :value="trendValues"
              :gradient="['#42b3f4']"
              :smooth="5"
              :padding="8"
              :line-width="1"
              stroke-linecap="round"
              gradient-direction="top"
              :fill="false"
              type="trend"
              :auto-line-width="false"
              auto-draw
            ></v-sparkline>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <confirm-dialog
      v-model="deleteDialogVisible"
      @positive="deleteConfirm"
      @negative="deleteDialogVisible = false"
      :loading="deleteDialogLoading"
      >Are you sure you want to delete "{{
        deleteDescription
      }}"?</confirm-dialog
    >
  </v-container>
</template>
<script>
import { mapGetters } from "vuex";
import icons from "@/assets/icons.js";

import EditExpenseDialog from "@/components/dialogs/EditExpenseDialog.vue";
import EditMonthlyChargesDialog from "@/components/dialogs/EditMonthlyChargesDialog.vue";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog.vue";

export default {
  name: "Finances",
  components: {
    EditExpenseDialog,
    ConfirmDialog,
    EditMonthlyChargesDialog
  },
  data: () => ({
    memberTotals: [],
    tableHeaders: [
      {
        text: "Expense",
        align: "start",
        value: "description"
      },
      { text: "Member", value: "uid", sortable: false },
      { text: "Date", value: "date" },
      { text: "Amount", value: "amount" },
      { text: "Actions", value: "actions", sortable: false }
    ],
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
    deleteExpenseMode: true, //false -> monthly charge
    deleteId: -1,
    deleteDescription: "",
    deleteDialogLoading: false,
    unixTimestamp: Math.floor(Date.now() / 1000),
    filterMember: null,

    editBudgetDialog: false,
    monthlyCharges: [],
    monCharEditMode: false,
    editMonthlyCharges: {
      name: "",
      icon: 0,
      amount: 0,
      uid: 0
    },
    totalMonthlyBudget: 300,
    tempTotalMonthlyBudget: 300,
    sharedExpenses: [
      {
        amount: 400,
        id: 8
      },
      {
        amount: 200,
        id: 13
      }
    ],
    currency: "€",
    timespanes: [
      { text: "current month", value: 0 },
      { text: "last 3 months", value: 1 },
      { text: "current year", value: 2 }
    ],
    choosenTimeSpan: 0,
    trendValues: [0, 2, 5, 9, 9, 10, 13, 14, 18, 19, 19, 21, 25, 26, 26]
  }),
  computed: {
    memberTotalFunction() {
      const max = this.memberTotals[0].total,
        min = this.memberTotals[this.memberTotals.length - 1].total;
      //This function maps a progress value to every total using squared interpolation
      const msq = Math.pow(min - max, 2),
        a = 90 / msq,
        b = (-180 * min) / msq,
        c =
          (100 * Math.pow(min, 2) - 20 * min * max + 10 * Math.pow(max, 2)) /
          msq;
      return total => a * Math.pow(total, 2) + b * total + c;
    },
    usedMonthlyBudget() {
      let sum = 0;
      this.monthlyCharges.forEach(charge => (sum += charge.amount));
      return sum;
    },
    usedThisMonth() {
      let sum = 0;
      this.sharedExpenses.forEach(expense => (sum += expense.amount));
      return this.usedMonthlyBudget + sum;
    },
    ...mapGetters(["getUserName", "getUserInitials"])
  },
  methods: {
    updateTable() {
      this.tableLoading = true;
      this.loadData()
        .then(res => {
          if (res.success) {
            this.unixTimestamp = Math.floor(Date.now() / 1000);
            this.expenses = res.data;
            this.tableTotalItems = res.totalCount;
            this.memberTotals = Object.entries(res.memberTotals)
              .map(([id, total]) => ({ id, total }))
              .sort((a, b) => b.total - a.total); // sort descending by total
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
          uid: this.filterMember,
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
      if (this.deleteExpenseMode) {
        const { data } = await this.$http.post("/_/delexpense", {
          id: fid
        });
        return data;
      } else {
        const { data } = await this.$http.post("/_/deletemonthlycharge", {
          id: fid
        });
        return data;
      }
    },
    editItem(item) {
      this.$refs.editDialog.startEdit(item);
    },
    deleteItem(item) {
      this.deleteExpenseMode = true;
      this.deleteId = item.fid;
      this.deleteDescription = item.description;
      this.deleteDialogVisible = true;
    },
    deleteMonthlyCharge(item) {
      this.deleteExpenseMode = false;
      this.deleteId = item.id;
      this.deleteDescription = item.name;
      this.deleteDialogVisible = true;
      this.monCharEditMode = false;
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
          this.fetchMonthlyData();
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

    saveMonthlyBudget() {
      this.totalMonthlyBudget = this.tempTotalMonthlyBudget;
      this.editBudgetDialog = false;
    },

    editMonChargeItem(item) {
      this.monCharEditMode = false;
      this.$refs.editMonthlyChargesDialog.startEdit(item);
    },

    async fetchMonthlyData() {
      const { data } = await this.$http.get("/_/fetchmonthlycharges");
      if (data.success) {
        this.monthlyCharges = [];
        data.data.forEach(charge => {
          let user, allMode;
          if (charge.uid == -1) {
            user = "ALL";
            allMode = true;
          } else {
            user = this.getUserName(charge.uid);
            allMode = false;
          }
          this.monthlyCharges.push({
            id: charge.id,
            name: charge.name,
            amount: charge.amount / 100,
            icon: charge.icon,
            responsibleUser: user,
            uid: charge.uid,
            all: allMode
          });
        });
      } else {
        console.error("Error during fetching monthlyData");
      }
    },

    renderDate(itemTimestamp) {
      let seconds = this.unixTimestamp - itemTimestamp;
      let sign = seconds < 0;
      seconds = Math.abs(seconds);
      if (seconds < 60) return "just now";
      let val = "";
      if (seconds > 60 * 60 * 24 * 7 * 5) {
        let dateThen = new Date(itemTimestamp),
          dateNow = new Date(this.unixTimestamp);
        let diffMonths = Math.abs(
          dateNow.getMonth() -
            dateThen.getMonth +
            12 * (dateNow.getFullYear() - dateThen.getFullYear())
        );
        if (diffMonths > 12) {
          val = Math.floor(diffMonths / 12) + " years";
        } else {
          val = diffMonths + " months";
        }
      }
      if (seconds > 60 * 60 * 24 * 7) {
        val = Math.floor(seconds / (60 * 60 * 24 * 7)) + " weeks";
      } else if (seconds > 60 * 60 * 24) {
        val = Math.floor(seconds / (60 * 60 * 24)) + " days";
      } else if (seconds > 60 * 60) {
        val = Math.floor(seconds / (60 * 60)) + " hours";
      } else {
        val = Math.floor(seconds / 60) + " minutes";
      }
      if (sign) return "in " + val;
      else return val + " ago";
    },
    getIcon(id) {
      return icons[id];
    }
  },
  mounted() {
    this.fetchMonthlyData();
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
