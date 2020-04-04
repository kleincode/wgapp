<template>
  <div class="md-layout md-gutter md-alignment-center-center fill-view">
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="6" xl="5">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>New household</v-toolbar-title>
            </v-toolbar>
            <v-stepper v-model="stepperProgress" vertical>
              <v-stepper-step :complete="stepperProgress > 1" step="1"
                >Create new household</v-stepper-step
              >

              <v-stepper-content step="1">
                <p>
                  Give your household a sweet little name. Don't worry, you will
                  be able to change it later.
                </p>
                <v-form v-model="step1Valid" @submit.prevent="step1Submit">
                  <v-text-field
                    label="Household name"
                    outlined
                    v-model="householdName"
                    counter="64"
                    :rules="householdNameRules"
                  ></v-text-field>
                  <v-btn color="primary" type="submit">Continue</v-btn>
                </v-form>
              </v-stepper-content>

              <v-stepper-step :complete="stepperProgress > 2" step="2"
                >Configure household</v-stepper-step
              >

              <v-stepper-content step="2">
                <v-form v-model="step2Valid" @submit.prevent="step2Submit">
                  <v-select
                    outlined
                    v-model="householdType"
                    :items="householdTypes"
                    item-text="description"
                    item-value="id"
                    label="Household type"
                    class="mt-2"
                  ></v-select>
                  <v-btn color="primary" type="submit">Continue</v-btn>
                  <v-btn text class="ml-2" @click.prevent="cancel"
                    >Cancel</v-btn
                  >
                </v-form>
              </v-stepper-content>

              <v-stepper-step :complete="stepperProgress > 3" step="3"
                >Invite members</v-stepper-step
              >

              <v-stepper-content step="3">
                <p>
                  It feels so lonely without some roommates. Invite them via the
                  link below.
                </p>
                <v-text-field
                  v-model="householdLink"
                  readonly
                  append-icon="assignment"
                  @click:append="copyAddLink"
                  ref="addLink"
                  outlined
                ></v-text-field>
                <v-btn color="primary" @click.prevent="step3Submit">Next</v-btn>
                <v-btn text class="ml-2" @click.prevent="cancel">Cancel</v-btn>
              </v-stepper-content>

              <v-stepper-step :complete="stepperProgress > 4" step="4"
                >Finish</v-stepper-step
              >

              <v-stepper-content step="4">
                <p>
                  Congratulations, your new household has been setup
                  successfully. Continue to check out your dashboard.
                </p>
                <v-btn color="primary" @click="finish">
                  <v-icon left>dashboard</v-icon> Go to dashboard</v-btn
                >
              </v-stepper-content>
            </v-stepper>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-snackbar :timeout="4000" v-model="showSnackbar">
      <span>{{ snackbarMessage }}</span>
      <v-btn text small color="red" @click="showSnackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>
<script>
export default {
  name: "CreateHousehold",
  data: () => ({
    stepperProgress: 1,
    householdName: "My household",
    householdNameRules: [
      v => !!v || "Please provide a name!",
      v => (v && v.length <= 64) || "Name is too long!"
    ],
    step1Valid: null,
    step2Valid: null,
    showSnackbar: false,
    snackbarMessage: "Loading...",
    householdType: 0,
    householdTypes: [
      {
        id: 0,
        description: "Shared apartment"
      },
      {
        id: 1,
        description: "Couple"
      },
      {
        id: 2,
        description: "Family"
      }
    ],
    householdLink: "https://usw"
  }),
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
      else this.alertSnackbar("Please check your input.");
    },
    step2Submit() {
      this.stepperProgress = 3;
    },
    step3Submit() {
      this.stepperProgress = 4;
    },
    copyAddLink(event) {
      console.log(this.$refs.addLink.$refs.input);
      this.$refs.addLink.$refs.input.select();
      document.execCommand("copy");
      event.target.focus();
      this.alertSnackbar("Copied to clipboard. Happy pasting! :)");
    },
    finish() {
      this.$router.push({ name: "Dashboard" });
    },
    cancel() {
      this.householdName = "My household";
      this.stepperProgress = 1;
    }
  },
  mounted() {
    this.householdName = this.$store.state.userFirstName + "'s household";
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
