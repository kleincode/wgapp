<template>
  <v-dialog v-model="dialogShown" max-width="720px">
    <template v-slot:activator="{ on }">
      <v-btn color="primary" dark text class="mb-2" v-on="on"
        >New expense</v-btn
      >
    </template>
    <v-form ref="form" v-model="formValid" @submit.prevent="save">
      <v-card :loading="loading">
        <v-card-title>
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
                  v-model="value.amount"
                  :label="$t('finances.amount')"
                  outlined
                  type="number"
                  step=".01"
                  prefix="€"
                  :rules="amountRules"
                  @input="updateValue()"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-checkbox
            v-if="!editMode"
            v-model="addReceipt"
            :label="$t('finances.expense.addReceipt')"
            class="ma-0"
          ></v-checkbox>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="reset">{{
            $t("commands.cancel")
          }}</v-btn>
          <v-btn color="green" text type="submit" :disabled="!formValid">{{
            $t("commands.save")
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
export default {
  name: "EditExpenseDialog",
  props: {
    value: {
      type: Object,
      default: () => ({
        description: "",
        amount: 0
      })
    }
  },
  data: () => ({
    dialogShown: false,
    formValid: null,
    loading: false,
    editMode: false,
    editId: null,
    addReceipt: false
  }),
  computed: {
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
        v => {
          let num = parseFloat(v);
          if (isNaN(num))
            return this.$t("finances.editMonthlyCharges.rules.amountInvalid");
          else if (num < 0)
            return this.$t("finances.editMonthlyCharges.rules.negativeAmount");
          else if (Math.abs(num) < 0.01)
            return this.$t("finances.editMonthlyCharges.rules.amountIsZero");
          else return true;
        }
      ];
    }
  },
  methods: {
    updateValue(val) {
      this.$emit("input", val || this.value);
    },
    async commitNewExpense(expenseData) {
      const { data } = await this.$http.post("/_/addexpense", {
        description: expenseData.description,
        amount: Math.round(parseFloat(expenseData.amount) * 100)
      });
      return data;
    },
    async commitEditExpense(expenseData) {
      const { data } = await this.$http.post("/_/editexpense", {
        description: expenseData.description,
        amount: Math.round(parseFloat(expenseData.amount) * 100),
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
