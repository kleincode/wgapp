<template>
  <div style="height: 80%; width:100%">
    <v-card
      v-if="!!task"
      class="main-task text-center"
      :class="cardColor"
      :elevation="6"
      style="height: 100%"
      :style="'color: ' + textColor"
    >
      <v-row align="stretch" style="height: 100%">
        <v-col cols="12" md="6">
          <v-icon style="font-size: 10em" :color="textColor" x-large>{{
            getIcon(task.icon)
          }}</v-icon>
        </v-col>
        <v-col cols="12" md="6">
          <div class="font-regular pt-4 display-1">
            {{ task.name }}
            <br />
            <v-btn :color="textColor" icon @click="$emit('checktask', task)">
              <v-icon v-if="task.checked">check_box</v-icon>
              <v-icon v-else>check_box_outline_blank</v-icon>
            </v-btn>
            <v-btn :color="textColor" icon @click="triggerReminder(task)">
              <v-icon>notifications_active</v-icon>
            </v-btn>
          </div>
          <div class="body-2 pt-2 mb-2">{{ task.time }}</div>
        </v-col>
        <v-col cols="12">
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
  data: () => ({
    textColor: "black"
  }),
  computed: {
    cardColor() {
      if (this.task.missed) return "red";
      if (this.task.checked) return "success";
      return "accent";
    },
    ...mapGetters(["getUserName", "getUserInitials"]),
    ...mapGetters("userSettings", ["formatDateRelative"])
  },
  methods: {
    getIcon: index => icons[index]
  }
};
</script>

<style>
.main-task {
  padding: 2em;
  margin: 2em;
  margin-bottom: 4em;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>
