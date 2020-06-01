<template>
  <v-row>
    <v-col cols="12" md="6" lg="8" xl="9" class="d-flex flex-column">
      <!-- Monthly budget -->
      <v-card class="flex-grow-0" :loading="loadingMonthlyCharges">
        <v-card-title>
          {{ $t("finances.overview") }}:
          <v-select
            v-model="chosenTimeSpan"
            :items="timespans"
            item-value="value"
            :label="$t('finances.chooseTimeSpan')"
            solo
            dense
            hide-details
            style="max-width: 300px;"
            class="ml-4"
            @change="updateTable()"
          ></v-select>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-container>
          <v-row justify="center">
            <v-col
              cols="12"
              md="4"
              :class="usedTotal > relativeTotal ? 'red--text' : ''"
            >
              <div class="text-center">
                <div class="overline">{{ $t("finances.currentlyUsed") }}</div>
                <div class="display-1">{{ getCurrency(usedTotal) }}</div>
              </div>
            </v-col>
            <v-col cols="1" class="text-center d-none d-md-block"
              ><v-divider vertical></v-divider
            ></v-col>
            <v-col cols="12" md="4">
              <div class="text-center">
                <div class="overline pr-6">
                  {{ $t("finances.currentTargetTotal") }}
                </div>
                <div class="display-1">
                  {{ getCurrency(relativeTotal) }}
                  <!-- Edit budget dialog -->
                  <v-dialog v-model="editBudgetDialog" max-width="600px">
                    <template v-slot:activator="{ on }">
                      <v-btn icon color="primary" class="mb-2" v-on="on"
                        ><v-icon>edit</v-icon></v-btn
                      >
                    </template>
                    <v-card>
                      <v-card-title>
                        <span class="headline">{{
                          $t("finances.editMonthlyBudget")
                        }}</span>
                      </v-card-title>
                      <v-card-text>
                        <v-text-field
                          v-model="tempTotalMonthlyBudget"
                          :label="$t('finances.amount')"
                          outlined
                          type="number"
                          step=".01"
                          append-icon="euro"
                        ></v-text-field>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn text @click="editBudgetDialog = false">{{
                            $t("commands.cancel")
                          }}</v-btn>
                          <v-btn
                            text
                            color="success"
                            @click="updateFinancesTarget"
                          >
                            {{ $t("commands.ok") }}
                          </v-btn>
                        </v-card-actions>
                      </v-card-text>
                    </v-card>
                  </v-dialog>
                </div>
              </div>
            </v-col>
          </v-row>
          <v-list-item>
            <v-list-item-avatar size="48" color="accent" left>
              <span class="white--text headline">
                <v-icon x-large>home</v-icon>
              </span>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                {{ $t("finances.monthlyCharges") }}
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>{{
              getCurrency(usedMonthlyBudget)
            }}</v-list-item-icon>
          </v-list-item>
          <v-list-item>
            <v-list-item-avatar size="48" color="accent" left>
              <span class="white--text headline">
                <v-icon x-large>person</v-icon>
              </span>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                {{ $t("finances.memberExpenses") }}
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>{{
              getCurrency(usedIndividualBudget)
            }}</v-list-item-icon>
          </v-list-item>
        </v-container>
      </v-card>
      <!-- Expenses trend -->
      <v-card class="flex-grow-1">
        <v-card-title
          >{{ $t("finances.memberTrendExpenses") }}:
          {{ intervalStr }}</v-card-title
        >
        <v-card-text>
          <ExpenseChart ref="chart" :chart-data="getChartData"></ExpenseChart>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" md="6" lg="4" xl="3" class="d-flex flex-column">
      <!-- Members -->
      <v-card :elevation="6" class="flex-grow-1 mb-4">
        <v-card-title>{{ $t("finances.memberExpenses") }}</v-card-title>
        <v-list v-if="memberTotals.length > 0" three-line avatar disabled>
          <v-subheader>{{ $t("general.members") }}</v-subheader>
          <v-list-item-group
            v-model="filterMember"
            color="primary"
            @change="updateTable"
          >
            <v-list-item
              v-for="member in memberTotals"
              :key="'finmem-' + member.id"
              three-line
              :value="member.id"
            >
              <v-list-item-avatar
                size="48"
                :color="userImages[member.id] ? '' : 'primary'"
                left
              >
                <v-img
                  v-show="userImages[member.id]"
                  :src="userImages[member.id]"
                ></v-img>
                <span
                  v-show="!userImages[member.id]"
                  class="white--text headline"
                >
                  {{ getUserInitials(member.id) }}
                </span>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  {{ getUserName(member.id) }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ getCurrency((member.total / 100).toFixed(2)) }}
                </v-list-item-subtitle>
                <v-progress-linear
                  :value="memberTotalFunction(member.total)"
                ></v-progress-linear>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
        <div
          v-else
          style="text-align: center"
          class="text--disabled pb-12 pt-8 pl-3 pr-3"
        >
          <v-icon style="font-size: 6em" class="text--disabled"
            >supervisor_account</v-icon
          >
          <br />{{ $t("finances.empty.members") }}
        </div>
      </v-card>
      <!-- Bill manager -->
      <v-card :loading="loadingLastBilling" :elevation="6" class="flex-grow-0">
        <v-card-title>
          {{ $t("finances.compensationPayments") }}
        </v-card-title>
        <v-card-text>
          {{ $t("finances.compensationPaymentsExplanation") }}
          <div class="text-center pt-8 pb-4">
            <span class="overline" style="font-size: 1em !important">
              {{ $t("finances.lastBill") }}
            </span>
            <h1 class="display-1">{{ lastBill }}</h1>
          </div>
        </v-card-text>
        <v-card-actions>
          <BillManager />
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import { mapGetters } from "vuex";
import { fetchProfileImg } from "@/assets/profileimagesHelper.js";

