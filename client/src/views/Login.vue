<template>
  <div class="md-layout md-gutter md-alignment-center-center fill-view">
    <div
      class="md-layout-item md-small-size-90 md-medium-size-60 md-large-size-40 md-xlarge-size-30"
      md-elevation="4"
    >
      <md-card>
        <md-card-header>
          <div class="md-title">{{ registerMode ? "Register" : "Login" }}</div>
        </md-card-header>
        <md-card-content>
          <transition-group name="fade">
            <md-field
              v-show="registerMode"
              key="field-firstname"
              :class="{ 'md-invalid': this.showErrors && !this.firstname }"
            >
              <label>First name</label>
              <md-input v-model="firstname" required></md-input>
              <span class="md-error">Required field!</span>
            </md-field>
            <md-field
              v-show="registerMode"
              key="field-lastname"
              :class="{ 'md-invalid': this.showErrors && !this.lastname }"
            >
              <label>Last name</label>
              <md-input v-model="lastname" required></md-input>
              <span class="md-error">Required field!</span>
            </md-field>
            <md-field
              key="field-email"
              :class="{ 'md-invalid': this.showErrors && !this.email }"
            >
              <label>E-mail</label>
              <md-input v-model="email" required></md-input>
              <span class="md-error">Required field!</span>
            </md-field>
            <md-field
              key="field-password"
              :class="{ 'md-invalid': this.showErrors && !this.password }"
            >
              <label>Password</label>
              <md-input v-model="password" type="password" required></md-input>
              <span class="md-error">Required field!</span>
            </md-field>
            <md-field
              v-show="registerMode"
              key="field-password-repeat"
              :class="{ 'md-invalid': this.showErrors && !this.repeatPassword }"
            >
              <label>Repeat password</label>
              <md-input
                v-model="repeatPassword"
                type="password"
                required
              ></md-input>
              <span class="md-error">Required field!</span>
            </md-field>
          </transition-group>
          <md-button
            class="md-dense md-raised md-primary"
            @click="registerMode ? register() : login()"
            :disabled="loading"
            >{{ registerMode ? "Register" : "Login" }}</md-button
          >
        </md-card-content>
        <md-tabs md-alignment="centered" @md-changed="registerModeChange">
          <md-tab
            id="tab-login"
            md-label="Login"
            class="tab-fill-width"
          ></md-tab>
          <md-tab
            id="tab-register"
            md-label="Register"
            class="tab-fill-width"
          ></md-tab>
        </md-tabs>
      </md-card>
    </div>
    <md-snackbar
      md-position="center"
      :md-duration="4000"
      :md-active.sync="showSnackbar"
      md-persistant
    >
      <span>{{ snackbarMessage }}</span>
      <md-button class="md-accent" @click="showSnackbar = false"
        >Close</md-button
      >
    </md-snackbar>
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
    showErrors: false
  }),
  methods: {
    registerModeChange(tab) {
      this.registerMode = tab === "tab-register";
    },
    alertSnackbar(msg) {
      if (this.showSnackbar) {
        this.showSnackbar = false;
        setTimeout(() => this.alertSnackbar(msg), 500);
      } else {
        this.snackbarMessage = msg;
        this.showSnackbar = true;
      }
    },
    register() {
      if (
        !this.firstname ||
        !this.lastname ||
        !this.email ||
        !this.password ||
        !this.repeatPassword
      ) {
        this.showErrors = true;
        this.alertSnackbar("Please check your input.");
        return;
      } else if (this.password !== this.repeatPassword) {
        this.alertSnackbar("Your passwords do not match. Please try again.");
        this.password = "";
        this.repeatPassword = "";
        return;
      }
      this.loading = true;
      fetch("/_/register", {
        method: "POST",
        body: JSON.stringify({
          email: this.email,
          password: this.password,
          firstname: this.firstname,
          lastname: this.lastname
        }),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(resjson => {
          if (resjson.success) {
            this.alertSnackbar(resjson.message);
            this.login();
          } else this.alertSnackbar(resjson.message);
          this.loading = false;
        })
        .catch(err => {
          console.error(err);
          this.alertSnackbar("Error logging in. Please try again.");
          this.loading = false;
        });
    },
    login() {
      if (!this.email || !this.password) {
        this.showErrors = true;
        this.alertSnackbar("Please check your input.");
        return;
      }
      this.loading = true;
      fetch("/_/login", {
        method: "POST",
        body: JSON.stringify({
          email: this.email,
          password: this.password
        }),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(resjson => {
          if (resjson.success) {
            this.loading = false;
            this.$store.commit("login_success", resjson.email);
            if (this.$route.params && this.$route.params.redirect)
              this.$router.push(this.$route.params.redirect);
            else this.$router.push(resjson.redirect || "/");
          } else this.alertSnackbar(resjson.message);
          this.loading = false;
        })
        .catch(err => {
          console.error(err);
          this.alertSnackbar("Error logging in. Please try again.");
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.fill-view {
  min-height: 100%;
  width: 100%;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease-out;
}
.fade-enter,
.fade-leave-to {
  min-height: 0;
  height: 0;
  padding-top: 0;
  transform: scaleY(0);
}
.tab-fill-width {
  min-width: 40% !important;
}
</style>
