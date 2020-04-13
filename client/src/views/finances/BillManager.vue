<template>
  <v-container>
    <confirm-dialog
      v-model="finishPaymentDialog"
      @positive="finishPayments"
      @negative="finishPaymentDialog = false"
      >Are you sure you want to finish these payments? You can't retrieve this
      information afterwards.</confirm-dialog
    >
    <div style="display:flex">
      <h1 class="display-1">Bill Manager</h1>
      <v-spacer></v-spacer>
      <div class="caption mr-2 mt-1">last bill:</div>
      {{ lastBill }}
    </div>

    <v-row>
      <v-col cols="12" lg="8">
        <v-card :loading="loading" style="height: 100%">
          <v-card-title class="headline">New Bill</v-card-title>
          <v-card-text>
            <p v-if="empty" class="text-center headline pt-12 pb-12">
              No new expenses available
            </p>
            <v-row v-if="!empty">
              <v-col cols="12" md="4">
                <v-list three-line avatar>
                  <v-subheader>Members</v-subheader>
                  <v-list-item
                    v-for="member in memberTotals"
                    :key="'finmem-' + member.id"
                    three-line
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
                </v-list>
              </v-col>
              <v-col cols="12" md="8">
                <v-row>
                  <v-col
                    v-if="includeMonthlyCharges"
                    cols="12"
                    md="4"
                    class="text-center"
                  >
                    <div class="overline">Monthly total</div>
                    <div class="display-1">{{ monthlyTotal }} €</div>
                  </v-col>
                  <v-col
                    cols="12"
                    :md="includeMonthlyCharges ? '4' : '6'"
                    class="text-center primary--text"
                  >
                    <div class="overline">Total</div>
                    <div class="display-1">{{ total }} €</div>
                  </v-col>
                  <v-col
                    cols="12"
                    :md="includeMonthlyCharges ? '4' : '6'"
                    class="text-center"
                  >
                    <div class="overline">per person</div>
                    <div class="display-1">{{ mean }} €</div>
                  </v-col>
                </v-row>
                <h2 class="headline mt-4 mb-2">Compensation payments:</h2>
                <v-simple-table :loading="loading">
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">Paying</th>
                        <th class="text-left">Receives</th>
                        <th class="text-left">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(debt, i) in debts" :key="i">
                        <td>{{ getUserName(debt.paying) }}</td>
                        <td>{{ getUserName(debt.receiving) }}</td>
                        <td>{{ debt.amount }} €</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-switch
              v-model="includeMonthlyCharges"
              class="pl-2"
              label="Include monthly charges"
              @change="splitTotals"
            ></v-switch>
            <v-spacer></v-spacer>
            <v-btn text @click="exportCurrentBill">Export</v-btn>
            <v-btn
              color="primary"
              text
              :disabled="empty"
              @click="finishPaymentDialog = true"
            >
              Save payments
            </v-btn>
            <v-btn text @click="back">
              back
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" lg="4">
        <v-card style="height: 100%" :loading="loadingHistory">
          <v-card-title><h1 class="headline">Bill history</h1></v-card-title>
          <v-card-text>
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">From</th>
                    <th class="text-left">To</th>
                    <th class="text-left">Export</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="bill in billhistory" :key="bill.id">
                    <td>{{ new Date(bill.min).toLocaleDateString() }}</td>
                    <td>{{ new Date(bill.max).toLocaleDateString() }}</td>
                    <td>
                      <v-btn
                        icon
                        @click="exportBill(bill.min, bill.max, bill.data)"
                        ><v-icon>language</v-icon></v-btn
                      >
                      <v-btn icon disabled><v-icon>table_chart</v-icon></v-btn>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from "vuex";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog.vue";

import { exportToHTML } from "@/assets/exportToHTML.js";