import ExpenseChart from "@/components/charts/ExpenseChart.vue";
import BillManager from "@/components/BillManager.vue";

export default {
  name: "FinancesOverview",
  components: {
    ExpenseChart,
    BillManager
  },
  data: () => ({
    userImages: {},
    memberTotals: [],
    filterMember: null,

    editBudgetDialog: false,
    monthlyCharges: [],
    loadingMonthlyCharges: false,
    totalMonthlyBudget: 1300,
    tempTotalMonthlyBudget: 1300,
    chosenTimeSpan: 0,
    lastBill: "",
    loadingLastBilling: false,
    trendValues: []
  }),
  computed: {
    timespans() {
      return [
        { text: this.$t("finances.timespans.currentMonth"), value: 0 },
        {
          text: this.$t("finances.timespans.currentAndLastTwoMonths"),
          value: 1
        },
        { text: this.$t("finances.timespans.currentYear"), value: 2 }
      ];
    },
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
      let fac = this.getFacForIntervall();
      this.monthlyCharges.forEach(charge => (sum += fac * charge.amount));
      return Math.round(sum * 100) / 100;
    },
    usedIndividualBudget() {
      let sum = 0;
      this.memberTotals.forEach(entry => (sum += entry.total / 100));
      return sum;
    },
    usedTotal() {
      return (
        Math.round(100 * (this.usedMonthlyBudget + this.usedIndividualBudget)) /
        100
      );
    },
    relativeTotal() {
      return (
        Math.round(100 * this.totalMonthlyBudget * this.getFacForIntervall()) /
        100
      );
    },
    getChartData() {
      let data = { labels: [], datasets: [] };
      if (this.trendValues == undefined || this.trendValues.length == 0) {
        return data;
      }
      data.datasets.push({
        label: "Expenses",
        backgroundColor: this.$vuetify.theme.themes.dark.primary,
        data: []
      });

      let minTimestamp = this.getMinTimestamp() * 1000;
      let diff, fac;
      switch (this.chosenTimeSpan) {
        case 0:
          diff = 2628000000;
          fac = 15;
          break;
        case 1:
          diff = 7884000000;
          fac = 18;
          break;
        case 2:
          diff = 31540000000;
          fac = 12;
          break;
      }
      let maxTimestamp = minTimestamp + diff;
      let step = diff / fac;
      let sum = 0;
      let curTimestamp = Date.now();
      for (let i = minTimestamp; i < maxTimestamp; i += step) {
        this.trendValues.forEach(entry => {
          let date = entry.date * 1000;
          if (date > i && date < i + step) {
            sum += entry.amount / 100;
          }
        });
        data.labels.push(
          new Date(i).toLocaleDateString(
            this.$store.state.userSettings.locale || undefined
          )
        );
        if (i < curTimestamp) {
          data.datasets[0].data.push(Math.round(100 * sum) / 100);
        }
      }

      return data;
    },

    intervalStr() {
      let curDate = new Date();
      let startDate = new Date(this.getMinTimestamp() * 1000);
      return (
        startDate.toLocaleDateString(
          this.$store.state.userSettings.locale || undefined
        ) +
        " - " +
        curDate.toLocaleDateString(
          this.$store.state.userSettings.locale || undefined
        )
      );
    },
    ...mapGetters(["getUserName", "getUserInitials"]),
    ...mapGetters("userSettings", ["formatDateRelative"])
  },
  mounted() {
    this.fetchMonthlyData();
    this.fetchLastBilling();
    this.fetchFinancesTarget();
    this.updateTable();
  },
  methods: {
    updateTable() {
      this.loadData()
        .then(res => {
          if (res.success) {
            this.memberTotals = Object.entries(res.memberTotals)
              .map(([id, total]) => ({ id, total }))
              .sort((a, b) => b.total - a.total); // sort descending by total
            this.memberTotals.forEach(async member => {
              if (!this.userImages[member.id]) {
                this.$set(
                  this.userImages,
                  member.id,
                  await fetchProfileImg(member.id)
                );
              }
            });
            this.trendValues = [];
            res.trend.forEach(entry =>
              this.trendValues.push({
                date: entry.created,
                amount: entry.amount
              })
            );
            this.trendValues.sort((a, b) => b.date - a.date);
          } else alert(res.message);
        })
        .catch(err => {
          console.log("Error while fetching finances table.", err);
        });
    },
    async loadData() {
      const { data } = await this.$http.get("/_/fetchfinances", {
        params: {
          p: 0,
          ps: 0,
          uid: this.filterMember,
          minTimestamp: this.getMinTimestamp()
        }
      });
      if (data.success) {
        return {
          success: true,
          memberTotals: data.totals,
          trend: data.trend
        };
      } else return { success: false, message: data.message };
    },
    getMinTimestamp() {
      let date = new Date();
      date.setDate(1);
      date.setHours(0, 0, 0, 0);
      switch (this.chosenTimeSpan) {
        case 0:
          break;
        case 1:
          date.setMonth(date.getMonth() - 2);
          break;
        case 2:
          date.setMonth(0);
          break;
      }
      let value = Math.floor(date.getTime() / 1000);
      return value;
    },
    getFacForIntervall() {
      switch (this.chosenTimeSpan) {
        case 0:
          return 1; //one monthly budget
        case 1:
          return 3; //3 monthly budgets
        case 2:
          return new Date().getMonth() + 1;
      }
    },
    async fetchMonthlyData() {
      this.loadingMonthlyCharges = true;
      try {
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
          this.$store.dispatch(
            "showSnackbar",
            "Error during fetching monthly data. Please try again later."
          );
          console.error("Error during fetching monthly data", data);
        }
      } catch (err) {
        this.$store.dispatch(
          "showSnackbar",
          "Error during fetching monthly data. Please try again later."
        );
        console.error("Error during fetching monthly data");
      }
      this.loadingMonthlyCharges = false;
    },

    async fetchLastBilling() {
      this.loadingLastBilling = true;
      try {
        const { data } = await this.$http.get("/_/fetchlastbill");
        if (data.success) {
          if (data.results.length == 0) {
            this.lastBill = "----";
          } else {
            this.lastBill = this.formatDateRelative(
              new Date(data.results[0].lastBill).getTime() / 1000
            );
          }
        } else {
          this.$store.dispatch(
            "showSnackbar",
            this.$t("finances.erros.fetchLastBillFailed")
          );
          console.log("Error during fetching last bill", data);
        }
      } catch (err) {
        this.$store.dispatch("showSnackbar", this.$t("general.errors.connect"));
        console.error("Error during fetching last bill", err);
      }
      this.loadingLastBilling = false;
    },

    //FINANCES TARGET

    async fetchFinancesTarget() {
      try {
        const { data } = await this.$http.get("/_/fetchfinancestarget");
        if (data.success) {
          this.totalMonthlyBudget = data.results[0].amount / 100;
          this.tempTotalMonthlyBudget = this.totalMonthlyBudget;
        } else {
          this.$store.dispatch(
            "showSnackbar",
            this.$t("general.errors.communication")
          );
          console.error("Error during fetching finances target.", data);
        }
      } catch (err) {
        this.$store.dispatch("showSnackbar", this.$t("general.errors.connect"));
        console.error("Error during fetching finances target.");
      }
      this.editBudgetDialog = false;
    },

    async updateFinancesTarget() {
      const { data } = await this.$http.post("/_/updatefinancestarget", {
        amount: Math.round(this.tempTotalMonthlyBudget * 100)
      });
      if (data.success) {
        this.fetchFinancesTarget();
      } else {
        console.error("Error while updating finances target");
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
    }
  }
};
</script>
<style lang="scss" scoped>
.round-avatar {
  border-radius: 50% !important;
}
</style>
