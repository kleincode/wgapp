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
        <v-sheet :color="slide" height="100%">
          <v-row
            class="ml-4 mr-4"
            :class="isDeviceSmall ? '' : 'fill-height'"
            :align="isDeviceSmall ? 'start' : 'center'"
            justify="center"
          >
            <v-col cols="9" xs="9" sm="4" md="4" lg="3" class="mb-8">
              <v-img src="@/assets/roomie.svg" class=""></v-img>
            </v-col>
            <v-col cols="12" md="7" lg="7">
              <h1 class="fancytitle" :class="getTitleSize">
                {{ getIntroText(i) }}
              </h1>
            </v-col>
          </v-row>
        </v-sheet>
      </v-carousel-item>
      <v-carousel-item v-if="!userInHousehold">
        <v-sheet color="red lighten-1" height="100%">
          <v-row
            class="ml-4 mr-4"
            :class="isDeviceSmall ? '' : 'fill-height'"
            :align="isDeviceSmall ? 'start' : 'center'"
            justify="center"
          >
            <v-col cols="9" xs="9" sm="4" md="4" lg="3">
              <v-img src="@/assets/roomie.svg" class=""></v-img>
            </v-col>
            <v-col cols="12" md="7" lg="7">
              <h1 class="fancytitle" :class="getTitleSize">
                {{ $t("introduction.createHousehold.text") }}
              </h1>
              <div class="subtitle-1 mt-4">
                {{ $t("introduction.createHousehold.subtext") }}
              </div>
              <v-row align="center">
                <v-col cols="12" md="6">
                  <v-btn color="secondary" block @click="join">
                    {{ $t("dashboard.joinHousehold") }}
                  </v-btn>
                </v-col>
                <v-col cols="12" md="6">
                  <v-btn color="secondary" block @click="create">
                    {{ $t("dashboard.createHousehold") }}
                  </v-btn>
                </v-col>
                <v-col cols="12" class="text-center">
                  <v-btn color="secondary" text @click="close">
                    {{ $t("dashboard.closeIntroduction") }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-sheet>
      </v-carousel-item>
      <v-carousel-item v-if="userInHousehold">
        <v-sheet color="red lighten-1" height="100%">
          <v-row
            class="ml-4 mr-4"
            :class="isDeviceSmall ? '' : 'fill-height'"
            :align="isDeviceSmall ? 'start' : 'center'"
            justify="center"
          >
            <v-col cols="4" md="4" lg="3">
              <v-img src="@/assets/roomie.svg" class=""></v-img>
            </v-col>
            <v-col cols="12" md="7" lg="7">
              <h1 class="fancytitle" :class="getTitleSize">
                {{ $t("introduction.alreadyInHousehold") }}
              </h1>
              <div class="subtitle-1 mt-4">
                {{ $t("introduction.letsGetStarted") }}
              </div>
              <v-row align="center">
                <v-col cols="12">
                  <v-btn color="secondary" block @click="start">
                    {{ $t("introduction.startTour") }}
                  </v-btn>
                </v-col>
                <v-col cols="12" class="text-center">
                  <v-btn color="secondary" text @click="close">
                    {{ $t("introduction.closeIntroduction") }}
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
import { mapState } from "vuex";

export default {
  name: "IntroductionDialog",
  data: () => ({
    slide: 0,
    dialog: true,
    slides: ["primary", "warning", "pink darken-2"]
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
    },
    ...mapState(["userInHousehold"])
  },
  methods: {
    getIntroText(i) {
      return this.$t("introduction.firstDialog[" + i + "]");
    },
    join() {
      this.introductionState = 2;
      this.$router.push({ path: "/household/join" });
      this.dialog = false;
    },
    create() {
      this.introductionState = 2;
      this.$router.push({ path: "/household/create" });
      this.dialog = false;
    },
    start() {
      this.introductionState = 3;
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
