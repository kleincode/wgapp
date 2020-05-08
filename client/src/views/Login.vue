<template>
  <div class="md-layout md-gutter md-alignment-center-center fill-view">
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card :elevation="12">
            <v-toolbar color="primary" dark>
              <v-toolbar-title>{{ $t("login.welcome") }}</v-toolbar-title>
              <template v-slot:extension>
                <v-tabs
                  v-model="registerMode"
                  centered
                  color="white"
                  optional
                  @change="print($event)"
                >
                  <v-tab>{{ $t("login.login") }}</v-tab>
                  <v-tab>{{ $t("login.register") }}</v-tab>
                </v-tabs>
              </template>
            </v-toolbar>
            <v-form ref="form" @submit.prevent="submitForm">
              <v-card-text>
                <v-expand-transition>
                  <p v-if="registerMode == 2" class="my-0">
                    If you forgot your password, please provide your email so we
                    can send you a link which allows you to change your
                    password.
                    <br />
                    <br />
                  </p>
                </v-expand-transition>
                <v-text-field
                  v-model="email"
                  :label="$t('login.mail')"
                  prepend-icon="person"
                  type="text"
                  outlined
                  :rules="validating ? emailRules : []"
                />
                <v-expand-transition>
                  <v-text-field
                    v-if="registerMode == 1"
                    v-model="firstname"
                    :label="$t('login.first')"
                    prepend-icon="text_format"
                    type="text"
                    outlined
                    :rules="
                      validating && registerMode == 1 ? standardFieldRules : []
                    "
                  />
                </v-expand-transition>
                <v-expand-transition>
                  <v-text-field
                    v-if="registerMode == 1"
                    v-model="lastname"
                    :label="$t('login.last')"
                    prepend-icon="text_format"
                    type="text"
                    outlined
                    :rules="
                      validating && registerMode == 1 ? standardFieldRules : []
                    "
                  />
                </v-expand-transition>
                <v-expand-transition>
                  <v-text-field
                    v-if="registerMode != 2"
                    v-model="password"
                    :label="$t('login.password')"
                    prepend-icon="lock"
                    type="password"
                    :rules="
                      validating && registerMode != 2 && !!registerMode
                        ? passwordRules
                        : []
                    "
                    outlined
                  />
                </v-expand-transition>
                <v-expand-transition>
                  <v-text-field
                    v-if="registerMode == 1"
                    v-model="repeatPassword"
                    :label="$t('login.rep')"
                    prepend-icon="replay"
                    type="password"
                    :rules="
                      validating && registerMode == 1 ? standardFieldRules : []
                    "
                    outlined
                  />
                </v-expand-transition>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  v-if="registerMode == 0"
                  color="secondary"
                  text
                  @click="registerMode = 2"
                >
                  Forgot password?
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" type="submit" :loading="loading">
                  <v-icon left>arrow_forward</v-icon>
                  {{
                    [$t("login.login"), $t("login.register"), "Send e-mail"][
                      registerMode
                    ]
                  }}
                </v-btn>
              </v-card-actions>
            </v-form>
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
  name: "Login",
  data: () => ({
    registerMode: 0,
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    repeatPassword: "",
    loading: false,
    showSnackbar: false,
    snackbarMessage: "Loading...",
    ruleMsg: "This field is required!",
    rulePass1: "Password is required!",
    rulePass2: "Password must be at least 8 characters.",
    ruleMail1: "E-mail is required!",
    ruleMail2: "E-mail must be valid!",
    standardFieldRules: [v => !!v || this.ruleMsg],
    emailRules: [
      v => !!v || this.ruleMail1,
      v => /.+@.+\..+/.test(v) || this.ruleMail2
    ],
    passwordRules: [
      v => !!v || this.rulePass1,
      v => (v && v.length >= 8) || this.rulePass2
    ],
    formValid: null,
    validating: false
  }),
  created() {
    this.snackbarMessage = this.$t("commands.loading") + "...";
    this.ruleMsg = this.$t("login.messages.required");
    this.rulePass1 = this.$t("login.messages.password1");
    this.rulePass2 = this.$t("login.messages.password2");
    this.ruleMail1 = this.$t("login.messages.mail1");
    this.ruleMail2 = this.$t("login.messages.mail2");
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
    submitForm() {
      switch (this.registerMode) {
        case 0:
          this.login();
          break;
        case 1:
          this.register();
          break;
        case 2:
          this.passRecovery();
          break;
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
        this.alertSnackbar(this.$t("login.messages.input"));
        return;
      } else if (this.password !== this.repeatPassword) {
        this.alertSnackbar(this.$t("login.messages.match"));
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
        this.alertSnackbar(this.$t("login.errors.register"));
        this.loading = false;
      }
    },
    async login() {
      await this.validate();
      if (!this.formValid) {
        this.alertSnackbar(this.$t("login.messages.input"));
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
    },
    async passRecovery() {
      await this.validate();
      if (!this.formValid) {
        this.alertSnackbar("Please check your input.");
        return;
      }
      this.loading = true;
      try {
        const { data } = await this.$http.post("/_/forgotpassword", {
          email: this.email
        });
        this.alertSnackbar(data.message);
      } catch (err) {
        this.alertSnackbar("Communication error");
        console.warn(err);
      }
      this.loading = false;
    },
    print(val) {
      console.log(val);
    }
  }
};
</script>
