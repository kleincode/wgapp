<template>
  <v-dialog
    v-model="dialogShown"
    max-width="720px"
    :fullscreen="$vuetify.breakpoint.smAndDown"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        :color="$vuetify.theme.dark ? 'primary lighten-2' : 'primary'"
        dark
        text
        class="mb-2"
        v-on="on"
        >{{ $t("finances.newExpense") }}</v-btn
      >
    </template>
    <v-form
      ref="form"
      v-model="formValid"
      style="height: 100%"
      @submit.prevent="save"
    >
      <v-card :loading="loading" style="height: 100%">
        <v-card-title>
          <v-btn
            v-if="$vuetify.breakpoint.smAndDown"
            icon
            dark
            class="mt-0 mr-1"
            @click="reset"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <span class="headline">{{
            editMode ? $t("finances.expense.edit") : $t("finances.expense.new")
          }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" lg="8">
                <v-text-field
                  ref="description"
                  v-model="value.description"
                  :label="$t('finances.expense.description')"
                  outlined
                  counter="160"
                  maxlength="160"
                  :rules="descriptionRules"
                  @input="updateValue()"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" lg="4">
                <v-text-field
                  ref="amount"
                  v-model="amount"
                  v-currency="{
                    currency: currency,
                    locale: locale
                  }"
                  :label="$t('finances.amount')"
                  outlined
                  step=".01"
                  :rules="amountRules"
                  @input="updateValue()"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <div
          :class="$vuetify.breakpoint.smAndDown ? 'white elevation-6' : ''"
          :style="
            $vuetify.breakpoint.smAndDown
              ? 'position: fixed; left: 0; bottom: 0; right: 0;'
              : ''
          "
        >
          <v-divider
            :class="$vuetify.breakpoint.smAndDown ? 'secondary' : ''"
          ></v-divider>
          <v-card-actions
            :class="$vuetify.breakpoint.smAndDown ? 'secondary' : ''"
          >
            <v-checkbox
              v-if="!editMode"
              v-model="addReceipt"
              :label="$t('finances.expense.addReceipt')"
              class="ma-0"
            ></v-checkbox>
            <v-spacer></v-spacer>
            <v-btn color="error" text @click="reset">{{
              $t("commands.cancel")
            }}</v-btn>
            <v-btn color="success" text type="submit" :disabled="!formValid">{{
              $t("commands.save")
            }}</v-btn>
          </v-card-actions>
        </div>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { CurrencyDirective, parseCurrency, setValue } from "vue-currency-input";
export default {
  name: "EditExpenseDialog",
  directives: {
    currency: CurrencyDirective
  },
  props: {
    value: {
      type: Object,
      default: () => ({
        description: "",
        amount: ""
      })
    }
  },
  data: () => ({
    amount: "",
    dialogShown: false,
    formValid: null,
    loading: false,
    editMode: false,
    editId: null,
    addReceipt: false
  }),
  computed: {
    amountNumber() {
      return parseCurrency(this.amount, {
        locale: this.locale,
        currency: this.currency
      });
    },
    locale() {
      return this.$store.state.userSettings.locale || navigator.language;
    },
    currency() {
      return this.$store.state.userSettings.currency;
    },
    descriptionRules() {
      return [
        v => !!v || this.$t("finances.editMonthlyCharges.rules.provideName"),
        v =>
          (!!v && v.length <= 160) ||
          this.$t("finances.editMonthlyCharges.rules.nameTooLong")
      ];
    },
    amountRules() {
      return [
        v => !!v || this.$t("finances.editMonthlyCharges.rules.provideAmount"),
        () => {
          if (isNaN(this.amountNumber))
            return this.$t("finances.editMonthlyCharges.rules.amountInvalid");
          else if (this.amountNumber < 0)
            return this.$t("finances.editMonthlyCharges.rules.negativeAmount");
          else if (Math.abs(this.amountNumber) < 0.01)
            return this.$t("finances.editMonthlyCharges.rules.amountIsZero");
          else return true;
        }
      ];
    }
  },
  watch: {
    dialogShown(val) {
      if (val) {
        let amount;
        if (this.editMode) {
          amount = this.value.amount;
        } else {
          amount = 5;
        }
        this.$nextTick(() => setValue(this.$refs.amount.$refs.input, amount));
      }
    }
  },
  methods: {
    updateValue(val) {
      this.$emit("input", val || this.value);
    },
    async commitNewExpense(expenseData) {
      const { data } = await this.$http.post("/_/addexpense", {
        description: expenseData.description,
        amount: Math.round(this.amountNumber * 100)
      });
      return data;
    },
    async commitEditExpense(expenseData) {
      const { data } = await this.$http.post("/_/editexpense", {
        description: expenseData.description,
        amount: Math.round(this.amountNumber * 100),
        id: expenseData.fid
      });
      return data;
    },
    async save() {
      if (!this.formValid) return;
      this.loading = true;
      try {
        let data = await (this.editMode
          ? this.commitEditExpense
          : this.commitNewExpense)(this.value);
        this.loading = false;
        if (data.success) {
          this.$store.dispatch(
            "showSnackbar",
            this.editMode
              ? this.$t("finances.expense.updated")
              : this.$t("finances.expense.added")
          );
          // Item committed, open receipt dialog with new item data if 'add receipt' was checked
          this.$emit(
            "committed",
            !this.editMode && this.addReceipt ? data.item : null
          );
          this.reset();
        } else this.$store.dispatch("showSnackbar", data.message);
      } catch (err) {
        this.loading = false;
        this.$store.dispatch(
          "showSnackbar",
          this.$t("general.errors.communication")
        );
        console.error(err);
      }
    },
    reset() {
      this.dialogShown = false;
      this.updateValue({
        description: "",
        amount: 0
      });
      this.$refs.form.resetValidation();
      this.editMode = false;
      this.addReceipt = false;
    },
    startEdit(itemData) {
      this.editMode = true;
      this.updateValue({
        description: itemData.description,
        fid: itemData.fid,
        amount: (itemData.amount / 100).toString()
      });
      this.dialogShown = true;
    }
  }
};
</script>
