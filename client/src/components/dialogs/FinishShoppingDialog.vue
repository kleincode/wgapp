<template>
  <v-dialog v-model="dialogShown" max-width="400px">
    <template v-slot:activator="{ on }">
      <v-btn
        :disabled="remainingTasks > 0 || completedTasks == 0"
        color="primary"
        block
        v-on="on"
        @click="openDialog"
        >Transfer to finances</v-btn
      >
    </template>
    <v-card :loading="loading">
      <v-card-title>
        <span class="headline">
          Add expense
        </span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <p>
            Add a new expense corresponding to this shopping list.
          </p>
          <v-text-field v-model="name"></v-text-field>
          <v-text-field
            v-model="amount"
            append-icon="euro"
            type="number"
            step="0.01"
          ></v-text-field>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="close">close</v-btn>
        <v-btn color="primary" text :disabled="amount == 0" @click="save"
          >Save</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "EditExpenseDialog",
  props: {
    value: {
      type: Object,
      default: () => ({
        name: ""
      })
    },
    remainingTasks: {
      type: Number,
      default: () => 0
    },
    completedTasks: {
      type: Number,
      default: () => 0
    }
  },
  data: () => ({
    dialogShown: false,
    amount: 0.0,
    name: "",
    loading: false
  }),
  methods: {
    openDialog() {
      this.amount = 0.0;
      this.name = this.value.name;
      this.dialogShown = true;
    },
    async save() {
      this.loading = true;
      await this.commitNewExpense();
      this.dialogShown = false;
      this.loading = false;
    },

    close() {
      this.dialogShown = false;
    },
    async commitNewExpense() {
      try {
        const { data } = await this.$http.post("/_/addexpense", {
          description: this.value.name,
          amount: Math.floor(parseFloat(this.amount) * 100)
        });
        if (data.success) {
          this.$store.dispatch(
            "showSnackbar",
            "Successfully added new shopping expense."
          );
        } else {
          this.$store.dispatch(
            "showSnackbar",
            "Couldn't add expense to database. Please try again later."
          );
        }
      } catch (err) {
        console.error(err);
        this.$store.dispatch(
          "showSnackbar",
          "Error during adding expense to database. Please try again later."
        );
      }
    }
  }
};
</script>
