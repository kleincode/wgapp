<template>
  <div class="md-layout md-gutter md-alignment-center-center fill-view">
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card :elevation="12">
            <v-toolbar color="primary" dark>
              <v-toolbar-title>Reset password</v-toolbar-title>
            </v-toolbar>
            <v-form ref="form" @submit.prevent="submitForm">
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
                          Please wait...
                        </span>
                      </v-col>
                    </v-row>
                  </div>
                  <div v-if="state == 1">
                    <p>
                      Please choose a new password.
                    </p>
                    <v-text-field
                      v-model="email"
                      label="E-mail"
                      readonly
                      outlined
                    />
                    <v-text-field
                      v-model="password"
                      label="Password"
                      type="password"
                      :rules="passwordRules"
                      outlined
                    />
                    <v-text-field
                      v-model="password"
                      label="Repeat password"
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
                      Please note that password reset tokens expire after one
                      hour. After that, you will need to request a new token.
                    </p>
                  </v-alert>
                </v-expand-transition>
              </v-card-text>
              <v-card-actions>
                <v-btn v-if="state == 2" text :to="{ name: 'Login' }">
                  <v-icon left>arrow_back</v-icon>
                  Back to login
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  v-if="state == 1"
                  color="primary"
                  type="submit"
                  :loading="buttonLoading"
                >
                  <v-icon left>arrow_forward</v-icon>
                  Change password
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
    passwordRules: [
      v => !!v || "Password is required!",
      v => (v && v.length >= 8) || "Password must be at least 8 characters."
    ],
    errorText: "Unknown error.",
    email: "",
    password: "",
    repeatPassword: ""
  }),
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
          this.errorText =
            err || "Communication error. Please check your connection.";
          this.state = 2;
        }
      } else {
        this.errorText = "No valid token provided.";
        this.state = 2;
      }
    }
  }
};
</script>
