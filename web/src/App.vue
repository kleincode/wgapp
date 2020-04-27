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

      <v-list v-if="$route.name == 'Home'" dense>
        <v-list-item
          v-for="item in sections"
          :key="item.title"
          link
          :to="item.link"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <div v-else class="pa-2">
        <v-btn block color="primary" :to="{ name: 'Home' }"
          ><v-icon class="mr-1">home</v-icon> Home</v-btn
        >
      </div>
      <template v-if="$route.name == 'Home'" v-slot:append>
        <div class="pa-2">
          <v-btn block color="warning" :to="{ name: 'Help' }"
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
      <router-view></router-view>
      <v-footer color="primary lighten-1" padless>
        <v-row justify="center" no-gutters>
          <v-btn
            v-for="link in links"
            :key="link.title"
            :to="link.to"
            color="white"
            text
            rounded
            class="ma-2"
          >
            {{ link.title }}
          </v-btn>
          <v-col
            class="primary lighten-2 py-4 text-center white--text"
            cols="12"
          >
            {{ new Date().getFullYear() }} — <strong>Jeff</strong>
          </v-col>
        </v-row>
      </v-footer>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    links: [
      { title: "Home", to: { name: "Home", hash: "#home" } },
      { title: "Open App", href: "https://wg.kleinco.de" },
      { title: "Legal Notice", to: { name: "LegalNotice" } }
    ],
    drawer: false,
    sections: [
      { title: "Home", icon: "home", link: { name: "Home", hash: "#home" } },
      {
        title: "Introduction",
        icon: "info",
        link: { name: "Home", hash: "#introduction" }
      },
      {
        title: "Features",
        icon: "list",
        link: { name: "Home", hash: "#features" }
      },
      {
        title: "Roadmap",
        icon: "place",
        link: { name: "Home", hash: "#roadmap" }
      },
      {
        title: "About us",
        icon: "group",
        link: { name: "Home", hash: "#about" }
      },
      {
        title: "FAQ",
        icon: "question_answer",
        link: { name: "Home", hash: "#faq" }
      },
      {
        title: "Contact",
        icon: "drafts",
        link: { name: "Home", hash: "#contact" }
      }
    ]
  }),
  async created() {
    this.$vuetify.theme.dark = false;
  }
};
</script>
