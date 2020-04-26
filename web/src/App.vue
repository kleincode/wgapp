<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list-item>
        <v-list-item-avatar>
          <v-img
            alt="Vuetify Logo"
            class="shrink mr-2"
            contain
            :src="require('./assets/avatar.webp')"
            transition="scale-transition"
            width="40"
          />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>Jeff</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item v-for="item in sections" :key="item.title" link>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn block color="warning" @click="logout"
            ><v-icon class="mr-1">help</v-icon> Help</v-btn
          >
        </div>
      </template>
    </v-navigation-drawer>
    <v-app-bar app>
      <div class="d-flex align-center">
        <v-btn icon @click.stop="drawer = !drawer"
          ><v-icon>dehaze</v-icon></v-btn
        >
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
    links: ["Home", "Open App", "Legal Notice"],
    drawer: false,
    sections: [
      { title: "Home", icon: "home" },
      { title: "Introduction", icon: "info" },
      { title: "Features", icon: "list" },
      { title: "Roadmap", icon: "place" },
      { title: "FAQ", icon: "question_answer" },
      { title: "About us", icon: "group" }
    ]
  }),
  async created() {
    this.$vuetify.theme.dark = false;
  }
};
</script>
