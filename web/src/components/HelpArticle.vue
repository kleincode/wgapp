<template>
  <v-container style="min-height: 83vh">
    <div class="display-2 text-center mt-12 mb-6">{{ title }}</div>
    <v-row justify="center"
      ><v-col cols="12" md="10" lg="8" class="text-center">
        <v-card class="pa-6 text-left">
          <v-breadcrumbs :items="path" large>
            <template v-slot:divider>
              <v-icon>mdi-chevron-right</v-icon>
            </template>
          </v-breadcrumbs>
          <slot name="content"></slot>
        </v-card>
        <p class="mt-12 title">
          Was this article helpful?
        </p>
        <v-btn text class="mr-4" outlined>Yes</v-btn>
        <v-btn text outlined>No</v-btn>
      </v-col></v-row
    >
  </v-container>
</template>
<script>
export default {
  name: "HelpArticle",
  props: {
    title: {
      type: String,
      default: "Widget"
    },
    path: {
      type: Object,
      default: () => {}
    }
  }
};
</script>
