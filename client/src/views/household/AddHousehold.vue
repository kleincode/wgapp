<template>
  <div class="md-layout md-gutter md-alignment-center-center fill-view">
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="6" xl="4">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Join household</v-toolbar-title>
            </v-toolbar>
            <v-form @submit.prevent="formSubmit" ref="form">
              <v-card-text>
                <v-text-field
                  label="Household ID"
                  v-model="householdId"
                  prepend-icon="home"
                  type="text"
                  outlined
                  :rules="validating ? householdIdRules : []"
                />
                <v-text-field
                  label="Security code"
                  v-model="securityCode"
                  prepend-icon="vpn_key"
                  type="text"
                  outlined
                  :rules="validating ? securityCodeRules : []"
                />
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" type="submit" :loading="loading">
                  <v-icon left>arrow_forward</v-icon>
                  Move in
                </v-btn>
              </v-card-actions>
            </v-form>
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
  name: "AddHousehold",
  data: () => ({
    householdId: "",
    securityCode: "",
    loading: false,
    showSnackbar: false,
    snackbarMessage: "",
    householdIdRules: [
      v => !!v || 'Household ID is required',
      v => (v && v.length == 32 && /^[A-Z0-9]*$/.test(v)) || 'Invalid format'
    ],
    securityCodeRules: [
      v => !!v || 'Security code is required',
      v => (v && v.length == 6 && /^[0-9]*$/.test(v)) || 'Invalid format'
    ],
    validating: false,
    formValid: null
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
    async validate() {
      this.validating = true;
      this.$refs.form.validate();
      await new Promise((resolve) => setTimeout(resolve, 100));
      this.formValid = this.$refs.form.validate();
    },
    async formSubmit() {
      await this.validate();
      if(!this.formValid) this.alertSnackbar("Please check your input.");
      else this.alertSnackbar("form submitted");
    }
  },
  mounted() {
    this.householdId = this.$route.query.h || "";
    this.securityCode = this.$route.query.s || "";
  }
};
</script>
