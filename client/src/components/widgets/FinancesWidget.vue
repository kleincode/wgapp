<template>
  <Widget
    :title="$t('widgets.finances.title')"
    :content-pad="false"
    :context-items="contextItems"
    :loading="loading"
    large
    @context-action="contextAction"
  >
    <template v-if="expenses.length">
      <v-carousel
        cycle
        hide-delimiter-background
        :show-arrows="false"
        height="160"
        delimiter-icon="fiber_manual_record"
        class="bottom-carousel"
        :interval="9000"
        :dark="$vuetify.theme.dark"
        :light="!$vuetify.theme.dark"
      >
        <v-carousel-item
          v-for="(expense, i) in expenses"
          :key="i"
          class="pl-5 pr-5"
        >
          <v-list-item class="mb-4">
            <v-list-item-content>
              <v-list-item-title class="task-entry">
                {{
                  expense.description || $t("widgets.finances.unnamedExpense")
                }}
                <div class="overline pl-2 pt-1">
                  -
                  {{ formatDateRelative(expense.date) || $t("general.today") }}
                </div>
              </v-list-item-title>
              <v-list-item-subtitle>
                <v-chip class="mt-1" :color="expense.receipt ? 'primary' : ''">
                  {{ formatCurrency(expense.amount / 100) }}
                </v-chip>
                <v-chip class="mt-1 ml-3">
                  <v-avatar
                    style="max-height: 80%; max-width: 90%"
                    left
                    color="green"
                  >
                    <span class="white--text">{{
                      getUserInitials(expense.uid)
                    }}</span>
                  </v-avatar>
                  {{ getUserName(expense.uid) }}
                </v-chip>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-carousel-item>
      </v-carousel>
      <div style="height: 160px;"></div>
    </template>
    <div v-else style="text-align: center" class="text--disabled pb-4">
      <v-icon style="font-size: 4em" class="text--disabled">money</v-icon>
      <br />{{ $t("widgets.finances.empty") }}
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
          text: this.$t("commands.refresh"),
          icon: "refresh",
          subtext: this.$t("widgets.lastUpdated", {
            time: this.lastUpdate
              ? this.formatTimeHM(this.lastUpdate)
              : this.$t("widgets.never")
          })
        },
        {
          action: "finances",
          text: this.$t("widgets.finances.financesPage"),
          icon: "money"
        },
        {
          action: "settings",
          text: this.$t("widgets.settings"),
          icon: "settings"
        }
      ];
    },
    ...mapGetters(["getUserName", "getUserInitials"]),
    ...mapGetters("userSettings", [
      "formatTimeHM",
      "formatCurrency",
      "formatDateRelative"
    ])
  },
  mounted() {
    this.update();
    this.clockIntervalID = setInterval(() => this.update(), 5 * 60 * 1000);
  },
  beforeDestroy() {
    clearInterval(this.clockIntervalID);
  },
  methods: {
    async update() {
      this.loading = true;
      try {
        const now = new Date();
        console.log("update");
        const { data } = await this.$http.get("/_/fetchexpenses", {
          params: {
            mintime: now.setDate(now.getDate() - 3) / 1000
          }
        });
        if (data.success) {
          this.expenses = data.data;
          this.lastUpdate = new Date();
        } else throw data.message;
      } catch (err) {
        if (typeof err === "string") {
          this.$store.dispatch("showSnackbar", err);
        } else console.warn(err);
      }
      this.loading = false;
    },
    contextAction(item) {
      switch (item.action) {
        case "refresh":
          this.update();
          break;
        case "finances":
          this.$router.push({ name: "FinancesOverview" });
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
