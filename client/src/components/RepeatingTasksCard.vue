<template>
  <v-card :elevation="6" :loading="loading" style="height: 100%">
    <v-card-title>
      <h2 class="title">{{ $t("tasks.repeatingTasks.title") }}</h2>
    </v-card-title>
    <v-card-text>
      <v-list v-if="repeatingTasks.length > 0">
        <v-list-item v-for="(task, i) in repeatingTasks" :key="'task-' + i">
          <v-list-item-avatar>
            <v-icon x-large>{{ getIcons()[task.icon] }}</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title class="pb-2 task-entry">
              {{ task.name }}
              <div class="overline pl-2 pt-1">
                - {{ formatDateRelative(task.nextDueDay) }}
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
        <v-icon style="font-size: 10em" class="text--disabled">refresh</v-icon>
        <br />{{ $t("tasks.repeatingTasks.empty") }}
      </div>
    </v-card-text>
  </v-card>
</template>
<script>
import { mapGetters } from "vuex";
import icons from "@/assets/icons.js";
export default {
  name: "RepeatingTasksCard",
  props: {
    loading: {
      type: Boolean,
      default: () => false
    },
    repeatingTasks: {
      type: Array,
      default: () => []
    },
    userImages: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapGetters(["getUserName", "getUserInitials"]),
    ...mapGetters("userSettings", ["formatDateRelative"])
  },
  methods: {
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
