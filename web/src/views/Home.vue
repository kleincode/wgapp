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
    <v-row id="introduction" justify="center" class="ml-2 mr-2">
      <v-col cols="12" md="11" lg="9" class="mt-12 mb-12">
        <v-card tile color="primary" class="pl-5 pr-5"
          ><v-card-text class="white--text"
            ><v-row
              ><v-col cols="12" md="6" lg="4"
                ><h1 class="display-4 font-weight-black">
                  Why do you need Jeff?
                </h1></v-col
              >
              <v-col cols="12" md="6" lg="8"
                ><p class="headline">
                  Are you tired of fights about who did or didn't do what task?
                  Who paid last time? Stop worrying about all of that and let
                  Jeff do the work! He can manage your daily
                  <span class="font-weight-black">tasks</span>,
                  <span class="font-weight-black">finances</span> and
                  <span class="font-weight-black">shopping lists</span>. On top
                  of that he has an integrated
                  <span class="font-weight-black">Google Calendar</span> for
                  your WG events and an
                  <span class="font-weight-black">dashboard</span> where you can
                  keep everything in check. The only thing Jeff can't do is
                  clean the bathroom for you. He is very sorry for that.
                </p>
                <v-btn
                  class="mt-4"
                  rounded
                  @click="
                    $vuetify.goTo('#features', {
                      duration: 500,
                      easing: 'easeInOutCubic'
                    })
                  "
                  >Lean More</v-btn
                >
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
        <v-row justify="center" class="mt-6">
          <v-col cols="4" class="text-center"
            ><v-icon style="font-size: 7em" color="black"
              >smartphone</v-icon
            ></v-col
          >
          <v-col cols="4" class="text-center"
            ><v-icon style="font-size: 7em" color="black">tablet</v-icon></v-col
          >
          <v-col cols="4" class="text-center"
            ><v-icon style="font-size: 7em" color="black"
              >computer</v-icon
            ></v-col
          >
        </v-row>
      </v-col>
    </v-row>
    <v-card class="mt-12 white--text" color="#04182d" style="min-height: 400px">
      <v-row id="features" justify="center">
        <v-col cols="12" class="pt-12 text-center"
          ><div class="display-4 mb-7">Jeff's Features</div>
        </v-col>
        <v-col cols="12" md="11" lg="7"
          ><v-row>
            <v-col
              v-for="(feat, i) in features"
              :key="i"
              cols="12"
              md="6"
              class="pl-12 pr-12 text-center"
              ><h1 class="headline mb-3">{{ feat.headline }}</h1>
              <v-divider color="white"></v-divider>
              <v-img
                :src="require('../assets/' + feat.image)"
                contain
                class="mb-1 mt-1"
                height="300"
              />
              <p class="text-left">
                {{ feat.description }}
              </p>
            </v-col>
            <v-col cols="12" md="6" class="pl-12 pt-12 pr-12 text-right">
              <h1 class="headline mb-3">And even more to come!</h1>
              <p>
                Check out our roadmap for more information:
              </p>
              <v-btn
                color="white"
                outlined
                @click="
                  $vuetify.goTo('#roadmap', {
                    duration: 500,
                    easing: 'easeInOutCubic'
                  })
                "
                >To Roadmap</v-btn
              ></v-col
            >
          </v-row></v-col
        >
      </v-row>
    </v-card>
    <v-row justify="center" class="ml-2 mr-2">
      <v-col cols="12" md="8" class="mt-12 mb-12 text-center"
        ><div class="display-3" style="line-height: 1.6;">
          Interested? Move in with Jeff just by
          <span class="font-weight-bold">signing up</span>!
        </div>
        <div class="title text--secondary">
          Jeff is currently
          <span class="text--primary font-weight-bold">free</span> for everyone.
          Create your account and household and start inviting people. It's that
          simple! (We have even a dark mode..)
        </div>
        <v-btn class="mt-4 mb-12" outlined x-large>
          <v-icon left>mdi-open-in-new</v-icon>Open App</v-btn
        >
        <br />
        <v-chip class="mt-12 mb-12" color="primary"
          ><v-avatar left>
            <v-icon>info</v-icon>
          </v-avatar>
          Currently in Closed Beta</v-chip
        >
        <v-divider class="mt-12"></v-divider>
      </v-col>
      <v-col id="roadmap" cols="12" md="8" class="mt-12 mb-12 text-center">
        <div class="display-4 mb-7">Our Roadmap</div>
        <v-timeline>
          <v-timeline-item
            v-for="(entry, i) in roadmap"
            :key="i"
            :color="entry.color"
            small
          >
            <template v-slot:opposite>
              <span
                :class="`headline font-weight-bold ${entry.color}--text`"
                v-text="entry.year"
              ></span>
            </template>
            <div class="py-4">
              <h2
                :class="`headline font-weight-light mb-4 ${entry.color}--text`"
              >
                {{ entry.title }}
              </h2>
              <div>
                <p class="text-justify">
                  {{ entry.description }}
                </p>
              </div>
            </div>
          </v-timeline-item>
        </v-timeline>
      </v-col>

      <v-col cols="12" md="11" lg="9" class="mt-12 mb-12">
        <v-card tile color="primary" class="pl-5 pr-5"
          ><v-card-text class="white--text"
            ><v-row>
              <v-col class="d-md-none" cols="12" md="6" lg="4"
                ><h1 class="display-4 font-weight-black">
                  About us
                </h1>
              </v-col>
              <v-col cols="12" md="6"
                ><p class="subtitle-1">
                  We're computer sciences students from Germany and one day we
                  were sick of figuring out of who owes whom, who has to go
                  grocery shopping and who - again - forgot to clean up.
                </p>
                <p class="subtitle-1">
                  That's why we created this app. We hope you find this app as
                  helpful as we do. We're always happy to get your feedback so
                  get in touch!
                </p>
              </v-col>
              <v-col cols="12" md="6" lg="4" class="d-none d-md-block"
                ><h1 class="display-4 font-weight-black">
                  About us
                </h1>
              </v-col>
            </v-row></v-card-text
          ></v-card
        >
      </v-col>
      <v-col cols="12" md="8" class="mt-12 mb-12 text-center"
        ><div class="display-3" style="line-height: 1.6;">
          You have a question or would like to see a new feature in our app?
        </div>
        <div class="title text--secondary">
          If you can't find your answer in our FAQs just fill out our contact
          form. We're always eager to find out how we can improve Jeff. If you
          unfortunately found a bug please send us the details and we will try
          to talk to Jeff. We won't be too hard on him. We promise.
        </div>
        <v-btn class="mt-4 mb-12" outlined x-large>
          <v-icon left>mail</v-icon>Contact</v-btn
        >
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "Home",
  data: () => ({
    features: [
      {
        headline: "Dashboard",
        description: `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, 
          sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.`,
        image: "Dashboard.svg"
      },
      {
        headline: "Finances",
        description: `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, 
          sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.`,
        image: "Finances.svg"
      },
      {
        headline: "Shopping Lists",
        description: `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, 
          sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.`,
        image: "ShoppingLists.svg"
      },
      {
        headline: "Tasks",
        description: `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, 
          sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.`,
        image: "Dashboard.svg"
      },
      {
        headline: "Calendar",
        description: `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, 
          sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.`,
        image: "Dashboard.svg"
      }
    ],
    roadmap: [
      {
        color: "cyan",
        bold: false,
        title: "Closed Beta",
        description:
          "This app is developed with love and like everything it needs time. We will conduct a closed beta phase in May 2020. If you're interested feel free to get in touch.",
        year: "May 2020"
      },
      {
        color: "green",
        bold: true,
        title: "Offical Release",
        description: `We're hoping to offically release our app in June 2020. This release will include: finances, 
        shopping lists, tasks, calendar integration and will be available in German and English.`,
        year: "June 2020"
      },
      {
        color: "pink",
        bold: false,
        title: "WG-Chat, Google Maps Integration",
        description: `Of course thats not it. We've got plenty of new features in the making. 
        You want to have everything in one app? With the Chat Feature you can discuss everything important within the app
        and even reference expenses, shopping lists, etc. You want to be reminded when you need to go to work/school/university?
        With our Google Maps Integration Jeff can help you while using realtime traffic information. `,
        year: "Summer 2020"
      },
      {
        color: "amber",
        bold: false,
        title: "Home Control & Automation",
        description: `You've got a Philipps Hue Bridge? Excellent, now you can control your scenes right from our dashboard.
          With our new integrations you can now even automatically turn your lights on when you come home.`,
        year: "Fall 2020"
      }
    ]
  })
};
</script>
