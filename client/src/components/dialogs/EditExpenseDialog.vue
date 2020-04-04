<template>
  <v-dialog v-model="dialogShown" max-width="720px">
    <template v-slot:activator="{ on }">
      <v-btn color="primary" dark text class="mb-2" v-on="on">New expense</v-btn>
    </template>
    <v-form v-model="formValid" @submit.prevent="save" ref="form">
      <v-card :loading="loading">
        <v-card-title>
          <span class="headline">{{ editMode ? "Edit expense" : "New expense" }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" lg="8">
                <v-text-field
                  v-model="value.description"
                  label="Description"
                  ref="description"
                  outlined
                  @input="updateValue()"
                  counter="160"
                  maxlength="160"
                  :rules="descriptionRules"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" lg="4">
                <v-text-field
                  v-model="value.amount"
                  label="Amount"
                  ref="amount"
                  outlined
                  type="number"
                  step=".01"
                  prefix="€"
                  @input="updateValue()"
                  :rules="amountRules"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="reset">Cancel</v-btn>
          <v-btn color="blue darken-1" text type="submit" :disabled="!formValid">Save</v-btn>
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
    descriptionRules: [
      v => !!v || "Please provide an expense description!",
      v => (!!v && v.length <= 160) || "Description is too long."
    ],
    amountRules: [
      v => !!v || "Please provide an amount!",
      v => {
        let num = parseFloat(v);
        if (isNaN(num)) return "Please provide a valid amount.";
        else if (num < 0) return "Negative amounts are not permitted";
        else if (Math.abs(num) < 0.01)
          return "Please provide a non-zero number.";
        else return true;
      }
    ],
    loading: false,
    editMode: false,
    editId: null
  }),
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
        let data = await (this.editMode ? this.commitEditExpense : this.commitNewExpense)(this.value);
        this.loading = false;
        if (data.success) {
          this.$store.dispatch("showSnackbar", this.editMode ? "Expense updated successfully." : "Expense added successfully.");
          this.$emit("committed");
          this.reset();
        } else this.$store.dispatch("showSnackbar", data.message);
      } catch (err) {
        this.loading = false;
        this.$store.dispatch(
          "showSnackbar",
          "Communication error. Please try again later."
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
