<template>
  <div class="md-layout md-gutter md-alignment-center-center fill-view">
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card :elevation="12">
            <v-toolbar color="primary" dark>
              <v-toolbar-title>
                {{ $t("resetPassword.title") }}
              </v-toolbar-title>
            </v-toolbar>
            <v-form ref="form" v-model="formValid" @submit.prevent="submitForm">
              <v-card-text>
                <v-expand-transition>
                  <div v-if="state == 0">
                    <v-row>
                      <v-col cols="auto">
                        <v-progress-circular
                          :size="50"
                          color="primary"
                          indeterminate
                        ></v-progress-circular>
                      </v-col>
                      <v-col align-self="center">
                        <span class="headline">
                          {{ $t("general.wait") }}
                        </span>
                      </v-col>
                    </v-row>
                  </div>
                  <div v-if="state == 1">
                    <p>
                      {{ $t("resetPassword.chooseNewPassword") }}
                    </p>
                    <v-text-field
                      v-model="email"
                      :label="$t('login.email')"
                      readonly
                      outlined
                    />
                    <v-text-field
                      v-model="password"
                      :label="$t('login.password')"
                      type="password"
                      :rules="passwordRules"
                      outlined
                    />
                    <v-text-field
                      v-model="repeatPassword"
                      :label="$t('login.repeatPassword')"
                      type="password"
                      :rules="passwordRules"
                      outlined
                    />
                  </div>
                  <v-alert v-if="state == 2" type="error">
                    <p>
                      {{ errorText }}
                    </p>
                    <p>
                      {{ $t("resetPassword.expireNotice") }}
                    </p>
                  </v-alert>
                </v-expand-transition>
              </v-card-text>
              <v-card-actions>
                <v-btn v-if="state == 2" text :to="{ name: 'Login' }">
                  <v-icon left>arrow_back</v-icon>
                  {{ $t("resetPassword.backToLogin") }}
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  v-if="state == 1"
                  color="primary"
                  type="submit"
                  :loading="buttonLoading"
                >
                  <v-icon left>arrow_forward</v-icon>
                  {{ $t("resetPassword.changePasswordButton") }}
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "ResetPassword",
  props: {
    token: {
      type: String,
      default: ""
    }
  },
  data: () => ({
    state: 0,
    buttonLoading: false,
    errorText: "Unknown error.",
    email: "",
    password: "",
    repeatPassword: "",
    formValid: false
  }),
  computed: {
    passwordRules() {
      return [
        v => !!v || this.$t("login.messages.passwordRequired"),
        v => (v && v.length >= 8) || this.$t("login.messages.passwordTooShort")
      ];
    }
  },
  mounted() {
    this.verifyToken();
  },
  methods: {
    async verifyToken() {
      const { token } = this;
      if (token && token.length) {
        try {
          const { data } = await this.$http.get("/_/fetchresetpassword", {
            params: { token }
          });
          if (data.success) {
            this.email = data.email;
            this.state = 1;
          } else throw data.message;
        } catch (err) {
          this.errorText = err || this.$t("general.errors.communication");
          this.state = 2;
        }
      } else {
        this.errorText = this.$t("resetPassword.noToken");
        this.state = 2;
      }
    },
    submitForm() {
      this.$refs.form.validate();
      this.$nextTick(() => this.changePassword());
    },
    async changePassword() {
      if (!this.formValid) {
        this.$store.dispatch(
          "showSnackbar",
          this.$t("resetPassword.provideNewPassword")
        );
      } else if (this.password != this.repeatPassword) {
        this.$store.dispatch(
          "showSnackbar",
          this.$t("login.messages.passwordsDoNotMatch")
        );
        this.password = "";
        this.repeatPassword = "";
      } else
        try {
          const { data } = await this.$http.post("/_/updateresetpassword", {
            token: this.token,
            password: this.password
          });
          if (data.success) {
            this.$store.dispatch(
              "showSnackbar",
              this.$t("resetPassword.updated")
            );
            this.$router.push({ name: "Login" });
          } else throw data.message;
        } catch (err) {
          this.$store.dispatch(
            "showSnackbar",
            err || this.$t("resetPassword.updateFailed")
          );
        }
    }
  }
};
</script>
