<template>
  <v-container>
    <router-view :user-images="userImages" :loading="loading"></router-view>
    <v-bottom-navigation
      :style="{ left: $vuetify.application.left + 'px' }"
      grow
      fixed
      color="primary"
      class="elevation-24"
    >
      <v-btn :to="{ name: 'TasksOverview' }" exact>
        <span>{{ $t("tasks.tabs.overview") }}</span>
        <v-icon>bar_chart</v-icon>
      </v-btn>
      <v-btn :to="{ name: 'ViewTasks' }" exact>
        <span>{{ $t("tasks.tabs.list") }}</span>
        <v-icon>list</v-icon>
      </v-btn>
      <v-btn :to="{ name: 'TasksLog' }" exact>
        <span>{{ $t("tasks.tabs.log") }}</span>
        <v-icon>history</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-container>
</template>
<script>
import icons from "@/assets/icons.js";
import { mapState } from "vuex";
import { fetchProfileImg } from "@/assets/profileimagesHelper.js";

export default {
  name: "Tasks",
  data: () => ({
    userImages: {},
    loading: false,
    taskCheckSnack: false,
    checkedTask: null
  }),
  computed: {
    ...mapState("tasks", ["loggedTasks", "tasks"])
  },
  mounted() {
    this.fetchTasks();
  },
  methods: {
    async fetchTasks() {
      this.loading = true;
      try {
        await this.$store.dispatch("tasks/fetchTasks");
        this.tasks.forEach(async task => this.syncUserImages(task));
        this.loggedTasks.forEach(async task => this.syncUserImages(task));
      } catch (err) {
        this.$store.dispatch("showSnackbar", this.$t("tasks.errors.fetchTask"));
        console.warn(err);
      }
      this.loading = false;
    },
    async syncUserImages(task) {
      if (!this.userImages[task.assigned]) {
        this.$set(
          this.userImages,
          task.assigned,
          await fetchProfileImg(task.assigned)
        );
      }
    },
    getIcon: index => icons[index]
  }
};
</script>
<style lang="scss">
.v-carousel__controls__item {
  color: grey !important;
}
</style>
