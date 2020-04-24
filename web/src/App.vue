<template>
  <v-app>
    <v-app-bar app>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          :src="require('./assets/avatar.webp')"
          transition="scale-transition"
          width="40"
        />

        <v-toolbar-title style="display: flex">Jeff.</v-toolbar-title>
      </div>

      <v-spacer></v-spacer>

      <v-btn href="" target="_blank" text>
        <span class="mr-2">Open App</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
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
  async created() {
    this.$vuetify.theme.dark = false;
  }
};
</script>
