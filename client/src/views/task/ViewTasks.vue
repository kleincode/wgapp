<template>
  <div>
    <!--TIMED TASKS -->
    <div class="title">{{ $t("tasks.upcoming.timed") }}</div>
    <v-list v-if="timedTasks.length > 0">
      <v-list-item
        v-for="(task, i) in timedTasks"
        :key="'task-' + i"
        :class="task.missed ? 'red' : ''"
      >
        <v-list-item-avatar>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon
                :color="task.mode == 1 || task.missed ? '' : 'primary'"
                x-large
                v-on="on"
                >{{ getIcons()[task.icon] }}</v-icon
              >
            </template>
            <span>{{
              task.mode == 1
                ? $t("tasks.upcoming.repeatingTaskDescription")
                : $t("tasks.upcoming.singleTaskDescription")
            }}</span>
          </v-tooltip>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title class="pb-2 task-entry">
            {{ task.name }}
            <div class="overline pl-2 pt-1">- {{ getTimeDisplay(task) }}</div>
          </v-list-item-title>
          <v-list-item-subtitle>
            <v-chip>
              <v-avatar
                :color="!userImages[task.assigned] ? 'primary' : ''"
                left
              >
                <v-img
                  v-show="userImages[task.assigned]"
                  :src="userImages[task.assigned]"
                ></v-img>
                <span v-show="!userImages[task.assigned]" class="white--text">
                  {{ getUserInitials(task.assigned) }}
                </span>
              </v-avatar>
              {{ getUserName(task.assigned) }}
            </v-chip>
          </v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-icon>
          <v-hover>
            <v-btn icon :to="{ name: 'EditTask', params: { id: task.id } }">
              <v-icon>edit</v-icon>
            </v-btn>
          </v-hover>
        </v-list-item-icon>
      </v-list-item>
    </v-list>
    <div v-else style="text-align: center" class="text--disabled pb-12 pt-8">
      <v-icon style="font-size: 10em" class="text--disabled"
        >golf_course</v-icon
      >
      <br />{{ $t("tasks.upcoming.repeatingTasksEmpty") }}
    </div>

    <!--ON DEMAND TASKS -->
    <div class="title">{{ $t("tasks.upcoming.onDemand") }}</div>
    <v-list v-if="onDemandTasks.length > 0">
      <v-list-item
        v-for="(task, i) in onDemandTasks"
        :key="'task-' + i"
        :class="task.missed ? 'red' : ''"
      >
        <v-list-item-avatar>
          <v-icon color="warning" x-large>{{ getIcons()[task.icon] }}</v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title class="pb-2 task-entry">
            {{ task.name }}
            <div class="overline pl-2 pt-1">
              - {{ $t("tasks.upcoming.last") }}:
              {{ formatDateRelative(task.lastExecution) }}
            </div>
          </v-list-item-title>
          <v-list-item-subtitle>
            <v-chip>
              <v-avatar
                :color="!userImages[task.assigned] ? 'primary' : ''"
                left
              >
                <v-img
                  v-show="userImages[task.assigned]"
                  :src="userImages[task.assigned]"
                ></v-img>
                <span v-show="!userImages[task.assigned]" class="white--text">
                  {{ getUserInitials(task.assigned) }}
                </span>
              </v-avatar>
              {{ getUserName(task.assigned) }}
            </v-chip>
          </v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-icon>
          <v-hover>
            <v-btn icon :to="{ name: 'EditTask', params: { id: task.id } }">
              <v-icon>edit</v-icon>
            </v-btn>
          </v-hover>
        </v-list-item-icon>
      </v-list-item>
    </v-list>
    <div v-else style="text-align: center" class="text--disabled pb-12 pt-8">
      <v-icon style="font-size: 10em" class="text--disabled"
        >access_alarm</v-icon
      >
      <br />{{ $t("tasks.upcoming.onDemandTasksEmpty") }}
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import icons from "@/assets/icons.js";
export default {
  name: "UpcomingTasksCard",
  props: {
    loading: {
      type: Boolean,
      default: () => false
    },
    userImages: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapGetters(["getUserName", "getUserInitials"]),
    ...mapGetters("userSettings", ["formatDateRelative"]),
    ...mapGetters("tasks", ["getTodaysTasks", "onDemandTasks", "timedTasks"])
  },
  methods: {
    getTimeDisplay(task) {
      if (!task.missed) {
        return this.formatDateRelative(task.nextDueDay);
      } else {
        if (task.mode == 1) {
          //repeating display last due day
          return this.formatDateRelative(task.lastDueDay);
        } else {
          //single: display the one and only time
          return this.formatDateRelative(task.dueDay);
        }
      }
    },
    getIcons() {
      return icons;
    }
  }
};
</script>
<style>
.task-entry {
  display: flex;
}
</style>
