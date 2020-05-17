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
          <p class="overline">{{ version }}</p>
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
            - Sincerely, Roomie
          </p>
        </v-col>
        <v-col cols="12" class="text-right">
          <v-btn color="white" text @click="dialog = false">close</v-btn>
        </v-col>
      </v-row>
    </v-sheet>
  </v-dialog>
</template>

<script>
import { mapState } from "vuex";
import { userSettings } from "@/store/LocalAppStore";

export default {
  name: "UpdateMessageDialog",
  data: () => ({
    dialog: false,
    id: -1,
    title: "",
    news: [],
    bugs: [],
    version: "",
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
    updateMessageIndex: {
      get() {
        return this.$store.state.userSettings.updateMessageIndex;
      },
      set(value) {
        this.$store.commit("userSettings/set_key", {
          key: "updateMessageIndex",
          value
        });
      }
    },
    ...mapState("userSettings", ["lang", "introductionState"])
  },
  watch: {
    dialog(val) {
      if (!val) {
        this.updateMessageIndex = this.id;
      }
    }
  },
  async mounted() {
    //no introduction
    if (this.introductionState <= 0) {
      //fetch only if app was updated
      const updated = await userSettings.get("updatedApp");
      if (updated && updated.value) {
        //fetch current message
        try {
          const { data } = await this.$http.get("/_/fetchupdatemessages");
          //display only if newer than current index
          this.id = data.data[0].id;
          if (this.id > this.updateMessageIndex) {
            this.setupMessage(data.data[0]);
            this.dialog = true;
          }
          userSettings.put({ key: "updatedApp", value: false });
        } catch (err) {
          this.dialog = false;
          console.error("Couldn't fetch update message", err);
        }
      }
    }
  },
  methods: {
    setupMessage(data) {
      let msgs;
      if (this.lang == "de") {
        msgs = data.de;
      } else {
        msgs = data.en;
      }
      this.title = msgs.title;
      this.version = msgs.version;
      this.bugs = msgs.bugs;
      this.news = msgs.news;
      this.additionalMessage = msgs.additionalMessage;
    }
  }
};
</script>
