<template>
  <v-card :elevation="7" :color="error ? 'red' : color">
    <v-card-content class="pa-8">
      <v-row justify="center" align="center">
        <v-col cols="12" md="12" lg="3">
          <v-icon color="white" style="font-size: 6em">{{ icon }}</v-icon>
        </v-col>
        <v-col cols="6" md="6" lg="5">
          <div class="display-4 mb-3">
            {{ value }}
          </div>
          <div class="overline" style="font-size: 1em !important">
            {{ title }}
          </div>
        </v-col>
        <v-col cols="6" md="6" lg="1">
          <v-icon style="font-size: 4em" class="success--text" v-if="trend == 1"
            >trending_up</v-icon
          >
          <v-icon style="font-size: 4em" class="error--text" v-if="trend == -1"
            >trending_down</v-icon
          >
        </v-col>
      </v-row>
    </v-card-content>
  </v-card>
</template>

<script>
export default {
  name: "StatCard",
  props: {
    title: {
      type: String,
      default: () => "Title"
    },
    icon: {
      type: String,
      default: () => "home"
    },
    value: {
      type: Number,
      default: () => 0
    },
    error: {
      type: Boolean,
      default: () => false
    },
    color: {
      type: String,
      default: () => ""
    },
    trend: {
      type: Number,
      default: () => 0
    }
  }
};
</script>
