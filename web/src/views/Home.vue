<template>
  <div>
    <v-row style="min-height: 93vh" align="center" justify="center">
      <v-col cols="12" md="3" class="pl-2 pr-2">
        <div>
          <v-img
            :src="require('../assets/avatar.webp')"
            class="my-3"
            contain
            height="300"
          />
        </div>
      </v-col>

      <v-col
        cols="12"
        md="3"
        class="pl-2 pr-2"
        :class="$vuetify.breakpoint.smAndDown ? 'text-center' : ''"
      >
        <p class="display-1 font-weight-regular">
          Hey, I'm
        </p>
        <h1 class="display-4 font-weight-bold mb-3">
          Jeff.
        </h1>

        <p class="title font-weight-regular">
          Your Personal Home Organizer
        </p>
      </v-col>
      <v-col cols="12" class="text-center" style="max-height: 100px">
        <v-btn
          x-large
          icon
          color="secondary lighten-4"
          @click="
            $vuetify.goTo('#introduction', {
              duration: 500,
              easing: 'easeInOutCubic'
            })
          "
          ><v-icon style="font-size: 5em">keyboard_arrow_down</v-icon></v-btn
        >
      </v-col>
    </v-row>
    <v-row id="introduction" justify="center">
      <v-col cols="12" md="11" lg="9" class="mt-12 mb-12">
        <v-card tile color="primary" class="pl-5 pr-5"
          ><v-card-text class="white--text"
            ><v-row
              ><v-col cols="12" md="6" lg="4"
                ><h1 class="display-4">Why do you need Jeff?</h1></v-col
              >
              <v-col cols="12" md="6" lg="8"
                ><p class="headline">
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                  diam nonumy eirmod tempor invidunt ut labore et dolore magna
                  aliquyam erat, sed diam voluptua. At vero eos et accusam et
                  justo duo dolores et ea rebum. Stet clita kasd gubergren, no
                  sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem
                  ipsum dolor sit amet, consetetur sadipscing elitr.
                </p>
                <v-btn class="mt-4" rounded>Lean More</v-btn>
              </v-col>
            </v-row></v-card-text
          ></v-card
        >
      </v-col>
      <v-col cols="12" md="8" class="mt-12 mb-12"
        ><div class="display-3 text-center" style="line-height: 1.6;">
          Jeff runs on
          <span class="font-weight-bold">every</span>
          device, no matter what.
        </div>
        <div class="title text-center text--secondary">
          It is build as a Progressive Web App (PWA) so it runs as a website but
          looks like an app. That way we will never ever have any compatibality
          issues. Fancy isn't it?
        </div>
      </v-col>
    </v-row>
    <v-card class="mt-12 white--text" color="#04182d" style="min-height: 400px">
      <v-row justify="center">
        <v-col cols="12" class="pt-12 text-center"
          ><div class="display-4 mb-7">Jeff's Features</div>
        </v-col>
        <v-col cols="12" md="6" lg="3" class="pl-12 pr-12 text-center"
          ><h1 class="headline mb-3">Dashboard</h1>
          <v-divider color="white" class="mb-2"></v-divider>
          <p class="text-left">
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua.
          </p>
        </v-col>
        <v-col cols="12" md="6" lg="3" class="pl-12 pr-12 text-center"
          ><h1 class="headline mb-3">Shopping List</h1>
          <v-divider color="white" class="mb-2"></v-divider>
          <p class="text-left">
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua.
          </p>
        </v-col>
        <v-col cols="12" md="6" lg="3" class="pl-12 pr-12 text-center"
          ><h1 class="headline mb-3">Calendar</h1>
          <v-divider color="white" class="mb-2"></v-divider>
          <p class="text-left">
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua.
          </p>
        </v-col>
        <v-col cols="12" md="6" lg="3" class="pl-12 pr-12 text-center"
          ><h1 class="headline mb-3">Finances</h1>
          <v-divider color="white" class="mb-2"></v-divider>
          <p class="text-left">
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua.
          </p>
        </v-col>
        <v-col cols="12" md="6" lg="3" class="pl-12 pr-12 text-center"
          ><h1 class="headline mb-3">Tasks</h1>
          <v-divider color="white" class="mb-2"></v-divider>
          <p class="text-left">
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua.
          </p>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "Home"
};
</script>
