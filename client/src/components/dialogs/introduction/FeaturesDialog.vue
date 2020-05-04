<template>
  <v-dialog v-model="dialog" persistent width="1000">
    <v-carousel height="550" hide-delimiters prev-icon="" next-icon="">
      <v-carousel-item>
        <v-sheet :color="color" height="100%">
          <v-row
            class="ml-4 mr-4"
            :class="isDeviceSmall ? '' : 'fill-height'"
            :align="isDeviceSmall ? 'start' : 'center'"
            justify="center"
          >
            <v-col cols="4" md="4" lg="3">
              <v-img src="@/assets/logo.png" class=""></v-img>
            </v-col>
            <v-col cols="12" md="7" lg="7">
              <h1 class="fancytitle" :class="getTitleSize">
                {{ text }}
              </h1>
              <div class="subtitle-1 mt-4">{{ subtext }}</div>
              <v-btn raised class="mt-4" @click="triggerNextState"
                >explore</v-btn
              >
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
  props: {
    text: {
      type: String,
      default: () => ""
    },
    subtext: {
      type: String,
      default: () => ""
    },
    color: {
      type: String,
      default: () => "primary"
    },
    nextState: {
      type: Number,
      default: () => 0
    }
  },
  data: () => ({
    dialog: true
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
    triggerNextState() {
      this.introductionState = this.nextState;
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
