<template>
  <v-container>
    <router-view :user-images="userImages" :loading="loading"></router-view>
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
