<template>
  <Widget
    title="Tasks"
    :content-pad="false"
    :context-items="contextItems"
    :loading="loading"
    @context-action="contextAction"
  >
    <v-carousel
      cycle
      hide-delimiter-background
      :show-arrows="false"
      height="120"
      delimiter-icon="fiber_manual_record"
      class="bottom-carousel"
      :interval="10000"
    >
      <v-carousel-item
        v-for="(task, i) in getTodaysTasks"
        :key="i"
        class="pl-5 pr-5"
      >
        <v-list-item class="mb-4">
          <v-list-item-avatar>
            <v-icon large :color="task.missed ? 'red' : ''">{{
              task.icon || "event_note"
            }}</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title
              class="task-entry"
              :color="task.missed ? 'red' : ''"
            >
              {{ task.name || "Unnamed task" }}
              <div
                class="overline pl-2 pt-1"
                :class="task.missed ? 'red--text' : ''"
              >
                - {{ task.time || "Today" }}
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
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-carousel-item>
    </v-carousel>
    <div style="height: 120px;"></div>
  </Widget>
</template>

<script>
import { mapGetters } from "vuex";
import Widget from "./Widget";

export default {
  name: "TasksWidget",
  components: {
    Widget
  },
  data: () => ({
    loading: false,
    contextItems: [
      {
        action: "refresh",
        text: "Refresh"
      },
      {
        action: "settings",
        text: "Settings"
      }
    ]
  }),
  computed: {
    ...mapGetters("tasks", ["getTodaysTasks"]),
    ...mapGetters(["getUserName", "getUserInitials"])
  },
  mounted() {
    this.update();
  },
  methods: {
    async update() {
      this.loading = true;
      try {
        await this.$store.dispatch("tasks/fetchTasks");
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
          console.log("TODO");
          break;
        case "settings":
          this.$router.push({ name: "DashboardSettings", hash: "#tasks" });
      }
    }
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
