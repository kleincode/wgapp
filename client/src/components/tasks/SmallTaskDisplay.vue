<template>
  <div style=" width: 100%;">
    <v-card
      v-if="!!task"
      class="mt-2 mb-2"
      :class="$vuetify.theme.isDark ? 'secondary' : 'white'"
      :elevation="6"
      style="height: 100%;"
      :style="'color: ' + textColor"
      :dark="!$vuetify.theme.isDark"
    >
      <v-row align="center" class="ma-0">
        <v-col cols="2">
          <v-icon
            class="pa-0 ma-0"
            :style="'font-size: ' + iconsize"
            :color="textColor"
            x-large
            >{{ getIcon(task.icon) }}</v-icon
          >
        </v-col>
        <v-col cols="8" class="text-left">
          <center class="overline">{{ taskMode }}</center>
          <div
            style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
          >
            {{ task.name }}
          </div>
          <v-chip small>
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
          <v-btn
            v-if="$vuetify.breakpoint.mdAndUp"
            :color="textColor"
            icon
            @click="$emit('triggerreminder', task)"
          >
            <v-icon>notifications_active</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="2" class="pa-0 ma-0">
          <v-sheet
            :color="cardColor"
            style="border-radius: 0px; height:100px; margin-right: -1px !important"
          >
            <v-row style="height: 100%" justify="center" align="center">
              <v-col cols="12" class="pa-0">
                <v-btn
                  :color="textColor"
                  icon
                  @click="$emit('checktask', task)"
                >
                  <v-icon v-if="task.checked">check_box</v-icon>
                  <v-icon v-else>check_box_outline_blank</v-icon>
                </v-btn>
              </v-col>
              <v-col
                v-if="$vuetify.breakpoint.smAndDown"
                cols="12"
                class="pa-0"
              >
                <v-btn
                  :color="textColor"
                  icon
                  @click="$emit('triggerreminder', task)"
                >
                  <v-icon>notifications_active</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-sheet>
        </v-col>
      </v-row>
    </v-card>
    <v-card
      v-else
      class="main-task text-center secondary lighten-2"
      :elevation="6"
    >
      <div class="overline text--disabled">{{ $t("tasks.duetoday") }}</div>
      <v-icon class="text--disabled" style="font-size: 10em" x-large
        >bathtub</v-icon
      >
      <div class="font-regular pt-4 display-1 text--disabled">
        {{ $t("tasks.chill") }}
      </div>
      <div class="caption pt-2 text--disabled">--:--</div>
      <v-divider class="mt-4 mb-4"></v-divider>
      <v-chip disabled style="width: 30%">
        <v-avatar left></v-avatar>
      </v-chip>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import icons from "@/assets/icons.js";

export default {
  name: "LargeTaskDisplay",
  props: {
    task: {
      type: Object,
      default: () => null
    },
    userImages: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({}),
  computed: {
    textColor() {
      if (this.$vuetify.theme.isDark) return "#FFFFFF";
      return "#111111";
    },
    cardColor() {
      if (this.task.missed) return "red";
      if (this.task.checked) return "success";
      return "accent";
    },
    iconsize() {
      switch (this.$vuetify.breakpoint.name) {
        case "xl":
          return "3em";
        case "lg":
          return "3em";
        case "md":
          return "3em";
        case "sm":
          return "3em";
        default:
          return "2em";
      }
    },
    taskMode() {
      switch (this.task.mode) {
        case 0:
          return this.$t("tasks.modes.single");
        case 1:
          return this.$t("tasks.modes.repeating");
        default:
          return this.$t("tasks.modes.ondemand");
      }
    },
    ...mapGetters(["getUserName", "getUserInitials"]),
    ...mapGetters("userSettings", ["formatDateRelative"])
  },
  methods: {
    getIcon: index => icons[index]
  }
};
</script>

<style></style>
