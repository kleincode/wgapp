<template>
  <v-container style="min-height: 90vh">
    <h1 class="display-3 text-center mt-12 mb-12">Help Center</h1>
    <v-row justify="center">
      <v-col cols="12" md="7" lg="5">
        <v-text-field
          class="mx-4 mb-6"
          flat
          hide-details
          label="Search"
          prepend-inner-icon="search"
          outlined
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="12" lg="12">
        <v-card
          color="grey lighten-3"
          class="pa-6 mb-12"
          style="min-height: 70vh; margin-top: 6em;"
        >
          <v-row justify="center">
            <v-col cols="12" md="11">
              <h1 class="headline text-center mt-8 mb-8 text--secondary">
                You need help? Don't worry. We got you. Just choose your topic.
              </h1>
              <v-row
                ><v-col
                  v-for="(topic, i) in topics"
                  :key="i"
                  cols="6"
                  md="6"
                  lg="3"
                >
                  <v-hover v-slot:default="{ hover }">
                    <v-responsive :aspect-ratio="1 / 1" class="pa-4">
                      <v-card
                        :elevation="hover ? 8 : 2"
                        color="primary lighten-1"
                        class="white--text text-center fill-height"
                        :to="topic.link"
                      >
                        <v-row class="fill-height">
                          <v-col cols="12" align-self="center">
                            <v-icon color="white" style="font-size: 4em">{{
                              topic.icon
                            }}</v-icon>
                            <div class="headline mt-3">{{ topic.name }}</div>
                          </v-col>
                        </v-row>
                      </v-card>
                    </v-responsive>
                  </v-hover>
                </v-col></v-row
              >
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: "Help",
  data: () => ({
    topics: [
      {
        name: "General",
        icon: "bathtub",
        link: { name: "H-General" }
      },
      {
        name: "Dashboard",
        icon: "view_quilt",
        link: { name: "H-Dashboard" }
      },
      {
        name: "Tasks",
        icon: "list",
        link: { name: "H-Tasks" }
      },
      {
        name: "Shopping Lists",
        icon: "shopping_cart",
        link: { name: "H-ShoppingLists" }
      },
      {
        name: "Finances",
        icon: "attach_money",
        link: { name: "H-Finances" }
      },
      {
        name: "Settings",
        icon: "settings",
        link: { name: "H-Settings" }
      }
    ]
  })
};
</script>
