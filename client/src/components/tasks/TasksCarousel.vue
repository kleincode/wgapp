<template>
  <center>
    <div v-if="taskChunks.length > 0">
      <v-carousel
        v-if="showCarousel"
        cycle
        height="auto"
        hide-delimiter-background
        show-arrows-on-hover
        :show-arrows="taskChunks.length > 1"
        :hide-delimiters="taskChunks.length <= 1"
        class="pb-4"
      >
        <v-carousel-item v-for="(chunk, i) in taskChunks" :key="i">
          <v-row justify="center">
            <v-col v-for="(task, j) in chunk" :key="j" cols="12" md="5" xl="4">
              <LargeTaskDisplay
                v-if="!small"
                :task="task"
                :user-images="userImages"
                @checktask="$emit('checktask', task)"
                @triggerreminder="$emit('triggerreminder', task)"
              ></LargeTaskDisplay>
              <SmallTaskDisplay
                v-else
                :task="task"
                :user-images="userImages"
                @checktask="$emit('checktask', task)"
                @triggerreminder="$emit('triggerreminder', task)"
              ></SmallTaskDisplay>
            </v-col>
          </v-row>
        </v-carousel-item>
      </v-carousel>
      <v-list v-else style="background-color: transparent">
        <v-list-item v-for="(task, j) in tasks" :key="j" class="pa-0">
          <LargeTaskDisplay
            v-if="!small"
            :task="task"
            :user-images="userImages"
            @checktask="$emit('checktask', task)"
          ></LargeTaskDisplay>
          <SmallTaskDisplay
            v-else
            :task="task"
            :user-images="userImages"
            @checktask="$emit('checktask', task)"
          ></SmallTaskDisplay>
        </v-list-item>
      </v-list>
    </div>
    <v-row v-else>
      <v-col cols="12">
        <div v-if="!small" class="text--disabled">
          <p class="display-3">{{ emptyText }}</p>
          <v-icon style="font-size: 5em" class="mb-3">{{ emptyIcon }}</v-icon>
          <p>{{ emptySubText }}</p>
        </div>
        <div v-else class="text--disabled">
          <p class="display-1">{{ emptyText }}</p>
          <v-icon style="font-size: 4em" class="mb-2">{{ emptyIcon }}</v-icon>
          <p>{{ emptySubText }}</p>
        </div>
      </v-col>
    </v-row>
  </center>
</template>

<script>
import LargeTaskDisplay from "@/components/tasks/LargeTaskDisplay.vue";
import SmallTaskDisplay from "@/components/tasks/SmallTaskDisplay.vue";
export default {
  name: "TasksCarousel",
  components: {
    LargeTaskDisplay,
    SmallTaskDisplay
  },
  props: {
    tasks: {
      type: Array,
      default: () => []
    },
    userImages: {
      type: Object,
      default: () => {}
    },
    small: {
      type: Boolean,
      default: () => false
    },
    emptyText: {
      type: String,
      default: () => "Nothing to do"
    },
    emptySubText: {
      type: String,
      default: () => "Nothing to do"
    },
    emptyIcon: {
      type: String,
      default: () => "bathtub"
    }
  },
  computed: {
    taskChunks() {
      var chunk = require("chunk");
      switch (this.$vuetify.breakpoint.name) {
        case "xl":
          return chunk(this.tasks, 3);
        default:
          return chunk(this.tasks, 2);
      }
    },
    showCarousel() {
      return !(
        this.$vuetify.breakpoint.name == "xs" ||
        this.$vuetify.breakpoint.name == "sm"
      );
    }
  }
};
</script>

<style></style>
