<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ on }">
      <v-btn color="primary" block v-on="on">{{
        $t("finances.openBillManager")
      }}</v-btn>
    </template>
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="dialog = false">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>{{
          $t("finances.billManager.title")
        }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items style="max-width: 50%;">
          <span
            class="ma-auto"
            style="white-space: nowrap; text-overflow: ellipsis; overflow: hidden;"
            >{{ $t("finances.lastBill") }}:
            {{ formatDateRelative(lastBill) }}</span
          >
        </v-toolbar-items>
      </v-toolbar>
      <confirm-dialog
        v-model="finishPaymentDialog"
        @positive="finishPayments"
        @negative="finishPaymentDialog = false"
        >{{ $t("finances.billManager.confirmFinishPayments") }}</confirm-dialog
      >
      <v-container style="padding-bottom: 100px;">
        <v-row>
          <v-col
            cols="12"
            lg="4"
            xl="3"
            :order="$vuetify.breakpoint.smAndDown ? 3 : 1"
          >
            <v-card style="height: 100%" :loading="loadingHistory">
              <v-card-title
                ><h1 class="headline">
                  {{ $t("finances.billManager.billHistory") }}
                </h1></v-card-title
              >
              <v-card-text>
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">
                          {{ $t("finances.billManager.from") }}
                        </th>
                        <th class="text-left">
                          {{ $t("finances.billManager.to") }}
                        </th>
                        <th class="text-left">
                          {{ $t("finances.billManager.export") }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="bill in billhistory" :key="bill.id">
                        <td>
                          {{
                            new Date(bill.min).toLocaleDateString(
                              $store.state.userSettings.locale || undefined
                            )
                          }}
                        </td>
                        <td>
                          {{
                            new Date(bill.max).toLocaleDateString(
                              $store.state.userSettings.locale || undefined
                            )
                          }}
                        </td>
                        <td>
                          <v-btn
                            icon
                            @click="
                              exportHTMLBill(bill.min, bill.max, bill.data)
                            "
                            ><v-icon>language</v-icon></v-btn
                          >
                          <v-btn
                            icon
                            @click="
                              exportXLSXBill(bill.min, bill.max, bill.data)
                            "
                            ><v-icon>table_chart</v-icon></v-btn
                          >
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="1" class="text-center d-none d-lg-block" :order="2">
            <v-divider vertical></v-divider>
          </v-col>
          <v-col
            cols="12"
            lg="7"
            xl="8"
            :order="$vuetify.breakpoint.smAndDown ? 1 : 3"
          >
            <v-card :loading="loading" style="height: 100%">
              <v-card-title class="headline">{{
                $t("finances.billManager.newBill")
              }}</v-card-title>
              <v-card-text>
                <p v-if="empty" class="text-center headline pt-12 pb-12">
                  {{ $t("finances.billManager.noExpensesAvailable") }}
                </p>
                <v-row v-if="!empty">
                  <v-col cols="12" md="4">
                    <v-card :elevation="6" color="accent">
                      <v-list three-line avatar color="info" dark>
                        <v-subheader>{{ $t("general.members") }}</v-subheader>
                        <template v-for="(member, index) in memberTotals">
                          <v-divider :key="index"></v-divider>
                          <v-list-item
                            :key="'finmem-' + member.id + index"
                            three-line
                            :value="member.id"
                            class="text-center"
                          >
                            <v-list-item-content>
                              <v-list-item-title>
                                {{ getFullUserName(member.id) }}
                              </v-list-item-title>
                              <v-list-item-subtitle>
                                {{
                                  getCurrency(
                                    (memberDebt(member.total) / 100).toFixed(2)
                                  )
                                }}
                              </v-list-item-subtitle>
                              <v-progress-linear
                                :value="memberProgress(member.total)"
                                color="transparent"
                                style="max-width: 50%"
                                :background-color="
                                  negativeMember(member.total)
                                    ? 'red'
                                    : 'transparent'
                                "
                              ></v-progress-linear>
                              <v-progress-linear
                                :value="memberProgress(member.total)"
                                :color="
                                  negativeMember(member.total)
                                    ? 'transparent'
                                    : 'primary'
                                "
                                style="max-width: 50%"
                              ></v-progress-linear>
                            </v-list-item-content>
                          </v-list-item>
                        </template>
                        <v-divider></v-divider>
                      </v-list>
                    </v-card>
                  </v-col>
                  <v-col cols="12" md="8">
                    <v-row>
                      <v-col
                        v-if="includeMonthlyCharges"
                        cols="12"
                        md="4"
                        class="text-center"
                      >
                        <div class="overline">
                          {{ $t("finances.billManager.monthlyTotal") }}
                        </div>
                        <div class="display-1">
                          {{ getCurrency(monthlyTotal) }}
                        </div>
                      </v-col>
                      <v-col
                        cols="12"
                        :md="includeMonthlyCharges ? '4' : '6'"
                        class="text-center primary--text"
                      >
                        <div class="overline">
                          {{ $t("finances.billManager.total") }}
                        </div>
                        <div class="display-1">{{ getCurrency(total) }}</div>
                      </v-col>
                      <v-col
                        cols="12"
                        :md="includeMonthlyCharges ? '4' : '6'"
                        class="text-center"
                      >
                        <div class="overline">
                          {{ $t("finances.billManager.perPerson") }}
                        </div>
                        <div class="display-1">{{ getCurrency(mean) }}</div>
                      </v-col>
                    </v-row>
                    <h2 class="headline mt-4 mb-2 info--text" color="info">
                      <v-icon left large>payment</v-icon>
                      {{ $t("finances.compensationPayments") }}:
                    </h2>
                    <v-simple-table :loading="loading">
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th class="text-left">
                              {{ $t("finances.billManager.paying") }}
                            </th>
                            <th class="text-left">
                              {{ $t("finances.billManager.receives") }}
                            </th>
                            <th class="text-left">
                              {{ $t("finances.billManager.amount") }}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(debt, i) in debts" :key="i">
                            <td>{{ getFullUserName(debt.paying) }}</td>
                            <td>{{ getFullUserName(debt.receiving) }}</td>
                            <td>{{ getCurrency(debt.amount) }}</td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-col>
                </v-row>
              </v-card-text>

              <v-divider></v-divider>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <div
        class="white elevation-6"
        style="position: fixed; left: 0; bottom: 0; right: 0;"
      >
        <v-divider class="secondary"></v-divider>
        <v-card-actions class="secondary">
          <v-switch
            v-model="includeMonthlyCharges"
            class="pl-2"
            :label="$t('finances.billManager.includeMonthlyCharges')"
            dark
            @change="splitTotals"
          ></v-switch>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="exportCurrentBillHTML"
            ><v-icon>language</v-icon></v-btn
          >
          <v-btn icon dark @click="exportCurrentBillXLSX"
            ><v-icon>table_chart</v-icon></v-btn
          >
          <v-btn text dark @click="dialog = false">
            {{ $t("commands.back") }}
          </v-btn>
          <v-btn
            dark
            color="success"
            class="mr-2"
            text
            :disabled="empty"
            @click="finishPaymentDialog = true"
          >
            {{ $t("finances.billManager.savePayments") }}
          </v-btn>
        </v-card-actions>
      </div>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapGetters } from "vuex";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog.vue";

import { exportToHTML } from "@/assets/exportToHTML.js";
import { exportXLSX } from "@/assets/exportToXLSX.js";
import { getMonthlyFac } from "@/assets/billingCalculator.js";

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
    lastBill: new Date(),
    debts: [],
    empty: true,
    loading: false,
    loadingHistory: false,
    finishPaymentDialog: false,
    includeMonthlyCharges: false,
    billhistory: [],
    dialog: false
  }),
  computed: {
    ...mapGetters(["getFullUserName", "getUserInitials"]),
    ...mapGetters("userSettings", ["formatDateRelative"]),
    memberTotals() {
      let totals = JSON.parse(JSON.stringify(this.singleMemberTotals));
      if (this.includeMonthlyCharges) {
        this.monthlyData.forEach(monEntry => {
          totals.forEach(entry => {
            if (monEntry.id == entry.id) {
              entry.total += Math.round(
                getMonthlyFac(this.lastBill, new Date()) * monEntry.total
              );
            }
          });
        });
      }
      totals.sort((a, b) => b.total - a.total);
      return totals;
    },
    monthlyTotal() {
      let sum = 0;
      this.monthlyData.forEach(monEntry => {
        sum +=
          Math.round(
            getMonthlyFac(this.lastBill, new Date()) * monEntry.total
          ) / 100;
      });
      return sum;
    }
  },
  watch: {
    dialog(val) {
      if (val) {
        this.fetchNewBill();
        this.fetchBillhistory();
      }
    }
  },
  methods: {
    async fetchNewBill() {
      this.loading = true;
      try {
        const { data } = await this.$http.get("/_/fetchnewbill");
        const { data: members } = await this.$http.get("/_/fetchhousehold");
        if (data.success) {
          this.singleMemberTotals = [];
          this.memberMap = {};
          this.monthlyData = [];
          this.lastBill = new Date(data.lastBill);
          if (data.mainResult.length == 0 && this.isToday(this.lastBill)) {
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
              if (m.id == member.id) {
                contains = true;
              }
            });
            if (!contains) {
              this.singleMemberTotals.push({
                id: member.id,
                total: 0
              });
              this.memberMap[member.id] = 0;
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
            this.$t("finances.billManager.errors.fetchBillDataFailed")
          );
        }
      } catch (err) {
        this.$store.dispatch(
          "showSnackbar",
          this.$t("finances.billManager.errors.fetchBillDataError")
        );
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

    negativeMember(total) {
      return total < this.mean * 100;
    },

    memberDebt(total) {
      return total - this.mean * 100;
    },

    memberProgress(total) {
      total = total / 100;
      const max = this.memberTotals[0].total / 100,
        mean = this.mean;
      if (total >= mean) {
        //+
        return (100 * (total - mean)) / (max - mean);
      } else {
        //-
        return 100 - Math.abs(100 * (total - mean)) / (max - mean);
      }
    },

    exportCurrentBillHTML() {
      exportToHTML(
        this.lastBill.toLocaleDateString(
          this.$store.state.userSettings.locale || undefined
        ),
        new Date().toLocaleDateString(
          this.$store.state.userSettings.locale || undefined
        ),
        this.$store.state.userSettings.currency,
        this.$store.state.userSettings.locale,
        this.curToJSON()
      );
    },

    exportCurrentBillXLSX() {
      exportXLSX(
        this.lastBill.toLocaleDateString(
          this.$store.state.userSettings.locale || undefined
        ),
        new Date().toLocaleDateString(
          this.$store.state.userSettings.locale || undefined
        ),
        this.$store.state.userSettings.currency,
        this.$store.state.userSettings.locale,
        this.curToJSON()
      );
    },

    exportHTMLBill(min, max, data) {
      exportToHTML(
        new Date(min).toLocaleDateString(
          this.$store.state.userSettings.locale || undefined
        ),
        new Date(max).toLocaleDateString(
          this.$store.state.userSettings.locale || undefined
        ),
        this.$store.state.userSettings.currency,
        this.$store.state.userSettings.locale,
        data
      );
    },

    exportXLSXBill(min, max, data) {
      exportXLSX(
        new Date(min).toLocaleDateString(
          this.$store.state.userSettings.locale || undefined
        ),
        new Date(max).toLocaleDateString(
          this.$store.state.userSettings.locale || undefined
        ),
        this.$store.state.userSettings.currency,
        this.$store.state.userSettings.locale,
        data
      );
    },

    curToJSON() {
      let data = {};
      data.total = this.total;
      data.includeMonthlyCharges = this.includeMonthlyCharges;
      data.monthlyTotal = this.monthlyTotal;
      data.mean = this.mean;
      data.memberTotals = [];
      data.memberDebts = [];
      this.memberTotals.forEach(member => {
        data.memberTotals.push({
          name: member.id,
          total: Math.round(100 * member.total) / 100
        });
        data.memberDebts.push({
          name: member.id,
          total: Math.round(100 * this.memberDebt(member.total)) / 100
        });
      });
      data.debts = [];
      this.debts.forEach(debt => {
        data.debts.push({
          paying: debt.paying,
          receiving: debt.receiving,
          amount: debt.amount
        });
      });
      return data;
    },

    async finishPayments() {
      this.loading = true;
      const { data } = await this.$http.post("/_/updatelastbill", {
        min: this.lastBill.getTime(),
        max: Date.now(),
        data: this.curToJSON()
      });
      if (data.success) {
        this.$store.dispatch(
          "showSnackbar",
          this.$t("finances.billManager.updated")
        );
      } else {
        this.$store.dispatch(
          "showSnackbar",
          this.$t("finances.billManager.errors.updateLastBillError")
        );
      }
      this.loadingHistory = false;
      this.finishPaymentDialog = false;
      this.dialog = false;
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
            this.$t("finances.billManager.errors.fetchHistoryFailed")
          );
        }
      } catch (err) {
        this.loadingHistory = false;
        this.$store.dispatch(
          "showSnackbar",
          this.$t("finances.billManager.errors.fetchHistoryError")
        );
        console.error(err);
      }
    },

    splitTotals() {
      let totals = JSON.parse(JSON.stringify(this.memberMap));
      //optionally add monthly charges
      if (this.includeMonthlyCharges) {
        let curTimestamp = Math.floor(Date.now() / 60000); //in minutes
        let lastBill = Math.floor(this.lastBill.getTime() / 60000);
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
