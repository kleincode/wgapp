<template>
  <div>
    <v-timeline v-if="tasks.length > 0">
      <v-timeline-item
        v-for="(task, i) in tasks"
        :key="i"
        :icon="getIcons()[task.icon]"
      >
        <template v-slot:opposite>
          <span class="subtitle font-weight-bold"
            >{{
              new Date(task.time).toLocaleDateString(
                $store.state.userSettings.locale || undefined
              )
            }}
            <br />
            {{
              new Date(task.time).toLocaleTimeString(
                $store.state.userSettings.locale || undefined,
                { hour: "2-digit", minute: "2-digit" }
              )
            }}</span
          >
        </template>
        <div class="py-4" :class="i % 2 ? 'text-right' : ''">
          <h2 class="display-1 font-weight-light mb-1 primary--text">
            {{ task.name }}
          </h2>
          <div v-if="task.assigned == task.working">
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
              {{ getUserName(task.working) }}
            </v-chip>
          </div>
          <div v-else>
            {{
              $t("tasks.taskCheckedFor", { name: getUserName(task.assigned) })
            }}
            <br />
            <v-chip>
              <v-avatar
                :color="!userImages[task.working] ? 'primary' : ''"
                left
              >
                <v-img
                  v-show="userImages[task.working]"
                  :src="userImages[task.working]"
                ></v-img>
                <span v-show="!userImages[task.working]" class="white--text">
                  {{ getUserInitials(task.working) }}
                </span>
              </v-avatar>
              {{ getUserName(task.working) }}
            </v-chip>
          </div>
        </div>
      </v-timeline-item>
    </v-timeline>
    <div v-else style="text-align: center" class="text--disabled pb-12 pt-8">
      <v-icon style="font-size: 10em" class="text--disabled"
        >format_list_numbered</v-icon
      >
      <br />{{ $t("tasks.log.empty") }}
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import icons from "@/assets/icons.js";
export default {
  name: "TasksLogCard",
  props: {
    loading: {
      type: Boolean,
      default: () => false
    },
    tasks: {
      type: Array,
      default: () => []
    },
    headless: {
      type: Boolean,
      default: () => false
    },
    userImages: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapGetters(["getUserName", "getUserInitials", "getUserSelect"])
  },
  methods: {
    getIcons() {
      return icons;
    }
  }
};
</script>
