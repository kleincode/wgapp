<template>
  <v-app>
    <v-navigation-drawer app clipped v-model="menuVisible">
      <v-list dense nav>
        <v-list-item two-line class="px-0">
          <v-list-item-avatar color="primary">
            <span class="white--text title"
              >{{
                !!userFirstName
                  ? userFirstName.substring(0, 1).toUpperCase()
                  : ""
              }}{{
                !!userFirstName
                  ? userLastName.substring(0, 1).toUpperCase()
                  : ""
              }}</span
            >
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="title"
              >{{ userFirstName }} {{ userLastName }}</v-list-item-title
            >
            <v-list-item-subtitle>{{ userEmail }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item
          v-for="item in menuContents"
          :key="item.name"
          link
          :to="item.path"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn block color="red lighten-2" @click="logout">Logout</v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar app color="primary" class="white--text" clipped-left>
      <v-app-bar-nav-icon
        @click="menuVisible = !menuVisible"
        color="white"
      ></v-app-bar-nav-icon>
      <v-toolbar-title>WG App</v-toolbar-title>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-content>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <!-- If using vue-router -->
        <router-view></router-view>
      </v-container>
    </v-content>

    <v-footer app inset class="text-center">
      <div style="width: 100%;">Made in self-isolation -- 2020</div>
    </v-footer>
    <v-snackbar :timeout="4000" v-model="snackbarShow">
      <span>{{ snackbarMessage }}</span>
      <v-btn text small color="red" @click="snackbarShow = false">Close</v-btn>
    </v-snackbar>
  </v-app>
</template>

<style lang="scss"></style>

<script>
import { mapState } from "vuex";

export default {
  name: "App",
  data: () => ({
    menuVisible: null,
    menuContents: [
      {
        name: "Dashboard",
        icon: "dashboard",
        path: "/dashboard"
      },
      {
        name: "Calendar",
        icon: "event",
        path: "/calendar"
      },
      {
        name: "Finances",
        icon: "money",
        path: "/finances"
      },
      {
        name: "Tasks",
        icon: "list",
        path: "/tasks"
      },
      {
        name: "Manage household",
        icon: "people",
        path: "/household"
      },
      {
        name: "Settings",
        icon: "settings",
        path: "/settings"
      }
    ]
  }),
  computed: {
    snackbarShow: {
      get() {
        return this.$store.state.snackbarShow;
      },
      set(value) {
        this.$store.commit("update_snackbar", value);
      }
    },
    ...mapState([
      "userEmail",
      "userFirstName",
      "userLastName",
      "snackbarMessage"
    ])
  },
  methods: {
    toggleMenu() {
      this.menuVisible = !this.menuVisible;
    },
    logout() {
      this.$store.dispatch("logout");
      delete this.$http.defaults.headers.common["x-access-token"];
      this.$router.push({ name: "Login" });
    }
  }
};
</script>
