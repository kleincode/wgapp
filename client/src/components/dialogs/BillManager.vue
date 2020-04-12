<template>
  <v-dialog v-model="dialog" width="800">
    <template v-slot:activator="{ on }">
      <v-btn color="primary" block @click="fetchNewBill" v-on="on"
        >Open Bill Manager</v-btn
      >
    </template>

    <confirm-dialog
      v-model="finishPaymentDialog"
      @positive="finishPayments"
      @negative="finishPaymentDialog = false"
      >Are you sure you want to finish these payments? You can't retrieve this
      information afterwards.</confirm-dialog
    >

    <v-card :loading="loading">
      <v-card-title>
        <div class="headline">Bill Manager</div>
        <v-spacer></v-spacer>
        <div class="caption mr-2 mt-1">last bill:</div>
        {{ lastBill }}
      </v-card-title>

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
        <v-btn text @click="exportToHTML">Export</v-btn>
        <v-btn
          color="primary"
          text
          :disabled="empty"
          @click="finishPaymentDialog = true"
        >
          Finish payments
        </v-btn>
        <v-btn text @click="dialog = false">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapGetters } from "vuex";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog.vue";

export default {
  components: {
    ConfirmDialog
  },
  data: () => ({
    dialog: false,
    singleMemberTotals: [],
    monthlyData: [],
    memberMap: {},
    total: 0,
    mean: 0,
    lastBill: "",
    debts: [],
    empty: true,
    loading: false,
    finishPaymentDialog: false,
    includeMonthlyCharges: false,
    lastBillTimestamp: 0
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
        if (data.mainResult.length == 0) {
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

    async finishPayments() {
      const { data } = await this.$http.post("/_/updatelastbill");
      if (data.success) {
        this.$store.dispatch("showSnackbar", "Successfully updated last bill.");
      } else {
        this.$store.dispatch(
          "showSnackbar",
          "Error while updating last bill time. Please try again later."
        );
      }
      this.dialog = false;
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
    exportToHTML() {
      var myWindow = window.open(
        "",
        "WGApp - Compensation Payments",
        "toolbar=yes,scrollbars=yes,resizable=yes,width=700,height=900"
      );
      myWindow.document.write(
        '<html><head><link href="https://fonts.googleapis.com/css?family=Roboto&display=swap" rel="stylesheet"><title>WGApp - Compensation Payments</title></head><body><h1>Compensation Payments</h1><h3>' +
          new Date(this.lastBillTimestamp).toLocaleDateString() +
          " until " +
          new Date().toLocaleDateString() +
          '</h3><hr style="margin-bpottom: 15px">'
      );
      let css =
        "<style>body { font-family: 'Roboto', sans-serif; } table, th, td { border: 1px solid black; border-collapse: collapse;} table { border-spacing: 5px; } th, td {padding: 5px;}</style>";
      myWindow.document.write(
        "<h2>Expenses</h2> <ul><li><b>Total: " + this.total + " €</b></li>"
      );
      if (this.includeMonthlyCharges) {
        myWindow.document.write(
          "<li>Monthly Total: " + this.monthlyTotal + " €</li>"
        );
      }
      myWindow.document.write("<li> Per Person: " + this.mean + " €</li></ul>");
      myWindow.document.write("<h2>Member Expenses</h2><ul>");
      this.memberTotals.forEach(member => {
        myWindow.document.write(
          "<li>" +
            this.getUserName(member.id) +
            ": " +
            member.total / 100 +
            " €</li>"
        );
      });
      myWindow.document.write("</ul>");
      myWindow.document.write(
        '<h2>Resulting Debts</h2><table style="width:100%"><tr><th>Paying</th><th>Receives</th><th>Amount</th></tr>'
      );
      this.debts.forEach(debt => {
        myWindow.document.write(
          "<tr><td>" +
            this.getUserName(debt.paying) +
            "</td><td>" +
            this.getUserName(debt.receiving) +
            "</td><td>" +
            debt.amount +
            " €</td></td>"
        );
      });
      myWindow.document.write(
        "</table><h6>WGApp, 2020</h6></body>" + css + "</html>"
      );
      myWindow.document.close();
    },

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
    }
  }
};
</script>
