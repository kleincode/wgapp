<template>
  <v-card :elevation="7" :color="error ? 'red' : color">
    <v-row justify="center" align="center">
      <v-col cols="12" md="12" lg="3" class="text-center">
        <v-icon color="white" style="font-size: 6em">{{ icon }}</v-icon>
      </v-col>
      <v-col cols="6" md="12" lg="6" class="pl-6">
        <div class="display-4 mb-3">
          {{ value }}
        </div>
        <div class="overline" style="font-size: 1em !important">
          {{ title }}
        </div>
      </v-col>
    </v-row>
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
    }
  }
};
</script>
