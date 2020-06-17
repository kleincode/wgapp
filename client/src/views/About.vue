<template>
  <v-container>
    <h1 class="display-2">{{ $t("about.title") }}</h1>
    <v-row>
      <v-col cols="12" md="12" lg="8">
        <v-card :elevation="7" style="height: 100%">
          <v-card-title>
            <h2>{{ $t("about.appInformation") }}</h2>
          </v-card-title>
          <v-card-text class="body-1">
            <ul>
              <li>
                <b>{{ $t("about.version") }}:</b> 1.00 Beta
              </li>
              <li>
                <b>{{ $t("about.lastUpdated") }}:</b> {{ lastUpdated }}
              </li>
              <li>{{ $t("about.developedIn") }}</li>
            </ul>
            <i18n path="about.visitHomepage" tag="p" class="title mt-7">
              <template #homepage>
                <a href="https://kleinco.de">{{ $t("about.homepage") }}</a>
              </template>
            </i18n>
            <p class="headline mt-7">
              {{ $t("about.contactUs") }}
              <a href="mailto:roomie@kleinco.de">roomie@kleinco.de</a>
            </p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="12" lg="8">
        <v-card>
          <v-card-title>
            <h2>{{ $t("about.writtenBy") }}</h2>
          </v-card-title>
          <v-card-text>
            <v-row align="center" justify="space-around">
              <v-col cols="6" md="5" lg="3" class="text-center">
                <v-img src="@/assets/roomie.svg"></v-img>
                <h2 class="mt-3">Felix Kleinsteuber</h2>
              </v-col>
              <v-col cols="6" md="5" lg="3" class="text-center">
                <v-img src="@/assets/roomie.svg"></v-img>
                <h2 class="mt-3">Matti J. Frind</h2>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <v-card>
          <v-card-text
            ><p class="headline text--primary">
              {{ $t("about.specialThanks") }}
            </p>
            <v-list>
              <v-list-item v-for="(person, i) in help" :key="i" two-line>
                <v-list-item-avatar>
                  <v-img src="@/assets/roomie.svg"></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ person.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ person.work }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "About",
  computed: {
    lastUpdated() {
      let date = new Date("2020-05-17T17:56:59.040Z");
      return date.toLocaleDateString(this.locale || undefined);
    },
    help() {
      return [
        {
          name: "Erik ...",
          work: this.$t("about.andHelpPages")
        },
        {
          name: "Tom Rother",
          work: this.$t("about.graphicDesign")
        },
        {
          name: "Luca Reininghaus",
          work: this.$t("about.shoppingList")
        }
      ];
    },
    ...mapState("userSettings", ["locale"])
  }
};
</script>

<style></style>
