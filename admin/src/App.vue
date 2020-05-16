<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="@/assets/jeff-without.svg"
          transition="scale-transition"
          width="40"
        />

        <div class="headline">Jeff - Admin Panel</div>
      </div>
    </v-app-bar>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data: () => ({
    //
  }),

  created() {
    this.$vuetify.theme.dark = true;
  }
};
</script>
