<template>
  <v-dialog v-model="dialogShown" max-width="720px">
    <template v-slot:activator="{ on }">
      <v-btn icon v-on="on"><v-icon>add</v-icon></v-btn>
    </template>
    <v-form ref="form" v-model="formValid" @submit.prevent="save">
      <v-card :loading="loading">
        <v-card-title>
          <span class="headline">{{
            editMode
              ? $t("finances.editMonthlyCharges.editMonthlyCharge")
              : $t("finances.editMonthlyCharges.newMonthlyCharge")
          }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" style="text-align: center">
                <v-icon style="font-size: 10em" class="mb-3">{{
                  getIcon(value.icon)
                }}</v-icon>
                <br />
                <IconChooser
                  v-model="selectedIcon"
                  @ok="newIconSelected"
                  @cancel="noNewIconSelected"
                ></IconChooser>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  ref="name"
                  v-model="value.name"
                  :label="$t('finances.name')"
                  outlined
                  counter="160"
                  maxlength="160"
                  :rules="nameRules"
                  @input="updateValue()"
                ></v-text-field>
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
                <v-switch
                  v-model="value.all"
                  class="mt-n4"
                  :label="$t('finances.payedByAll')"
                ></v-switch>
                <v-select
                  v-model="value.uid"
                  outlined
                  :items="getHouseholdUsersAsItemList"
                  item-value="value"
                  :label="$t('finances.payedBy')"
                  :disabled="value.all"
                  :rules="
                    !value.all
                      ? [
                          v =>
                            !!v ||
                            $t(
                              'finances.editMonthlyCharges.specifyPayingMember'
                            )
                        ]
                      : []
                  "
                >
                </v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="reset">{{ $t("commands.cancel") }}</v-btn>
          <v-btn color="primary" text type="submit" :disabled="!formValid">{{
            $t("commands.save")
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import IconChooser from "@/components/IconChooser.vue";
import icons from "@/assets/icons.js";
import { mapGetters } from "vuex";

export default {
  name: "EditmonchargeDialog",
  components: {
    IconChooser
  },
  props: {
    value: {
      type: Object,
      default: () => ({
        name: "",
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
    selectedIcon: 0
  }),
  computed: {
    nameRules() {
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
    },
    ...mapGetters(["getHouseholdUsersAsItemList"])
  },
  methods: {
    updateValue(val) {
      this.$emit("input", val || this.value);
    },
    async commitNewMonCharge(monchargeData) {
      let uid;
      if (monchargeData.all) {
        uid = -1;
      } else {
        uid = monchargeData.uid;
      }
      const { data } = await this.$http.post("/_/addmonthlycharge", {
        name: monchargeData.name,
        amount: Math.round(monchargeData.amount * 100),
        uid: uid,
        icon: monchargeData.icon
      });
      return data;
    },
    async commitEditMonCharge(monchargeData) {
      const { data } = await this.$http.post("/_/editmonthlycharge", {
        id: monchargeData.id,
        name: monchargeData.name,
        amount: Math.round(parseFloat(monchargeData.amount) * 100),
        uid: monchargeData.uid,
        icon: monchargeData.icon
      });
      return data;
    },
    async save() {
      if (!this.formValid) return;
      this.loading = true;
      try {
        let data = await (this.editMode
          ? this.commitEditMonCharge
          : this.commitNewMonCharge)(this.value);
        this.loading = false;
        if (data.success) {
          this.$store.dispatch(
            "showSnackbar",
            this.editMode
              ? this.$t("finances.editMonthlyCharges.updated")
              : this.$t("finances.editMonthlyCharges.added")
          );
          this.$emit("committed");
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
        name: "",
        amount: 0,
        icon: 0,
        uid: 0,
        all: true
      });
      this.$refs.form.resetValidation();
      this.editMode = false;
    },
    startEdit(itemData) {
      this.editMode = true;
      this.updateValue({
        name: itemData.name,
        id: itemData.id,
        amount: itemData.amount.toString(),
        icon: itemData.icon,
        uid: itemData.uid,
        all: itemData.all
      });
      this.selectedIcon = itemData.icon;
      this.dialogShown = true;
    },

    newIconSelected(id) {
      this.value.icon = id;
      this.selectedIcon = id;
    },
    noNewIconSelected() {
      this.selectedIcon = this.value.icon;
    },
    getIcon(id) {
      return icons[id];
    }
  }
};
</script>
