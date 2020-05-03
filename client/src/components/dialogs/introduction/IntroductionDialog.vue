<template>
  <v-dialog v-model="dialog" persistent width="1000">
    <v-carousel
      v-model="slide"
      height="550"
      hide-delimiter-background
      show-arrows-on-hover
      prev-icon=""
      :next-icon="slide == 3 ? '' : 'keyboard_arrow_right'"
    >
      <v-carousel-item v-for="(slide, i) in slides" :key="i">
        <v-sheet :color="slide.color" height="100%">
          <v-row class="fill-height ml-4 mr-4" align="center" justify="center">
            <v-col cols="3" md="6" lg="3">
              <v-img src="@/assets/logo.png" class="ma-2"></v-img>
            </v-col>
            <v-col cols="9" md="6" lg="7">
              <div class="display-2">{{ slide.text }}</div>
              <div class="subtitle-1 mt-4">{{ slide.subtext }}</div>
              <v-row v-if="slide.last" align="center">
                <v-col cols="12" md="6">
                  <v-btn color="secondary" block @click="join">
                    join household
                  </v-btn>
                </v-col>
                <v-col cols="12" md="6">
                  <v-btn color="secondary" block @click="create">
                    create household
                  </v-btn>
                </v-col>
                <v-col cols="12" class="text-center">
                  <v-btn color="secondary" text @click="dialog = false">
                    close introduction
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-sheet>
      </v-carousel-item>
    </v-carousel>
  </v-dialog>
</template>

<script>
export default {
  name: "IntroductionDialog",
  data: () => ({
    slide: 0,
    dialog: true,
    slides: [
      {
        text: "Hello I'm Jeff. Nice to meet you!",
        color: "primary"
      },
      {
        text: "I will be your new personal home assistant.",
        color: "warning"
      },
      {
        text: "I'm gonna show you my most important features.",
        color: "pink darken-2"
      },
      {
        text: "But first, we will create a household for you.",
        subtext:
          "If someone already created your household please join this household.",
        color: "red lighten-1",
        last: true
      }
    ]
  }),
  methods: {
    join() {
      this.$router.push({ path: "/household/join" });
      this.dialog = false;
    },
    create() {
      this.$router.push({ path: "/household/create" });
      this.dialog = false;
    }
  }
};
</script>

<style></style>
