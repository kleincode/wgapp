<template>
  <v-app>
    <v-overlay :value="loading" opacity="0.9" color="white">
      <v-row justify="center">
        <v-col cols="5">
          <v-img src="@/assets/jeff-without.svg" class="mb-3"></v-img>
        </v-col>
        <v-col cols="12" class="text-center">
          <h1 class="display-1 black--text mb-6">Jeff - Organizer</h1>
          <v-progress-circular
            indeterminate
            :size="70"
            :width="7"
            color="primary"
            class="mb-4"
          ></v-progress-circular>
          <br />
          <span class="black--text overline">loading</span>
        </v-col>
      </v-row>
    </v-overlay>
    <div v-if="!loading">
      <v-navigation-drawer
        v-model="menuVisible"
        app
        clipped
        color="secondary"
        class="elevation-12"
      >
        <v-list dense nav dark>
          <v-list-item three-line class="px-0">
            <v-list-item-avatar :color="!hasProfilePicture ? 'primary' : ''">
              <span v-if="!hasProfilePicture" class="white--text title"
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
              <v-img v-else :src="profilePictureData"></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="title"
                >{{ userFirstName }} {{ userLastName }}</v-list-item-title
              >
              <v-list-item-subtitle>{{ userEmail }}</v-list-item-subtitle>
              <v-list-item-subtitle v-if="userInHousehold">
                <v-icon small>account_circle</v-icon>&nbsp;
                <router-link class="white--text" :to="{ name: 'Profile' }">
                  {{ $t("app.profile") }}
                </router-link>
              </v-list-item-subtitle>
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
          <div class="pa-3">
            <v-chip
              v-if="offline"
              color="orange"
              text-color="white"
              label
              style="width: 90%"
              class="ma-2 center"
            >
              <v-icon left>
                offline_bolt
              </v-icon>
              Offline
            </v-chip>
            <v-btn color="white" class="" text :to="{ name: 'About' }" block
              >About</v-btn
            >
          </div>
        </template>
      </v-navigation-drawer>

      <v-app-bar app color="primary" class="white--text" clipped-left>
        <v-app-bar-nav-icon
          color="white"
          aria-label="Menu"
          @click="menuVisible = !menuVisible"
        ></v-app-bar-nav-icon>
        <v-toolbar-title>Jeff</v-toolbar-title>
      </v-app-bar>

      <v-content>
        <v-container fluid>
          <transition name="fade-transition" mode="out-in">
            <router-view></router-view>
          </transition>
        </v-container>
      </v-content>

      <v-footer app inset class="text-center">
        <div style="width: 100%;">{{ $t("app.footer") }}</div>
      </v-footer>
      <v-snackbar v-model="snackbarShow" :timeout="4000">
        <span>{{ snackbarMessage }}</span>
        <v-btn text small color="red" @click="snackbarShow = false">{{
          $t("commands.close")
        }}</v-btn>
      </v-snackbar>
      <v-snackbar v-model="isUpdateAvailable" :timeout="0">
        <span>{{ $t("app.update") }}</span>
        <v-btn text small color="primary" @click="updateAvailable">{{
          $t("commands.refresh")
        }}</v-btn>
      </v-snackbar>
      <Introduction
        v-if="
          this.$store.state.userSettings.introductionState > 0 && isAuthorized
        "
      ></Introduction>
      <UpdateMessage v-if="isAuthorized"></UpdateMessage>
    </div>
  </v-app>
</template>

<style lang="scss"></style>

<script>
import { mapState, mapGetters } from "vuex";
import Introduction from "@/components/dialogs/introduction/Introduction.vue";
import UpdateMessage from "@/components/dialogs/UpdateMessageDialog.vue";

export default {
  name: "App",
  components: {
    Introduction,
    UpdateMessage
  },
  data: () => ({
    menuVisible: null,
    loading: true
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
      let state = this.$store.state.userSettings.introductionState;
      let contents = [
        {
          name: this.$t("navigation.dashboard"),
          icon: "dashboard",
          path: "/dashboard"
        }
      ];
      if (this.userInHousehold) {
        if (this.$store.state.userSettings.calendarEnabled && state <= 0)
          contents.push({
            name: this.$t("navigation.calendar"),
            icon: "event",
            path: "/calendar"
          });
        if (state >= 3 || state <= 0) {
          contents.push({
            name: this.$t("navigation.shopping"),
            icon: "shopping_cart",
            path: "/shopping",
            show: true
          });
        }
        if (state >= 5 || state <= 0) {
          contents.push({
            name: this.$t("navigation.finances"),
            icon: "money",
            path: "/finances",
            show: true
          });
        }
        if (state >= 7 || state <= 0) {
          contents.push({
            name: this.$t("navigation.tasks"),
            icon: "list",
            path: "/tasks",
            show: true
          });
        }
        if (state >= 9 || state <= 0) {
          contents.push({
            name: this.$t("navigation.household"),
            icon: "people",
            path: "/household",
            show: true
          });
        }
        if (state >= 11 || state <= 0) {
          contents.push({
            name: this.$t("navigation.settings"),
            icon: "settings",
            path: "/settings",
            show: true
          });
        }
      }
      return contents;
    },
    ...mapState([
      "userEmail",
      "userFirstName",
      "userLastName",
      "userInHousehold",
      "snackbarMessage",
      "updateAvailable",
      "offline",
      "profilePictureData"
    ]),
    ...mapState("userSettings", ["lang", "_initialized"]),
    ...mapGetters(["isUpdateAvailable", "hasProfilePicture", "isAuthorized"])
  },
  watch: {
    _initialized(val) {
      if (val) {
        this.loadLang();
      }
    }
  },
  async created() {
    await this.$store.dispatch("userSettings/sync");
    this.$vuetify.theme.dark = this.$store.state.userSettings.darkMode;
  },
  async mounted() {
    if (this._initialized) {
      this.loadLang();
    }
    await this.$store.dispatch("fetchProfileImg");
  },
  methods: {
    toggleMenu() {
      this.menuVisible = !this.menuVisible;
    },
    async loadLang() {
      await this.$store.dispatch("userSettings/loadLocaleMessages");
      this.$i18n.locale = this.lang;
      this.loading = false;
    }
  }
};
</script>
