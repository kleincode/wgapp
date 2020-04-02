<template>
  <v-app>
    <v-navigation-drawer app clipped v-model="menuVisible">
      <v-list dense nav>
        <v-list-item two-line class="px-0">
          <v-list-item-avatar>
            <img src="https://randomuser.me/api/portraits/men/81.jpg" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="title">WG App</v-list-item-title>
            <v-list-item-subtitle>Navigation</v-list-item-subtitle>
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
          <v-btn block color="red lighten-2">Logout</v-btn>
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
  </v-app>
</template>

<style lang="scss"></style>

<script>
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
        name: "Members",
        icon: "people",
        path: "/household/members"
      },
      {
        name: "Settings",
        icon: "settings",
        path: "/settings"
      }
    ]
  }),
  methods: {
    toggleMenu() {
      this.menuVisible = !this.menuVisible;
    }
  }
};
</script>
