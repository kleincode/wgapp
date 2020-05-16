<template>
  <v-container>
    <h1 class="display-2">About</h1>
    <v-row>
      <v-col cols="12" md="4">
        <v-card :elevation="7" style="height: 100%">
          <v-card-title>
            <h2>App Information</h2>
          </v-card-title>
          <v-card-text class="body-1">
            <ul>
              <li><b>Version:</b> 1.00 Beta</li>
              <li><b>last updated:</b> 16.05.2020</li>
              <li>developed in Leipzig, Germany</li>
            </ul>
            <p class="title mt-7">
              Visit our <a>homepage</a> for more information about us and future
              developments.
            </p>
            <p class="headline mt-7">Contact us at <a>contact@roomie.com</a></p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>
            <h2>Written by</h2>
          </v-card-title>
          <v-card-text>
            <v-row align="center" justify="space-around">
              <v-col cols="12" md="3" class="text-center">
                <v-img src="@/assets/jeff-without.svg"></v-img>
                <h2 class="mt-3">Felix Kleinsteuber</h2>
              </v-col>
              <v-col cols="12" md="3" class="text-center">
                <v-img src="@/assets/jeff-without.svg"></v-img>
                <h2 class="mt-3">Matti J. Frind</h2>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            <h3 class="mt-6">Special thanks for the support from</h3>
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item v-for="(person, i) in help" :key="i" two-line>
                <v-list-item-avatar>
                  <v-img src="@/assets/jeff-without.svg"></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title v-html="person.name"></v-list-item-title>
                  <v-list-item-subtitle
                    v-html="person.work"
                  ></v-list-item-subtitle>
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
export default {
  name: "About",
  data: () => ({
    help: [
      {
        name: "Max ...",
        work: "and our wonderful help pages"
      },
      {
        name: "Luca Reininghaus",
        work: "and the shopping lists<br> - may you never ever forget anything"
      }
    ]
  })
};
</script>

<style></style>
