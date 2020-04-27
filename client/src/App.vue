<template>
  <v-app>
    <v-navigation-drawer v-model="menuVisible" app clipped>
      <v-list dense nav>
        <v-list-item three-line class="px-0">
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
            <v-list-item-subtitle
              ><router-link :to="{ name: 'Profile' }"
                >Profile</router-link
              ></v-list-item-subtitle
            >
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
        <v-chip
          v-if="offline"
          color="orange"
          text-color="white"
          label
          class="ma-2 center"
        >
          <v-icon left>
            offline_bolt
          </v-icon>
          Offline
        </v-chip>
        <div class="pa-2">
          <v-btn block color="red lighten-2" @click="logout">Logout</v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar app color="primary" class="white--text" clipped-left>
      <v-app-bar-nav-icon
        color="white"
        aria-label="Menu"
        @click="menuVisible = !menuVisible"
      ></v-app-bar-nav-icon>
      <v-toolbar-title>WG App</v-toolbar-title>
    </v-app-bar>

    <v-content>
      <v-container fluid>
        <transition name="fade-transition" mode="out-in">
          <router-view></router-view>
        </transition>
      </v-container>
    </v-content>

    <v-footer app inset class="text-center">
      <div style="width: 100%;">Made in self-isolation -- 2020</div>
    </v-footer>
    <v-snackbar v-model="snackbarShow" :timeout="4000">
      <span>{{ snackbarMessage }}</span>
      <v-btn text small color="red" @click="snackbarShow = false">Close</v-btn>
    </v-snackbar>
    <v-snackbar v-model="isUpdateAvailable" :timeout="0">
      <span>A new update was installed. Please refresh.</span>
      <v-btn text small color="primary" @click="updateAvailable">Refresh</v-btn>
    </v-snackbar>
  </v-app>
</template>

<style lang="scss"></style>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  name: "App",
  data: () => ({
    menuVisible: null
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
    menuContents() {
      let contents = [
        {
          name: "Dashboard",
          icon: "dashboard",
          path: "/dashboard"
        }
      ];
      if (this.$store.state.userSettings.calendarEnabled)
        contents.push({
          name: "Calendar",
          icon: "event",
          path: "/calendar"
        });
      contents.push(
        {
          name: "Shopping",
          icon: "shopping_cart",
          path: "/shoppinglist",
          show: true
        },
        {
          name: "Finances",
          icon: "money",
          path: "/finances",
          show: true
        },
        {
          name: "Tasks",
          icon: "list",
          path: "/tasks",
          show: true
        },
        {
          name: "Manage household",
          icon: "people",
          path: "/household",
          show: true
        },
        {
          name: "Settings",
          icon: "settings",
          path: "/settings",
          show: true
        }
      );
      return contents;
    },
    ...mapState([
      "userEmail",
      "userFirstName",
      "userLastName",
      "snackbarMessage",
      "updateAvailable",
      "offline"
    ]),
    ...mapGetters(["isUpdateAvailable"])
  },
  async created() {
    await this.$store.dispatch("userSettings/sync");
    this.$vuetify.theme.dark = this.$store.state.userSettings.darkMode;
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
