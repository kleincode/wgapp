<template>
  <v-dialog
    v-model="dialogShown"
    max-width="400px"
    :fullscreen="$vuetify.breakpoint.smAndDown"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        :disabled="remainingTasks > 0 || completedTasks == 0"
        color="primary"
        block
        v-on="on"
        @click="openDialog"
        >{{ $t("shopping.expense.transfer") }}</v-btn
      >
    </template>
    <v-card :loading="loading" style="height: 100%">
      <v-card-title>
        <v-btn
          v-if="$vuetify.breakpoint.smAndDown"
          icon
          dark
          class="mt-0 mr-1"
          @click="close"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <span class="headline">
          {{ $t("shopping.expense.add") }}
        </span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <p>
            {{ $t("shopping.expense.addDescription") }}
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
          <v-spacer></v-spacer>
          <v-btn text @click="close">{{ $t("commands.close") }}</v-btn>
          <v-btn color="success" text :disabled="amount == 0" @click="save">{{
            $t("commands.save")
          }}</v-btn>
        </v-card-actions>
      </div>
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
            this.$t("shopping.expense.addSuccess")
          );
        } else {
          this.$store.dispatch(
            "showSnackbar",
            this.$t("shopping.expense.addFail")
          );
        }
      } catch (err) {
        console.error(err);
        this.$store.dispatch(
          "showSnackbar",
          this.$t("shopping.expense.addError")
        );
      }
    }
  }
};
</script>
