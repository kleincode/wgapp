<template>
  <Widget
    title="Finances"
    :content-pad="false"
    :context-items="contextItems"
    :loading="loading"
    @context-action="contextAction"
  >
    <template v-if="expenses.length">
      <v-carousel
        cycle
        hide-delimiter-background
        :show-arrows="false"
        height="120"
        delimiter-icon="fiber_manual_record"
        class="bottom-carousel"
        :interval="9000"
      >
        <v-carousel-item
          v-for="(expense, i) in expenses"
          :key="i"
          class="pl-5 pr-5"
        >
          <v-list-item class="mb-4">
            <v-list-item-avatar>
              <v-icon large>event_note</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="task-entry">
                {{ expense.name || "Unnamed expense" }}
                <div class="overline pl-2 pt-1">
                  - {{ expense.date || "Today" }}
                </div>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-carousel-item>
      </v-carousel>
      <div style="height: 120px;"></div>
    </template>
    <div v-else style="text-align: center" class="text--disabled pb-4">
      <v-icon style="font-size: 4em" class="text--disabled">money</v-icon>
      <br />Why don't you buy something?
    </div>
  </Widget>
</template>

<script>
import icons from "@/assets/icons.js";
import { mapGetters } from "vuex";
import Widget from "./Widget";

export default {
  name: "FinancesWidget",
  components: {
    Widget
  },
  data: () => ({
    loading: false,
    lastUpdate: null,
    expenses: []
  }),
  computed: {
    contextItems() {
      return [
        {
          action: "refresh",
          text: "Refresh",
          icon: "refresh",
          subtext:
            "Updated " +
            (this.lastUpdate ? this.formatTimeHM(this.lastUpdate) : "never")
        },
        {
          action: "finances",
          text: "Finances page",
          icon: "money"
        },
        {
          action: "settings",
          text: "Widget Settings",
          icon: "settings"
        }
      ];
    },
    ...mapGetters(["getUserName", "getUserInitials"]),
    ...mapGetters("userSettings", ["formatTimeHM"])
  },
  mounted() {
    this.update();
  },
  methods: {
    async update() {
      this.loading = true;
      try {
        console.log("[TODO] update");
        this.lastUpdate = new Date();
      } catch (err) {
        if (typeof err === "string") {
          this.$store.dispatch("showSnackbar", err);
        }
      }
      this.loading = false;
    },
    contextAction(item) {
      switch (item.action) {
        case "refresh":
          this.update();
          break;
        case "finances":
          this.$router.push({ name: "Finances" });
          break;
        case "settings":
          this.$router.push({ name: "DashboardSettings", hash: "#finances" });
      }
    },
    getIcon: index => icons[index]
  }
};
</script>
<style lang="scss" scoped>
.bottom-carousel {
  position: absolute;
  bottom: 0;
}
.task-entry {
  display: flex;
}
</style>
