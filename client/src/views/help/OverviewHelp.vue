<template>
  <v-container>
    <h2 class="mb-4">
      Overview
    </h2>
    <p class="text-justify body-1">
      You need help? We are there for you! Take a look.
    </p>
    <v-row justify="space-around">
      <v-col cols="3">
        <div class="title mb-1">GIF sample</div>
        <div class="subheading">aspect-ration: 2</div>
        <v-img
          src="https://gamespot1.cbsistatic.com/uploads/original/1551/15516546/2943956-7961897803-littl.gif"
          aspect-ratio="2"
        ></v-img>
      </v-col>
      <v-col cols="3">
        <div class="title mb-1">GIF sample</div>
        <div class="subheading">aspect-ration: 1</div>
        <v-img
          src="https://gamespot1.cbsistatic.com/uploads/original/1551/15516546/2943956-7961897803-littl.gif"
          aspect-ratio="1"
        ></v-img>
      </v-col>
      <v-col cols="3">
        <div class="title mb-1">GIF sample</div>
        <div class="subheading">aspect-ration: 0.5</div>
        <v-img
          src="https://gamespot1.cbsistatic.com/uploads/original/1551/15516546/2943956-7961897803-littl.gif"
          aspect-ratio="0.5"
        ></v-img>
      </v-col>
    </v-row>
    <v-card class="warning"><v-card-text>text</v-card-text> </v-card>
  </v-container>
</template>

<script>
export default {
  name: "OverviewHelp"
};
</script>
