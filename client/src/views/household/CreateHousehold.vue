<template>
  <div class="md-layout md-gutter md-alignment-center-center fill-view">
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="6" xl="5">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>{{
                stepperProgress > 1 ? householdName : "New household"
              }}</v-toolbar-title>
            </v-toolbar>
            <v-stepper v-model="stepperProgress" vertical>
              <v-stepper-step :complete="stepperProgress > 1" step="1">{{
                $t("household.create.title")
              }}</v-stepper-step>

              <v-stepper-content step="1">
                <p>
                  {{ $t("household.create.nameMessage") }}
                </p>
                <v-form v-model="step1Valid" @submit.prevent="step1Submit">
                  <v-text-field
                    v-model="householdName"
                    :label="$t('household.create.householdName')"
                    outlined
                    counter="64"
                    :rules="householdNameRules"
                  ></v-text-field>
                  <v-btn color="primary" type="submit">{{
                    $t("commands.continue")
                  }}</v-btn>
                </v-form>
              </v-stepper-content>

              <v-stepper-step :complete="stepperProgress > 2" step="2">{{
                $t("household.create.configureHousehold")
              }}</v-stepper-step>

              <v-stepper-content step="2">
                <v-form v-model="step2Valid" @submit.prevent="step2Submit">
                  <v-select
                    v-model="householdType"
                    outlined
                    :items="householdTypes"
                    item-text="description"
                    item-value="id"
                    :label="$t('household.create.householdType')"
                    class="mt-2"
                  ></v-select>
                  <v-btn color="primary" type="submit" :loading="loading">{{
                    $t("commands.continue")
                  }}</v-btn>
                  <v-btn text class="ml-2" @click.prevent="cancel">{{
                    $t("commands.cancel")
                  }}</v-btn>
                </v-form>
              </v-stepper-content>

              <v-stepper-step :complete="stepperProgress > 3" step="3">{{
                $t("household.create.invitMembers")
              }}</v-stepper-step>

              <v-stepper-content step="3">
                <p>
                  {{ $t("household.create.inviteMembersMessage") }}
                </p>
                <v-text-field
                  ref="addLink"
                  v-model="householdLink"
                  readonly
                  append-icon="assignment"
                  outlined
                  @click:append="copyAddLink"
                ></v-text-field>
                <v-btn color="primary" @click.prevent="step3Submit">{{
                  $t("commands.next")
                }}</v-btn>
                <v-btn text class="ml-2" @click.prevent="cancel">{{
                  $t("commands.cancel")
                }}</v-btn>
              </v-stepper-content>

              <v-stepper-step :complete="stepperProgress > 4" step="4">{{
                $t("commands.finish")
              }}</v-stepper-step>

              <v-stepper-content step="4">
                <p>
                  {{ $t("household.create.finishMessage") }}
                </p>
                <v-btn color="primary" @click="finish">
                  <v-icon left>dashboard</v-icon>
                  {{ $t("household.create.goToDashboard") }}</v-btn
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
  name: "CreateHousehold",
  data: () => ({
    stepperProgress: 1,
    householdName: "My household",
    step1Valid: null,
    step2Valid: null,
    loading: false,
    showSnackbar: false,
    snackbarMessage: "Loading...",
    householdType: 0,
    householdLink: "https://usw"
  }),
  computed: {
    householdNameRules: [
      v => !!v || this.$t("household.create.provideName"),
      v => (v && v.length <= 64) || this.$t("household.create.nameTooLong")
    ],
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
    },
    householdTypes() {
      return [
        {
          id: 0,
          description: this.$t("household.types[0]")
        },
        {
          id: 1,
          description: this.$t("household.types[1]")
        },
        {
          id: 2,
          description: this.$t("household.types[2]")
        }
      ];
    }
  },
  mounted() {
    this.cancel();
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
    step1Submit() {
      if (this.step1Valid) this.stepperProgress = 2;
      else this.alertSnackbar(this.$t("household.create.messages.checkInput"));
    },
    async step2Submit() {
      this.loading = true;
      const { data } = await this.$http.post("/_/createhousehold", {
        name: this.householdName,
        type: this.householdType
      });
      if (data.success) {
        this.householdLink =
          window.location.origin +
          `/household/join?h=${data.hid}&s=${data.sec}`;
        this.stepperProgress = 3;
      } else
        this.alertSnackbar(
          this.$t("household.create.errors.createHouseholdError")
        );
      this.loading = false;
    },
    step3Submit() {
      this.stepperProgress = 4;
    },
    copyAddLink(event) {
      console.log(this.$refs.addLink.$refs.input);
      this.$refs.addLink.$refs.input.select();
      document.execCommand("copy");
      event.target.focus();
      this.alertSnackbar(this.$t("household.create.messages.copied"));
    },
    finish() {
      this.$store.dispatch("fetchHouseholdUsers");
      this.$router.push({ name: "Dashboard" });
      if (this.introductionState != 0) {
        this.introductionState = 3;
      }
    },
    cancel() {
      this.householdName =
        this.$store.state.userFirstName + "'s " + this.$t("general.household");
      this.stepperProgress = 1;
      this.loading = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.view-card {
  min-width: 50%;
  max-width: 90%;
  width: 700px;
}
</style>
