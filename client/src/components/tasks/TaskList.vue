<template>
  <v-list v-if="tasks.length > 0">
    <v-list-item
      v-for="(task, i) in tasks"
      :key="'task-' + i"
      :class="task.missed ? 'red' : ''"
    >
      <v-list-item-avatar>
        <v-icon x-large :color="iconColor(task)">{{
          getIcons()[task.icon]
        }}</v-icon>
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title
          class="pb-2"
          :style="$vuetify.breakpoint.smAndDown ? '' : 'display: flex;'"
        >
          {{ task.name }}
          <div class="overline pl-2 pt-1">- {{ getTimeDisplay(task) }}</div>
        </v-list-item-title>
        <v-list-item-subtitle>
          <v-chip>
            <v-avatar :color="!userImages[task.assigned] ? 'primary' : ''" left>
              <v-img
                v-show="userImages[task.assigned]"
                :src="userImages[task.assigned]"
              ></v-img>
              <span v-show="!userImages[task.assigned]" class="white--text">{{
                getUserInitials(task.assigned)
              }}</span>
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
    <v-icon style="font-size: 10em" class="text--disabled">{{
      emptyIcon
    }}</v-icon>
    <br />
    {{ emptyText }}
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import icons from "@/assets/icons.js";

export default {
  name: "TaskList",
  props: {
    tasks: {
      type: Array,
      default: () => []
    },
    userImages: {
      type: Object,
      default: () => {}
    },
    emptyIcon: {
      type: String,
      default: () => "golf_course"
    },
    emptyText: {
      type: String,
      default: () => "No tasks"
    },
    color: {
      type: String,
      default: () => "primary"
    }
  },
  computed: {
    ...mapGetters(["getUserName", "getUserInitials"]),
    ...mapGetters("userSettings", ["formatDateRelative"])
  },
  methods: {
    iconColor(task) {
      if (task.checked) return "success";
      if (task.missed) return "";
      return this.color;
    },
    getTimeDisplay(task) {
      if (task.mode == 2) {
        //on demand: display last execution
        return this.formatDateRelative(task.lastExecution);
      } else if (!task.missed) {
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

<style></style>
