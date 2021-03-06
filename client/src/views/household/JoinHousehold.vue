<template>
  <div class="md-layout md-gutter md-alignment-center-center fill-view">
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="6" xl="4">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>{{ $t("joinHousehold.title") }}</v-toolbar-title>
            </v-toolbar>
            <v-stepper v-model="stepperProgress" vertical>
              <!-- Step 1 -->
              <v-stepper-step :complete="stepperProgress > 1" step="1">
                {{ $t("joinHousehold.credentials") }}
                <small v-if="autoFill > 0">{{
                  autoFill == 1
                    ? $t("joinHousehold.partialAutofill")
                    : $t("joinHousehold.autoFill")
                }}</small>
              </v-stepper-step>
              <v-stepper-content step="1">
                <p v-if="autoFill == 0">
                  {{ $t("joinHousehold.enterHouseholdCredentials") }}
                </p>
                <v-form ref="form" class="mt-2" @submit.prevent="step1Submit">
                  <v-text-field
                    v-model="householdId"
                    :label="$t('joinHousehold.householdId')"
                    prepend-icon="home"
                    type="text"
                    outlined
                    :rules="validating ? householdIdRules : []"
                  />
                  <v-text-field
                    v-model="securityCode"
                    :label="$t('joinHousehold.securityCode')"
                    prepend-icon="vpn_key"
                    type="text"
                    outlined
                    :rules="validating ? securityCodeRules : []"
                  />
                  <v-btn color="primary" type="submit" :loading="loading">
                    {{ $t("commands.continue") }}
                  </v-btn>
                </v-form>
              </v-stepper-content>
              <!-- Step 2 -->
              <v-stepper-step :complete="stepperProgress > 2" step="2">
                {{ $t("commands.confirm") }}
              </v-stepper-step>
              <v-stepper-content step="2">
                <p v-if="oldHousehold">
                  {{ $t("joinHousehold.moveOutConfirm") }}
                </p>
                <v-card
                  v-if="oldHousehold"
                  outlined
                  color="secondary"
                  class="mb-4"
                >
                  <v-card-title class="pb-0">
                    {{ oldHousehold.name }}
                  </v-card-title>
                  <v-card-text>
                    {{ householdTypes[oldHousehold.type] }}<br />
                    {{ $t("joinHousehold.created") }}:
                    {{ formatDate(oldHousehold.registered) }}
                  </v-card-text>
                </v-card>
                <p v-if="!oldHousehold">
                  {{ $t("joinHousehold.moveInConfirm") }}
                </p>
                <p v-if="oldHousehold">
                  {{ $t("joinHousehold.andInsteadMoveInto") }}
                </p>
                <v-card color="primary" class="mb-4">
                  <v-card-title class="pb-0">
                    {{ newHousehold.name }}
                  </v-card-title>
                  <v-card-text>
                    {{ householdTypes[newHousehold.type] }}<br />
                    {{ $t("joinHousehold.created") }}:
                    {{ formatDate(newHousehold.registered) }}
                  </v-card-text>
                </v-card>
                <v-btn color="primary" :loading="loading" @click="step2Submit">
                  <v-icon left>arrow_forward</v-icon>
                  {{ $t("joinHousehold.movein") }}
                </v-btn>
              </v-stepper-content>
              <v-stepper-step step="3">{{
                $t("commands.finish")
              }}</v-stepper-step>

              <v-stepper-content step="3">
                <i18n path="joinHousehold.congratulations" tag="p">
                  <template #name>
                    <b>{{ newHousehold.name }}</b>
                  </template>
                </i18n>
                <v-btn color="primary" @click="finish">
                  <v-icon left>dashboard</v-icon>
                  {{ $t("joinHousehold.goToDashboard") }}</v-btn
                >
              </v-stepper-content>
            </v-stepper>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-snackbar v-model="showSnackbar" :timeout="4000">
      <span>{{ snackbarMessage }}</span>
      <v-btn text small color="red" @click="showSnackbar = false">{{
        $t("commands.close")
      }}</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: "JoinHousehold",
  data: () => ({
    householdId: "",
    securityCode: "",
    loading: false,
    stepperProgress: 1,
    showSnackbar: false,
    snackbarMessage: "",
    validating: false,
    formValid: null,
    autoFill: 0,
    oldHousehold: null,
    newHousehold: {},
    householdTypes: ["Shared apartment", "Couple", "Family"]
  }),
  computed: {
    householdIdRules() {
      return [
        v => !!v || this.$t("joinHousehold.householdIdReq"),
        v =>
          (v && v.length == 32 && /^[A-Z0-9]*$/.test(v)) ||
          this.$t("joinHousehold.invalidFormat")
      ];
    },
    securityCodeRules() {
      return [
        v => !!v || this.$t("joinHousehold.securityCodeRequired"),
        v =>
          (v && v.length == 6 && /^[0-9]*$/.test(v)) ||
          this.$t("joinHousehold.invalidFormat")
      ];
    },
    introductionState: {
      get() {
        return this.$store.state.userSettings.introductionState;
      },
      set(value) {
        this.$store.commit("userSettings/set_key", {
          key: "introductionState",
          value
        });
      }
    }
  },
  mounted() {
    if (this.$route.query.h) {
      this.householdId = this.$route.query.h;
      this.autoFill++;
    }
    if (this.$route.query.s) {
      this.securityCode = this.$route.query.s;
      this.autoFill++;
    }
  },
  methods: {
    alertSnackbar(msg) {
      if (this.showSnackbar) {
        this.showSnackbar = false;
        setTimeout(() => this.alertSnackbar(msg), 500);
      } else {
        this.snackbarMessage = msg;
        this.showSnackbar = true;
      }
    },
    formatDate(strdate) {
      return new Date(strdate).toLocaleString();
    },
    async validate() {
      this.validating = true;
      this.$refs.form.validate();
      await new Promise(resolve => setTimeout(resolve, 100));
      this.formValid = this.$refs.form.validate();
    },
    async step1Submit() {
      await this.validate();
      if (!this.formValid)
        this.alertSnackbar(this.$t("joinHousehold.pleaseCheckInput"));
      else {
        this.loading = true;
        const { data } = await this.$http.post("/_/joinhousehold", {
          hid: this.householdId,
          sec: this.securityCode
        });
        if (data.success) {
          this.oldHousehold = data.oldHousehold || null;
          this.newHousehold = data.household;
          this.stepperProgress = 2;
        } else
          this.alertSnackbar(
            data.message || this.$t("joinHousehold.connectionError")
          );
        this.loading = false;
      }
    },
    async step2Submit() {
      const { data } = await this.$http.post("/_/joinhousehold", {
        hid: this.householdId,
        sec: this.securityCode,
        confirm: true
      });
      if (data.success) {
        this.stepperProgress = 3;
        this.$store.dispatch("fetchHouseholdUsers");
      } else
        this.alertSnackbar(
          data.message || this.$t("joinHousehold.connectionError")
        );
    },
    finish() {
      this.$store.dispatch("fetchHouseholdUsers");
      this.$router.push({ name: "Dashboard" });
      if (this.introductionState != 0) {
        this.introductionState = 3;
      }
    }
  }
};
</script>
