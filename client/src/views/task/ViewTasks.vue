<template>
  <v-card
    style="max-width: 800px; margin: 0 auto"
    class="pa-4"
    :class="$vuetify.breakpoint.mdAndUp ? 'mt-8' : ''"
    :elevation="$vuetify.breakpoint.smAndDown ? 0 : 6"
  >
    <v-fab-transition>
      <v-btn
        v-if="$vuetify.breakpoint.mdAndUp && showFab"
        color="accent"
        style="margin-right: 1em"
        fab
        absolute
        top
        right
        @click="editDialog = true"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-fab-transition>
    <v-fab-transition>
      <v-btn
        v-if="$vuetify.breakpoint.smAndDown && showFab"
        color="accent"
        style="margin-right: 1em; margin-bottom: 4em"
        fab
        fixed
        bottom
        right
        @click="editDialog = true"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-fab-transition>
    <!--SINGLE TASKS -->
    <div class="title">{{ $t("tasks.view.singleTasks") }}</div>
    <TaskList
      :tasks="singleTasks"
      :user-images="userImages"
      empty-icon="work_outline"
      :empty-text="$t('tasks.view.singleTasksEmpty')"
      @edit="edit"
    ></TaskList>

    <!--TIMED TASKS -->
    <div class="title">{{ $t("tasks.view.repeatingTasks") }}</div>
    <TaskList
      :tasks="repeatingTasks"
      :user-images="userImages"
      empty-icon="golf_course"
      :empty-text="$t('tasks.view.repeatingTasksEmpty')"
      @edit="edit"
    ></TaskList>

    <!--ON DEMAND TASKS -->
    <div class="title">{{ $t("tasks.view.onDemand") }}</div>
    <TaskList
      :tasks="onDemandTasks"
      :user-images="userImages"
      empty-icon="access_alarm"
      :empty-text="$t('tasks.view.onDemandTasksEmpty')"
      color="accent"
      @edit="edit"
    ></TaskList>
    <EditTask
      :dialog="editDialog"
      :edit-task="editTask"
      @close="close"
      @closeUpdate="closeAndUpdate"
    ></EditTask>
  </v-card>
</template>
<script>
import { mapGetters } from "vuex";
import TaskList from "@/components/tasks/TaskList.vue";
import EditTask from "@/components/tasks/EditTask.vue";

export default {
  name: "ViewTasks",
  components: {
    TaskList,
    EditTask
  },
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

  data: () => ({
    editDialog: false,
    editTask: null,
    showFab: false
  }),
  computed: {
    ...mapGetters("tasks", ["repeatingTasks", "onDemandTasks", "singleTasks"])
  },
  mounted() {
    this.showFab = false;
    setTimeout(() => (this.showFab = true), 200);
  },
  methods: {
    edit(task) {
      this.editTask = task;
      this.editDialog = true;
    },
    close() {
      this.editDialog = false;
      this.editTask = null;
    },
    closeAndUpdate() {
      this.$emit("update");
      this.editDialog = false;
      this.editTask = null;
    }
  }
};
</script>
