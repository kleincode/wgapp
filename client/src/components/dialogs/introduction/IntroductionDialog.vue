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
          <v-row
            class="ml-4 mr-4"
            :class="isDeviceSmall ? '' : 'fill-height'"
            :align="isDeviceSmall ? 'start' : 'center'"
            justify="center"
          >
            <v-col cols="4" md="4" lg="3" :class="slide.last ? '' : 'mb-8'">
              <v-img src="@/assets/logo.png" class=""></v-img>
            </v-col>
            <v-col cols="12" md="7" lg="7">
              <h1 class="fancytitle" :class="getTitleSize">
                {{ slide.text }}
              </h1>
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
                  <v-btn color="secondary" text @click="close">
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
        text: "But first, let's create a household for you.",
        subtext:
          "If someone already created your household please join this household.",
        color: "red lighten-1",
        last: true
      }
    ]
  }),
  computed: {
    introductionState: {
      get() {
        return this.$store.state.userSettings.introductionState;
      },
      set(value) {
        this.$store.commit("userSettings/set_key", {
          key: "introductionState",
          value
        });
      }
    },
    getTitleSize() {
      if (this.$vuetify.breakpoint.name == "sm") {
        return "small";
      } else if (this.$vuetify.breakpoint.name == "xs") {
        return "tiny";
      }
      return "big";
    },
    isDeviceSmall() {
      return (
        this.$vuetify.breakpoint.name == "sm" ||
        this.$vuetify.breakpoint.name == "xs"
      );
    }
  },
  methods: {
    join() {
      this.$router.push({ path: "/household/join" });
      this.dialog = false;
    },
    create() {
      this.$router.push({ path: "/household/create" });
      this.dialog = false;
    },
    close() {
      this.introductionState = 0;
      this.dialog = false;
    }
  }
};
</script>

<style>
.tiny {
  font-size: 1.5rem !important;
  line-height: 2rem;
}
.small {
  font-size: 2rem !important;
  line-height: 2rem;
}
.big {
  font-size: 3.5rem !important;
  line-height: 3.4rem;
}
.fancytitle {
  font-weight: 400;
  letter-spacing: initial !important;
  font-family: "Work Sans", sans-serif !important;
}
</style>
