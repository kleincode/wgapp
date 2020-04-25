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

        <v-toolbar-title style="display: flex">Jeff</v-toolbar-title>
      </div>

      <v-spacer></v-spacer>
      <v-chip class="mr-6" color="primary"
        ><v-avatar left>
          <v-icon>info</v-icon>
        </v-avatar>
        Currently in Closed Beta</v-chip
      >
      <v-btn href="" target="_blank" text>
        <span class="mr-2">Open App</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
      <Home />
      <v-footer color="primary lighten-1" padless>
        <v-row justify="center" no-gutters>
          <v-btn
            v-for="link in links"
            :key="link"
            color="white"
            text
            rounded
            class="my-2"
          >
            {{ link }}
          </v-btn>
          <v-col
            class="primary lighten-2 py-4 text-center white--text"
            cols="12"
          >
            {{ new Date().getFullYear() }} — <strong>Vuetify</strong>
          </v-col>
        </v-row>
      </v-footer>
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
    links: ["Home", "Open App", "FAQ", "Contact Us"]
  }),
  async created() {
    this.$vuetify.theme.dark = false;
  }
};
</script>
