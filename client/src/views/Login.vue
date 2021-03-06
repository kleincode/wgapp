<template>
  <div class="md-layout md-gutter md-alignment-center-center fill-view">
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card :elevation="12">
            <v-toolbar color="primary" dark>
              <v-toolbar-title>{{ $t("login.welcome") }}</v-toolbar-title>
              <template v-slot:extension>
                <v-tabs v-model="registerMode" centered color="white" optional>
                  <v-tab :disabled="registerMode == 3">{{
                    $t("login.login")
                  }}</v-tab>
                  <v-tab :disabled="registerMode == 3">{{
                    $t("login.register")
                  }}</v-tab>
                </v-tabs>
              </template>
            </v-toolbar>
            <v-form ref="form" @submit.prevent="submitForm">
              <v-card-text>
                <v-expand-transition>
                  <div v-if="registerMode == 3">
                    <v-row>
                      <v-col cols="auto">
                        <v-fade-transition>
                          <v-progress-circular
                            v-if="verifyState == 0"
                            :size="50"
                            color="primary"
                            indeterminate
                          ></v-progress-circular>
                          <v-avatar v-if="verifyState == 1" color="success">
                            <v-icon dark>verified_user</v-icon>
                          </v-avatar>
                          <v-avatar v-if="verifyState == 2" color="error">
                            <v-icon dark>error</v-icon>
                          </v-avatar>
                        </v-fade-transition>
                      </v-col>
                      <v-col align-self="center">
                        <span v-if="verifyState == 0" class="headline">
                          {{ $t("login.verifying") }}
                        </span>
                        <p v-if="verifyState == 1">
                          {{ $t("login.verified") }}
                        </p>
                        <p v-if="verifyState == 2">
                          {{ $t("login.errors.verify") }}
                        </p>
                      </v-col>
                    </v-row>
                  </div>
                </v-expand-transition>
                <v-expand-transition>
                  <p v-if="registerMode == 2" class="my-0">
                    {{ $t("login.forgotPasswordMessage") }}
                    <br />
                    <br />
                  </p>
                </v-expand-transition>
                <v-text-field
                  v-if="registerMode < 3"
                  v-model="email"
                  :label="$t('login.email')"
                  prepend-icon="person"
                  type="email"
                  outlined
                  :rules="validating ? emailRules : []"
                />
                <v-expand-transition>
                  <v-text-field
                    v-if="registerMode == 1"
                    v-model="firstname"
                    :label="$t('login.firstname')"
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
                    :label="$t('login.lastname')"
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
                    v-if="registerMode < 2"
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
                    :label="$t('login.repeatPassword')"
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
                  {{ $t("login.forgotPassword") }}
                </v-btn>
                <v-btn
                  v-if="registerMode == 3 && verifyState == 1"
                  color="secondary"
                  text
                  @click="registerMode = 0"
                >
                  {{ $t("login.login") }}
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  v-if="registerMode < 3"
                  color="primary"
                  type="submit"
                  :loading="loading"
                >
                  <v-icon left>arrow_forward</v-icon>
                  {{
                    [$t("login.login"), $t("login.register"), "Send e-mail"][
                      registerMode
                    ]
                  }}
                </v-btn>
                <v-btn
                  v-if="registerMode == 3 && verifyState == 2"
                  color="primary"
                  :loading="loading"
                  v-text="$t('login.resendEmail')"
                ></v-btn>
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
    formValid: null,
    validating: false,
    verifyState: 0
  }),
  computed: {
    standardFieldRules() {
      return [v => !!v || this.$t("login.messages.required")];
    },
    emailRules() {
      return [
        v => !!v || this.$t("login.messages.mailRequired"),
        v => /.+@.+\..+/.test(v) || this.$t("login.messages.mailInvalid")
      ];
    },
    passwordRules() {
      return [
        v => !!v || this.$t("login.messages.passwordRequired"),
        v => (v && v.length >= 8) || this.$t("login.messages.passwordTooShort")
      ];
    }
  },
  created() {
    this.snackbarMessage = this.$t("commands.loading") + "...";
  },
  async mounted() {
    if (this.$route.query.verify) {
      this.registerMode = 3;
      try {
        const { data } = await this.$http.post("/_/verifyemail", {
          token: this.$route.query.verify
        });
        if (data.success) this.verifyState = 1;
        else throw data.message;
      } catch (err) {
        this.verifyState = 2;
        if (err) this.$store.dispatch("showSnackbar", err);
      }
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
        this.alertSnackbar(this.$t("login.messages.checkInput"));
        return;
      } else if (this.password !== this.repeatPassword) {
        this.alertSnackbar(this.$t("login.messages.passwordsDoNotMatch"));
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
        this.alertSnackbar(this.$t("login.messages.checkInput"));
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
        this.alertSnackbar(this.$t("login.messages.passwordsDoNotMatch"));
        return;
      }
      this.loading = true;
      try {
        const { data } = await this.$http.post("/_/forgotpassword", {
          email: this.email
        });
        this.alertSnackbar(data.message);
      } catch (err) {
        this.alertSnackbar(this.$t("general.errors.communication"));
        console.warn(err);
      }
      this.loading = false;
    }
  }
};
</script>
