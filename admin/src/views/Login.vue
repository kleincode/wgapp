<template>
  <v-row justify="center" align="center" style="height: 90vh">
    <v-col cols="12" md="6" lg="4" class="text-center">
      <v-card class="pa-6" :elevation="7">
        <h1 class="display-1">Jeff - Admin Panel</h1>
        <v-text-field
          type="password"
          label="Enter admin password"
          class="mt-8 mb-2"
          v-model="password"
        ></v-text-field>
        <v-btn block color="success">LOGIN</v-btn>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "Login",
  data: () => ({
    password: ""
  })
};
</script>

<style></style>
