<template>
  <Widget
    :title="$t('widgets.tasks.title')"
    :content-pad="false"
    :context-items="contextItems"
    :loading="loading"
    @context-action="contextAction"
  >
    <template v-if="getTodaysTasks.length">
      <v-carousel
        cycle
        hide-delimiter-background
        :show-arrows="false"
        height="120"
        delimiter-icon="fiber_manual_record"
        class="bottom-carousel"
        :interval="10000"
        :dark="$vuetify.theme.dark"
        :light="!$vuetify.theme.dark"
      >
        <v-carousel-item
          v-for="(task, i) in getTodaysTasks"
          :key="i"
          class="pl-5 pr-5"
        >
          <v-list-item class="mb-4">
            <v-list-item-avatar>
              <v-icon large :color="task.missed ? 'red' : 'primary'">{{
                getIcon(task.icon) || "event_note"
              }}</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title
                class="task-entry"
                :color="task.missed ? 'red' : false"
              >
                {{ task.name || $t("widgets.tasks.unnamed") }}
                <div
                  class="overline pl-2 pt-1"
                  :class="task.missed ? 'red--text' : false"
                >
                  - {{ task.time || $t("widgets.tasks.today") }}
                </div>
              </v-list-item-title>
              <v-list-item-subtitle>
                <v-chip class="mt-1">
                  <v-avatar
                    style="max-height: 80%; max-width: 90%"
                    left
                    color="green"
                  >
                    <span class="white--text">{{
                      getUserInitials(task.assigned)
                    }}</span>
                  </v-avatar>
                  {{ getUserName(task.assigned) }}
                </v-chip>
                <v-btn
                  v-if="task.missed"
                  icon
                  class="ml-2 mt-1"
                  @click="triggerReminder(task)"
                >
                  <v-icon>notifications_active</v-icon>
                </v-btn>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-carousel-item>
      </v-carousel>
      <div style="height: 120px;"></div>
    </template>
    <div v-else style="text-align: center" class="text--disabled pb-4">
      <v-icon style="font-size: 4em" class="text--disabled"
        >access_alarm</v-icon
      >
      <br />{{ $t("widgets.tasks.done") }}
    </div>
  </Widget>
</template>

<script>
import icons from "@/assets/icons.js";
import { mapGetters } from "vuex";
import Widget from "./Widget";

export default {
  name: "TasksWidget",
  components: {
    Widget
  },
  data: () => ({
    loading: false,
    lastUpdate: null
  }),
  computed: {
    contextItems() {
      return [
        {
          action: "refresh",
          text: this.$t("commands.refresh"),
          icon: "refresh",
          subtext:
            "Updated " +
            (this.lastUpdate ? this.formatTimeHM(this.lastUpdate) : "never")
        },
        {
          action: "tasks",
          text: this.$t("widgets.tasks.page"),
          icon: "list"
        },
        {
          action: "settings",
          text: this.$t("widgets.settings"),
          icon: "settings"
        }
      ];
    },
    ...mapGetters(["getUserName", "getUserInitials"]),
    ...mapGetters("tasks", ["getTodaysTasks"]),
    ...mapGetters("userSettings", ["formatTimeHM"])
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
        await this.$store.dispatch("tasks/fetchTasks");
        this.lastUpdate = new Date();
      } catch (err) {
        if (typeof err === "string") {
          this.$store.dispatch("showSnackbar", err);
        }
      }
      this.loading = false;
    },
    async triggerReminder(task) {
      this.loading = true;
      try {
        await this.$store.dispatch("tasks/triggerReminder", task);
        this.$store.dispatch(
          "showSnackbar",
          this.$t("widgets.tasks.not") + this.getUserName(task.assigned)
        );
      } catch (err) {
        this.$store.dispatch("showSnackbar", err);
      }
      this.loading = false;
    },
    contextAction(item) {
      switch (item.action) {
        case "refresh":
          this.update();
          break;
        case "tasks":
          this.$router.push({ name: "Tasks" });
          break;
        case "settings":
          this.$router.push({ name: "DashboardSettings", hash: "#tasks" });
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
