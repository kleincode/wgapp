<template>
  <v-container
    ><v-row justify="center">
      <v-col xl="9" lg="10" md="12">
        <h1 class="display-2 pb-6">Profile</h1>
        <v-card style="min-height: 70vh" class="pa-4">
          <v-row>
            <v-col cols="12" md="6" lg="4" class="text-center">
              <v-hover v-slot:default="{ hover }">
                <v-avatar size="250" class="mb-2">
                  <img
                    :class="{ 'on-hover': hover }"
                    src="https://cdn.vuetifyjs.com/images/john.jpg"
                    alt="John"
                  />
                </v-avatar>
              </v-hover>
              <br />
              <v-btn text>remove</v-btn>
            </v-col>
            <v-col cols="12" md="6" lg="8" class="pa-3">
              <v-text-field
                v-model="username"
                label="Username"
                readonly
                outlined
              ></v-text-field>
              <v-text-field
                v-model="email"
                outlined
                :rules="emailRules"
                label="E-mail"
                required
                readonly
                prepend-icon="alternate_email"
              ></v-text-field>
              <v-text-field
                v-model="password1"
                outlined
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[passwordRules.required, passwordRules.min]"
                :type="showPassword ? 'text' : 'password'"
                name="input-10-2"
                label="Old Password"
                @click:append="showPassword = !showPassword"
              ></v-text-field>
              <v-text-field
                v-model="password1"
                outlined
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[passwordRules.required, passwordRules.min]"
                :type="showPassword ? 'text' : 'password'"
                name="input-10-2"
                label="New Password"
                @click:append="showPassword = !showPassword"
              ></v-text-field>
              <v-text-field
                v-model="password2"
                outlined
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[passwordRules.required, passwordRules.min]"
                :type="showPassword ? 'text' : 'password'"
                name="input-10-2"
                label="Repeat New Password"
                @click:append="showPassword = !showPassword"
              ></v-text-field>
              <v-btn outlined block color="info">save</v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row></v-container
  >
</template>

<script>
export default {
  data: () => ({
    username: "Matti Frind",
    email: "matti@frind.de",
    emailRules: [
      v => !!v || "E-mail is required",
      v => /.+@.+\..+/.test(v) || "E-mail must be valid"
    ],
    oldPassword: "",
    password1: "",
    password2: "",
    showPassword: false,
    passwordRules: {
      required: value => !!value || "Required.",
      min: v => v.length >= 8 || "Min 8 characters"
    }
  })
};
</script>

<style></style>
