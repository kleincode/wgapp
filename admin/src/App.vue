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
      <Home />
    </v-content>
  </v-app>
</template>

<script>
import Home from "./views/Home.vue";

export default {
  name: "App",

  components: {
    Home
  },

  data: () => ({
    //
  }),

  created() {
    this.$vuetify.theme.dark = true;
  }
};
</script>