export default {
  components: {
    ConfirmDialog
  },
  data: () => ({
    singleMemberTotals: [],
    monthlyData: [],
    memberMap: {},
    total: 0,
    mean: 0,
    lastBill: "",
    debts: [],
    empty: true,
    loading: false,
    loadingHistory: false,
    finishPaymentDialog: false,
    includeMonthlyCharges: false,
    lastBillTimestamp: 0,
    billhistory: []
  }),
  computed: {
    ...mapGetters(["getUserName", "getUserInitials"]),
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
    memberTotals() {
      let totals = JSON.parse(JSON.stringify(this.singleMemberTotals));
      if (this.includeMonthlyCharges) {
        let curTimestamp = Math.floor(Date.now() / 60000); //in minuten
        let lastBill = Math.floor(this.lastBillTimestamp / 60000);
        this.monthlyData.forEach(monEntry => {
          totals.forEach(entry => {
            if (monEntry.id == entry.id) {
              let diff = Math.round(
                (curTimestamp - lastBill) * (monEntry.total / 43800)
              );
              entry.total += diff;
            }
          });
        });
      }
      totals.sort((a, b) => b.total - a.total);
      return totals;
    },
    monthlyTotal() {
      let curTimestamp = Math.floor(Date.now() / 60000); //in minuten
      let lastBill = Math.floor(this.lastBillTimestamp / 60000);
      let sum = 0;
      this.monthlyData.forEach(monEntry => {
        sum +=
          Math.round((curTimestamp - lastBill) * (monEntry.total / 43800)) /
          100;
      });
      return sum;
    }
  },
  mounted() {
    this.fetchNewBill();
    this.fetchBillhistory();
  },
  methods: {
    async fetchNewBill() {
      this.dialog = true;
      this.loading = true;
      const { data } = await this.$http.get("/_/fetchnewbill");
      const { data: members } = await this.$http.get("/_/fetchhousehold");
      if (data.success) {
        this.singleMemberTotals = [];
        this.memberMap = {};
        this.monthlyData = [];
        let lastBill = new Date(data.lastBill).getTime();
        this.lastBill = this.renderDate(lastBill);
        this.lastBillTimestamp = lastBill;
        if (
          data.mainResult.length == 0 &&
          this.isToday(new Date(data.lastBill))
        ) {
          this.empty = true;
          this.loading = false;
          return;
        }
        this.empty = false;
        data.mainResult.forEach(entry => {
          this.singleMemberTotals.push({
            id: entry.uid,
            total: entry.amount
          });
          this.memberMap[entry.uid] = entry.amount / 100;
        });
        members.members.forEach(member => {
          let contains = false;
          this.singleMemberTotals.forEach(m => {
            if (m.id == member) {
              contains = true;
            }
          });
          if (!contains) {
            this.singleMemberTotals.push({
              id: member,
              total: 0
            });
            this.memberMap[member] = 0;
          }
        });
        data.monthlyResult.forEach(entry => {
          if (entry.uid != -1) {
            this.monthlyData.push({
              id: entry.uid,
              total: entry.amount
            });
          }
        });
        this.singleMemberTotals.sort((a, b) => b.total - a.total);
        this.splitTotals();
      } else {
        this.$store.dispatch(
          "showSnackbar",
          "Error while fetching Bill Manager data. Please try again later."
        );
        this.dialog = false;
      }
      this.loading = false;
    },

    isToday(date) {
      let cur = new Date();
      let variable =
        date.getDate() == cur.getDate() &&
        date.getMonth() == cur.getMonth() &&
        date.getFullYear() == cur.getFullYear();
      return variable;
    },

    exportCurrentBill() {
      exportToHTML(this.lastBillTimestamp, Date.now(), this.curToJSON());
    },

    exportBill(min, max, data) {
      exportToHTML(min, max, data);
    },

    curToJSON() {
      let data = {};
      data.total = this.total;
      data.includeMonthlyCharges = this.includeMonthlyCharges;
      data.monthlyTotal = this.monthlyTotal;
      data.mean = this.mean;
      data.memberTotals = [];
      this.memberTotals.forEach(member => {
        data.memberTotals.push({
          name: this.getUserName(member.id),
          total: member.total
        });
      });
      data.debts = [];
      this.debts.forEach(debt => {
        data.debts.push({
          paying: this.getUserName(debt.paying),
          receiving: this.getUserName(debt.receiving),
          amount: debt.amount
        });
      });
      return data;
    },

    async finishPayments() {
      this.loading = true;
      const { data } = await this.$http.post("/_/updatelastbill", {
        min: this.lastBillTimestamp,
        max: Date.now(),
        data: this.curToJSON()
      });
      if (data.success) {
        this.$store.dispatch("showSnackbar", "Successfully updated last bill.");
      } else {
        this.$store.dispatch(
          "showSnackbar",
          "Error while updating last bill time. Please try again later."
        );
      }
      this.loadingHistory = false;
      this.finishPaymentDialog = false;
      this.back();
    },

    async fetchBillhistory() {
      try {
        this.loadingHistory = true;
        const { data } = await this.$http.get("/_/fetchbillhistory");
        if (data.success) {
          this.billhistory = [];
          data.results.forEach(bill => {
            this.billhistory.push({
              id: bill.id,
              min: bill.min,
              max: bill.max,
              data: bill.data
            });
          });
          this.loadingHistory = false;
        } else {
          this.loadingHistory = false;
          this.$store.dispatch(
            "showSnackbar",
            "Error while fetching bill history. Please try again later."
          );
        }
      } catch (err) {
        this.loadingHistory = false;
        this.$store.dispatch(
          "showSnackbar",
          "Error while fetching bill history. Please try again later."
        );
        console.error(err);
      }
    },

    splitTotals() {
      let totals = JSON.parse(JSON.stringify(this.memberMap));
      //optionally add monthly charges
      if (this.includeMonthlyCharges) {
        let curTimestamp = Math.floor(Date.now() / 60000); //in minutes
        let lastBill = Math.floor(this.lastBillTimestamp / 60000);
        if (this.monthlyData.length > 0) {
          this.monthlyData.forEach(entry => {
            let newAmount =
              Math.round((curTimestamp - lastBill) * (entry.total / 43800)) /
              100;
            if (totals[entry.id] == undefined) {
              totals[entry.id] = newAmount;
            } else {
              totals[entry.id] = totals[entry.id] + newAmount;
            }
          });
        }
      }

      const people = Object.keys(totals);
      const valuesPaid = Object.values(totals);
      let debts = [];

      const sum = valuesPaid.reduce((acc, curr) => curr + acc);
      this.total = Math.round(sum * 100) / 100;
      const mean = sum / people.length;
      this.mean = Math.round(100 * mean) / 100;

      const sortedPeople = people.sort(
        (personA, personB) => totals[personA] - totals[personB]
      );
      const sortedValuesPaid = sortedPeople.map(
        person => totals[person] - mean
      );

      let i = 0;
      let j = sortedPeople.length - 1;
      let debt;

      while (i < j) {
        debt = Math.min(-sortedValuesPaid[i], sortedValuesPaid[j]);
        sortedValuesPaid[i] += debt;
        sortedValuesPaid[j] -= debt;

        debts.push({
          paying: sortedPeople[i],
          receiving: sortedPeople[j],
          amount: Math.round(100 * debt) / 100
        });

        if (sortedValuesPaid[i] === 0) {
          i++;
        }

        if (sortedValuesPaid[j] === 0) {
          j--;
        }
      }
      this.debts = debts;
    },
    getTimespanDiff() {},

    renderDate(itemTimestamp) {
      if (itemTimestamp == 0) {
        return "no last bill";
      }
      itemTimestamp = itemTimestamp / 1000;
      let curTimestamp = new Date().getTime() / 1000;
      let seconds = curTimestamp - itemTimestamp;
      let sign = seconds < 0;
      seconds = Math.abs(seconds);
      if (seconds < 60) return "just now";
      let val = "";
      if (seconds > 60 * 60 * 24 * 7 * 5) {
        let dateThen = new Date(itemTimestamp),
          dateNow = new Date(curTimestamp);
        let diffMonths = Math.abs(
          dateNow.getMonth() -
            dateThen.getMonth() +
            12 * (dateNow.getFullYear() - dateThen.getFullYear())
        );
        if (diffMonths > 12) {
          val = Math.floor(diffMonths / 12) + " years";
        } else {
          if (diffMonths == 1) {
            val = diffMonths + " month";
          } else {
            val = diffMonths + " months";
          }
        }
      } else if (seconds > 60 * 60 * 24 * 7) {
        let count = Math.floor(seconds / (60 * 60 * 24 * 7));
        if (count == 1) {
          val = count + " week";
        } else {
          val = count + " weeks";
        }
      } else if (seconds > 60 * 60 * 24) {
        let count = Math.floor(seconds / (60 * 60 * 24));
        if (count == 1) {
          val = count + " day";
        } else {
          val = count + " days";
        }
      } else if (seconds > 60 * 60) {
        let count = Math.floor(seconds / (60 * 60));
        if (count == 1) {
          val = count + " hour";
        } else {
          val = count + " hours";
        }
      } else {
        let count = Math.floor(seconds / 60);
        if (count == 1) {
          val = count + " minute";
        } else {
          val = count + " minutes";
        }
      }
      if (sign) return "in " + val;
      else return val + " ago";
    },
    back() {
      this.$router.back();
    }
  }
};
</script>
