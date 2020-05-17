<template>
  <v-dialog
    v-model="dialog"
    width="1000"
    height="350"
    style="max-height: 550px"
  >
    <v-sheet height="100%" color="secondary" class="white--text">
      <v-row
        class="ml-4 mr-4 pt-6"
        :class="isDeviceSmall ? '' : 'fill-height'"
        :align="isDeviceSmall ? 'start' : 'center'"
        justify="center"
      >
        <v-col cols="8" sm="6" md="4" lg="3" class="mb-8">
          <v-img src="@/assets/jeff-without.svg" class=""></v-img>
        </v-col>
        <v-col cols="12" md="7" lg="7">
          <h1 class="fancytitle" :class="getTitleSize">
            {{ title }}
          </h1>
          <h3 class="mt-8 success--text">New Features</h3>
          <div class="subtitle-1 mt-4">
            <ul>
              <li v-for="(n, i) in news" :key="i">
                <b>{{ n.bold }}</b>
                {{ " " + n.text }}
              </li>
            </ul>
          </div>
          <h4 class="mt-8 error--text">Bugfixes</h4>
          <div class="subtitle-1 mt-4">
            <ul>
              <li v-for="(b, i) in bugs" :key="i">
                <b>{{ b.bold }}</b>
                {{ " " + b.text }}
              </li>
            </ul>
          </div>
          <p v-if="additionalMessage != ''" class="mt-6">
            {{ additionalMessage }}
          </p>
          <p class="font-italic font-weight-light title mt-8">
            - Sincerly, Roomie
          </p>
        </v-col>
        <v-col cols="12" class="text-right">
          <v-btn color="white" text>close</v-btn>
        </v-col>
      </v-row>
    </v-sheet>
  </v-dialog>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "UpdateMessageDialog",
  data: () => ({
    dialog: true,
    title: "Hey, great news, I have a new update!",
    news: [
      {
        bold: "New Shopping list!",
        text: "We added some stuff"
      }
    ],
    bugs: [
      {
        bold: "Calendar bug fixed.",
        text: "Yeah we dit it, finally"
      },
      {
        bold: "Calendar bug fixed.",
        text: "Yeah we dit it, finally"
      },
      {
        bold: "Calendar bug fixed.",
        text: "Yeah we dit it, finally"
      },
      {
        bold: "Calendar bug fixed.",
        text: "Yeah we dit it, finally"
      },
      {
        bold: "Calendar bug fixed.",
        text: "Yeah we dit it, finally"
      }
    ],
    additionalMessage: ""
  }),
  computed: {
    isDeviceSmall() {
      return (
        this.$vuetify.breakpoint.name == "sm" ||
        this.$vuetify.breakpoint.name == "xs"
      );
    },
    getTitleSize() {
      if (this.$vuetify.breakpoint.name == "sm") {
        return "small";
      } else if (this.$vuetify.breakpoint.name == "xs") {
        return "tiny";
      }
      return "big";
    },
    ...mapState("userSettings", ["updateMessageIndex"])
  }
};
</script>

<style></style>
