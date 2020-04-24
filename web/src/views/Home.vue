<template>
  <v-container fill-height>
    <v-row>
      <v-col cols="12" md="6" class="pl-2 pr-2">
        <v-layout align-end justify-end>
          <div style="max-width: 50%">
            <v-img
              :src="require('../assets/avatar.webp')"
              class="my-3"
              contain
              height="300"
            />
          </div>
        </v-layout>
      </v-col>

      <v-col
        cols="12"
        md="6"
        class="pb-4 pl-2 pr-2"
        style="position: relative;"
      >
        <div class="headline-text">
          <p class="display-1 font-weight-regular">
            Hey, I'm
          </p>
          <h1 class="display-4 font-weight-bold mb-3">
            Jeff.
          </h1>

          <p class="title font-weight-regular">
            The Personal Home Organizer
          </p>
        </div>
      </v-col>
      <v-col cols="12" class="text-center">
        <v-btn x-large icon color="secondary lighten-4"
          ><v-icon style="font-size: 5em">keyboard_arrow_down</v-icon></v-btn
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Home"
};
</script>
<style>
.headline-text {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
</style>
