<template>
  <div class="page-container">
    <md-app md-mode="fixed" id="outer-app">
      <md-app-toolbar class="md-dense md-primary">
        <div class="md-toolbar-row">
          <md-button
            class="md-icon-button hide-small-and-up"
            @click="toggleMenu"
          >
            <md-icon>menu</md-icon>
          </md-button>

          <span class="md-title">WG App</span>
        </div>
      </md-app-toolbar>

      <!-- Drawer for mobile devices -->
      <md-app-drawer
        :md-active.sync="menuVisible"
        md-permanent="full"
        class="app-drawer hide-small-and-up"
      >
        <md-list>
          <md-list-item @click="toggleMenu">
            <md-icon>{{
              menuVisible ? "keyboard_arrow_left" : "keyboard_arrow_right"
            }}</md-icon>
            <span class="md-list-item-text">Navigation</span>
          </md-list-item>
          <md-list-item
            v-for="(item, i) in menuContents"
            :key="'menu-content' + i"
            :to="item.path"
            @click="menuVisible = false"
          >
            <md-icon>{{ item.icon }}</md-icon>
            <span class="md-list-item-text">{{ item.name }}</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>

      <md-app-content class="outer-app-content">
        <md-app mf-mode="fixed" style="min-height: 100%;" id="inner-app">
          <!-- Drawer for larger (desktop) devices -->
          <md-app-drawer
            :md-active.sync="menuVisible"
            md-permanent="full"
            md-persistent="mini"
            class="app-drawer md-xsmall-hide"
          >
            <md-list>
              <md-list-item @click="toggleMenu">
                <md-icon>{{
                  menuVisible ? "keyboard_arrow_left" : "keyboard_arrow_right"
                }}</md-icon>
                <span class="md-list-item-text">Navigation</span>
              </md-list-item>
              <md-list-item
                v-for="(item, i) in menuContents"
                :key="'menu-content' + i"
                :to="item.path"
              >
                <md-icon>{{ item.icon }}</md-icon>
                <span class="md-list-item-text">{{ item.name }}</span>
              </md-list-item>
            </md-list>
          </md-app-drawer>

          <md-app-content>
            <router-view></router-view>
          </md-app-content>
        </md-app>
      </md-app-content>
    </md-app>
  </div>
</template>

<style lang="scss">
#outer-app {
  min-height: 100vh;
}

.outer-app-content {
  padding: 0 !important;
}

.md-drawer.app-drawer {
  width: 220px;
}

#inner-app .md-app-scroller {
  padding-left: 0 !important;
}

@media (min-width: 600px) {
  .hide-small-and-up {
    display: none !important;
  }
}

.md-list .router-link-active i.md-icon {
  color: var(--md-theme-default-primary-on-background, #448aff);
}
</style>

<script>
export default {
  name: "App",
  data: () => ({
    menuVisible: false,
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
