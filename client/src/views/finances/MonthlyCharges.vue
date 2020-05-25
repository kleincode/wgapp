<template>
  <div>
    <v-card
      style="height: 100%"
      :loading="loadingMonthlyCharges"
      :elevation="6"
    >
      <v-card-title>
        {{ $t("finances.monthlyCharges") }}
        <v-spacer></v-spacer>
        <v-btn
          icon
          :color="monCharEditMode ? 'primary' : ''"
          @click="monCharEditMode = !monCharEditMode"
          ><v-icon>edit</v-icon></v-btn
        >
        <EditMonthlyChargesDialog
          ref="editMonthlyChargesDialog"
          v-model="editMonthlyCharges"
          @committed="fetchMonthlyData"
        ></EditMonthlyChargesDialog>
      </v-card-title>
      <v-card-text>
        {{ $t("finances.monthlyChargesExplanation") }}
        <v-list v-if="monthlyCharges.length > 0">
          <v-list-item v-for="(charge, i) in monthlyCharges" :key="i">
            <v-list-item-icon>
              <v-icon>{{ getIcon(charge.icon) }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ charge.name }}</v-list-item-title>
              <v-list-item-subtitle
                >{{ $t("finances.payedBy") }}:
                {{ charge.responsibleUser }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-icon>
              {{ getCurrency(charge.amount) }}
              <v-slide-x-reverse-transition>
                <div v-show="monCharEditMode">
                  <v-btn
                    small
                    icon
                    class="ml-2"
                    @click="editMonChargeItem(charge)"
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
        <div
          v-else
          style="text-align: center"
          class="text--disabled pb-12 pt-8 pl-3 pr-3"
        >
          <v-icon style="font-size: 6em" class="text--disabled">event</v-icon>
          <br />{{ $t("finances.empty.monthlyCharges") }}
        </div>
      </v-card-text>
    </v-card>
    <confirm-dialog
      v-model="deleteDialogVisible"
      :loading="deleteDialogLoading"
      @positive="deleteConfirm"
      @negative="deleteDialogVisible = false"
    >
      {{ $t("finances.confirmDeleteItem", { item: deleteDescription }) }}
    </confirm-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import icons from "@/assets/icons.js";

import EditMonthlyChargesDialog from "@/components/dialogs/EditMonthlyChargesDialog.vue";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog.vue";

export default {
  name: "MonthlyCharges",
  components: {
    EditMonthlyChargesDialog,
    ConfirmDialog
  },
  data: () => ({
    deleteDialogVisible: false,
    deleteId: -1,
    deleteDescription: "",
    deleteDialogLoading: false,

    monthlyCharges: [],
    monCharEditMode: false,
    editMonthlyCharges: {
      name: "",
      icon: 0,
      amount: 0,
      uid: 0
    },
    loadingMonthlyCharges: false
  }),
  computed: {
    ...mapGetters(["getUserName"])
  },
  mounted() {
    this.fetchMonthlyData();
  },
  methods: {
    deleteMonthlyCharge(item) {
      this.deleteId = item.id;
      this.deleteDescription = item.name;
      this.deleteDialogVisible = true;
      this.monCharEditMode = false;
    },
    editMonChargeItem(item) {
      this.monCharEditMode = false;
      this.$refs.editMonthlyChargesDialog.startEdit(item);
    },
    async deleteConfirm() {
      this.deleteDialogLoading = true;
      try {
        let data = await this.commitDelete(this.deleteId);
        this.deleteDialogLoading = false;
        if (data.success) {
          this.deleteDialogVisible = false;
          this.$store.dispatch("showSnackbar", "Item deleted.");
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
    async commitDelete(fid) {
      const { data } = await this.$http.post("/_/deletemonthlycharge", {
        id: fid
      });
      return data;
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
    //HELPER
    getIcon(id) {
      return icons[id];
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
