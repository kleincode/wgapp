<template>
  <div class="md-layout md-gutter md-alignment-center-center fill-view">
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Welcome!</v-toolbar-title>
              <template v-slot:extension>
                <v-tabs centered v-model="registerMode" color="white">
                  <v-tab>Login</v-tab>
                  <v-tab>Register</v-tab>
                </v-tabs>
              </template>
            </v-toolbar>
            <v-form
              @submit.prevent="registerMode ? register() : login()"
              ref="form"
            >
              <v-card-text>
                <v-text-field
                  label="E-Mail"
                  v-model="email"
                  prepend-icon="person"
                  type="text"
                  outlined
                  :rules="validating ? emailRules : []"
                />
                <v-expand-transition>
                  <v-text-field
                    label="First name"
                    prepend-icon="text_format"
                    v-model="firstname"
                    type="text"
                    outlined
                    :rules="
                      validating && !!registerMode ? standardFieldRules : []
                    "
                    v-if="registerMode"
                  />
                </v-expand-transition>
                <v-expand-transition>
                  <v-text-field
                    label="Last name"
                    prepend-icon="text_format"
                    v-model="lastname"
                    type="text"
                    outlined
                    :rules="
                      validating && !!registerMode ? standardFieldRules : []
                    "
                    v-if="registerMode"
                  />
                </v-expand-transition>
                <v-text-field
                  label="Password"
                  v-model="password"
                  prepend-icon="lock"
                  type="password"
                  :rules="validating && !!registerMode ? passwordRules : []"
                  outlined
                />
                <v-expand-transition>
                  <v-text-field
                    label="Repeat password"
                    v-model="repeatPassword"
                    prepend-icon="replay"
                    type="password"
                    :rules="
                      validating && !!registerMode ? standardFieldRules : []
                    "
                    outlined
                    v-if="registerMode"
                  />
                </v-expand-transition>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" type="submit" :loading="loading">
                  <v-icon left>arrow_forward</v-icon>
                  {{ registerMode ? "Register" : "Login" }}
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
  name: "Login",
  data: () => ({
    registerMode: false,
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    repeatPassword: "",
    loading: false,
    showSnackbar: false,
    snackbarMessage: "Loading...",
    standardFieldRules: [v => !!v || "This field is required!"],
    emailRules: [
      v => !!v || "E-mail is required!",
      v => /.+@.+\..+/.test(v) || "E-mail must be valid!"
    ],
    passwordRules: [
      v => !!v || "Password is required!",
      v => (v && v.length >= 8) || "Password must be at least 8 characters."
    ],
    formValid: null,
    validating: false
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
      await new Promise(resolve => setTimeout(resolve, 100));
      this.formValid = this.$refs.form.validate();
    },
    async register() {
      await this.validate();
      if (!this.formValid) {
        this.alertSnackbar("Please check your input.");
        return;
      } else if (this.password !== this.repeatPassword) {
        this.alertSnackbar("Your passwords do not match. Please try again.");
        this.password = "";
        this.repeatPassword = "";
        return;
      }
      this.loading = true;
      try {
        const { data } = await this.$http.post("/_/register", {
          email: this.email,
          password: this.password,
          firstname: this.firstname,
          lastname: this.lastname
        });
        if (data.success) {
          this.alertSnackbar(data.message);
          this.login();
        } else this.alertSnackbar(data.message);
        this.loading = false;
      } catch (err) {
        console.error(err);
        this.alertSnackbar("Error registering. Please try again.");
        this.loading = false;
      }
    },
    async login() {
      await this.validate();
      if (!this.formValid) {
        this.alertSnackbar("Please check your input.");
        return;
      }
      this.loading = true;
      try {
        let redirectTo = await this.$store.dispatch("login", {
          email: this.email,
          password: this.password
        });
        this.$http.defaults.headers.common[
          "x-access-token"
        ] = this.$store.state.userToken;
        this.loading = false;
        this.$store.dispatch("authorize");
        this.$store.dispatch("fetchHouseholdUsers");
        if (this.$route.params && this.$route.params.redirect)
          this.$router.push(this.$route.params.redirect);
        else this.$router.push(redirectTo || "/");
      } catch (err) {
        this.alertSnackbar(err);
        this.loading = false;
      }
    }
  }
};
</script>
