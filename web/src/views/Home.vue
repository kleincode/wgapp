<template>
  <div>
    <v-row id="home" style="min-height: 93vh" align="center" justify="center">
      <v-col cols="12" md="3" class="pl-2 pr-2">
        <div>
          <v-img
            :src="require('../assets/roomie.svg')"
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
          {{ $t("landing.hey") }}
        </p>
        <h1 class="display-4 font-weight-bold mb-3">
          Roomie.
        </h1>

        <p class="title font-weight-regular">
          {{ $t("landing.organizer") }}
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
                  {{ $t("why.question") }}
                </h1></v-col
              >
              <v-col cols="12" md="6" lg="8">
                <i18n path="why.answer" tag="p" class="headline">
                  <template #tasks>
                    <span class="font-weight-black">{{ $t("why.tasks") }}</span>
                  </template>
                  <template #finances>
                    <span class="font-weight-black">{{
                      $t("why.finances")
                    }}</span>
                  </template>
                  <template #shopping>
                    <span class="font-weight-black">{{
                      $t("why.shopping")
                    }}</span>
                  </template>
                  <template #calendar>
                    <span class="font-weight-black">{{
                      $t("why.calendar")
                    }}</span>
                  </template>
                  <template #dashboard>
                    <span class="font-weight-black">{{
                      $t("why.dashboard")
                    }}</span>
                  </template>
                </i18n>
                <v-btn
                  class="mt-4"
                  rounded
                  @click="
                    $vuetify.goTo('#features', {
                      duration: 500,
                      easing: 'easeInOutCubic'
                    })
                  "
                  >{{ $t("why.learn") }}</v-btn
                >
              </v-col>
            </v-row></v-card-text
          ></v-card
        >
      </v-col>
      <v-col cols="12" md="8" class="mt-12 mb-12"
        ><div class="display-3 text-center" style="line-height: 1.6;">
          <i18n
            path="devices.headline"
            tag="div"
            class="display-3 text-center"
            style="line-height: 1.6;"
          >
            <template #every>
              <span class="font-weight-bold">{{ $t("devices.every") }}</span>
            </template>
          </i18n>
        </div>
        <div class="title text-center text--secondary">
          {{ $t("devices.explanation") }}
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
    <v-card class="mt-12 white--text" color="#04182d">
      <v-row id="features" justify="center">
        <v-col cols="12" class="pt-12 text-center"
          ><div class="display-4 mb-7">{{ $t("features.headline") }}</div>
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
              <p class="text-justify">
                {{ $t("features.explanations[" + i + "]") }}
              </p>
            </v-col>
            <v-col cols="12" md="6" class="pl-12 pt-12 pr-12 text-right">
              <h1 class="headline mb-3">{{ $t("features.more") }}</h1>
              <p>
                {{ $t("features.moreHint") }}
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
                >{{ $t("features.roadmap") }}</v-btn
              ></v-col
            >
          </v-row></v-col
        >
      </v-row>
    </v-card>
    <v-row justify="center" class="ml-2 mr-2">
      <v-col cols="12" md="8" class="mt-12 mb-12 text-center">
        <i18n
          path="interested.headline"
          tag="div"
          class="display-3"
          style="line-height: 1.6;"
        >
          <template #bold>
            <span class="font-weight-bold">{{ $t("interested.bold") }}</span>
          </template>
        </i18n>
        <i18n
          path="interested.explanation"
          tag="div"
          class="title text--secondary"
          style="line-height: 1.6;"
        >
          <template #free>
            <span class="text--primary font-weight-bold">{{
              $t("interested.expBold")
            }}</span>
          </template>
        </i18n>
        <v-btn class="mt-4 mb-12" outlined x-large>
          <v-icon left>mdi-open-in-new</v-icon>{{ $t("openApp") }}</v-btn
        >
        <br />
        <v-chip class="mt-12 mb-12" color="primary"
          ><v-avatar left>
            <v-icon>info</v-icon>
          </v-avatar>
          {{ $t("closedBeta") }}</v-chip
        >
        <v-divider class="mt-12"></v-divider>
      </v-col>
      <v-col id="roadmap" cols="12" md="8" class="mt-12 mb-12 text-center">
        <div class="display-4 mb-7">{{ $t("roadmap.headline") }}</div>
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
                v-text="$t('roadmap.milestones[' + i + '].time')"
              ></span>
            </template>
            <div class="py-4">
              <h2
                :class="`headline font-weight-light mb-4 ${entry.color}--text`"
              >
                {{ $t("roadmap.milestones[" + i + "].title") }}
              </h2>
              <div>
                <p class="text-justify">
                  {{ $t("roadmap.milestones[" + i + "].desc") }}
                </p>
              </div>
            </div>
          </v-timeline-item>
        </v-timeline>
      </v-col>

      <v-col cols="12" md="11" lg="9" class="mt-12 mb-12">
        <v-card id="about" tile color="primary" class="pl-5 pr-5"
          ><v-card-text class="white--text"
            ><v-row>
              <v-col class="d-md-none" cols="12" md="6" lg="4"
                ><h1 class="display-4 font-weight-black">
                  {{ $t("about.headline") }}
                </h1>
              </v-col>
              <v-col cols="12" md="6"
                ><p class="subtitle-1">
                  {{ $t("about.p1") }}
                </p>
                <p class="subtitle-1">
                  {{ $t("about.p2") }}
                </p>
              </v-col>
              <v-col cols="12" md="6" lg="4" class="d-none d-md-block"
                ><h1 class="display-4 font-weight-black">
                  {{ $t("about.headline") }}
                </h1>
              </v-col>
            </v-row></v-card-text
          ></v-card
        >
      </v-col>
      <v-col id="faq" cols="12" md="8" class="mt-12 mb-12 text-center">
        <div class="display-4 mb-7">FAQ</div>
        <v-expansion-panels popout hover>
          <v-expansion-panel v-for="(question, i) in faq" :key="i">
            <v-expansion-panel-header>{{
              $t("faq.questions[" + i + "].question")
            }}</v-expansion-panel-header>
            <v-expansion-panel-content class="pt-2 text-justify">
              {{ $t("faq.questions[" + i + "].answer") }}
              <div v-if="question.links.length > 0" class="text-right mt-3">
                {{ $t("faq.help") }}
                <span v-for="(link, j) in question.links" :key="j">
                  <a :to="link.link">
                    {{ link.text }}
                  </a>
                  <span v-if="j < question.links.length - 1">,</span>
                </span>
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
      <v-col id="screenshots" cols="12" md="8" class="mt-12 mb-12 text-center">
        <div class="display-4 mb-7">Screenshots</div>
        <v-carousel cycle>
          <v-carousel-item
            v-for="(shot, i) in screenshots"
            :key="i"
            contain
            :src="require('../assets/screenshots/' + shot)"
          ></v-carousel-item>
        </v-carousel>
      </v-col>
    </v-row>
    <v-card class="mt-12 white--text" color="#04182d">
      <v-row justify="center">
        <v-col cols="12" md="8" class="mt-12 mb-12 text-center"
          ><div class="display-3" style="line-height: 1.6;">
            {{ $t("question.headline") }}
          </div>
          <div class="title white--text" style="opacity: 0.7">
            {{ $t("question.desc") }}
          </div>
        </v-col></v-row
      >
    </v-card>
    <v-row justify="center" class="mb-12">
      <v-col id="contact" cols="12" md="8" class="mt-12 mb-12 text-center">
        <div class="display-4 mb-7">{{ $t("contact.headline") }}</div>
        <v-form ref="form" v-model="contactValid">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="contactName"
                :counter="10"
                :rules="contactNameRules"
                :label="$t('contact.name')"
                required
              ></v-text-field>

              <v-text-field
                v-model="contactEmail"
                :rules="contactEmailRules"
                autocomplete="email"
                :label="$t('contact.mail')"
                required
              ></v-text-field>

              <v-select
                v-model="contactSelect"
                :items="contactTopics"
                :rules="[v => !!v || $t('contact.topicHint')]"
                :label="$t('contact.topic')"
                required
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-textarea
                v-model="contactMessage"
                name="input-7-1"
                auto-grow
                :label="$t('contact.message')"
                counter
                :rules="[v => !!v || $t('contact.messageHint')]"
                :hint="$t('contact.messageHint2')"
                class="mb-2"
              ></v-textarea>
            </v-col>
            <v-col cols="12"
              ><v-btn
                :disabled="!contactValid"
                color="success"
                class="mr-4"
                block
                @click="validate"
              >
                {{ $t("contact.send") }}
              </v-btn></v-col
            >
            <v-col cols="12" class="mt-8">
              {{ $t("contact.alternative") }}
              <a>contact@Roomie-organization.de</a>.
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import roadmap from "@/assets/roadmap.js";
import faq from "@/assets/faq.js";
export default {
  name: "Home",
  data: () => ({
    contactValid: false,
    contactName: "",
    contactNameRules: [v => !!v || "Name is required"],
    contactEmail: "",
    contactEmailRules: [
      v => !!v || "E-mail is required",
      v => /.+@.+\..+/.test(v) || "E-mail must be valid"
    ],
    contactSelect: null,
    contactTopics: [],
    contactMessage: "",

    features: [
      {
        headline: "Dashboard",
        image: "Dashboard.svg"
      },
      {
        headline: "Finances",
        image: "Finances.svg"
      },
      {
        headline: "Shopping Lists",
        image: "ShoppingLists.svg"
      },
      {
        headline: "Tasks",
        image: "Tasks.svg"
      },
      {
        headline: "Calendar",
        image: "Calendar.svg"
      }
    ],
    roadmap: roadmap,
    faq: faq,
    screenshots: [
      "finances.jpg",
      "finances2.jpg",
      "shopping.jpg",
      "tasks.jpg",
      "settings1.jpg",
      "settings2.jpg"
    ]
  }),
  created() {
    for (let i = 0; i <= 3; i++) {
      this.contactTopics.push(this.$t("contact.topics[" + i + "]"));
    }
  },
  methods: {
    validate() {
      this.$refs.form.validate();
    }
  }
};
</script>
