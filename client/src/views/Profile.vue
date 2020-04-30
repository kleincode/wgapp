<template>
  <v-container
    ><v-row justify="center">
      <v-col xl="9" lg="10" md="12">
        <h1 class="display-2 pb-6">Profile</h1>
        <v-card style="min-height: 70vh" class="pa-4">
          <ProfileEdit
            v-show="editMode"
            :edit-mode="editMode"
            @close="editMode = false"
          ></ProfileEdit>
          <v-card
            v-show="!editMode"
            class="pa-6"
            :loading="loading"
            :color="isDark ? 'secondary' : 'secondary lighten-5'"
          >
            <v-row>
              <v-col cols="12" md="6" lg="4" class="text-center">
                <v-avatar
                  size="250"
                  class="mb-2"
                  :color="hasProfilePicture ? '' : 'primary'"
                >
                  <v-img
                    v-if="hasProfilePicture"
                    :src="profilePictureData"
                    alt="John"
                  >
                  </v-img>
                  <span v-else class="white--text display-4">{{
                    getInitials()
                  }}</span>
                </v-avatar>
              </v-col>
              <v-col cols="12" md="6" lg="8" class="pa-4">
                <v-row
                  ><v-col cols="12" md="8">
                    <div class="overline">username</div>
                    <h1 class="display-1">
                      {{ userFirstName }} {{ userLastName }}
                    </h1>
                    <div class="overline mt-6">Nickname</div>
                    <h1 class="headline">Nicki</h1>
                    <div class="overline mt-6">mail</div>
                    <h1 class="headline">{{ userEmail }}</h1>
                    <div class="overline mt-6">password</div>
                    <h1 class="headline">************</h1>
                  </v-col>
                  <v-col cols="12" md="4" class="text-right">
                    <v-btn color="primary" @click="editMode = true">edit</v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card>
          <v-row>
            <v-col cols="12" md="6">
              <p class="text--secondary">registered: 30.04.2020</p>
            </v-col>
            <v-col cols="12" md="6">
              <p class="text--secondary">registered: 30.04.2020</p>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row></v-container
  >
</template>

<script>
import ProfileEdit from "@/components/ProfileEdit.vue";
import { mapState, mapGetters } from "vuex";
export default {
  name: "Profile",
  components: {
    ProfileEdit
  },
  data: () => ({
    editMode: false,
    loading: false,
    profilePictureExists: false,
    imageSource: ""
  }),
  computed: {
    ...mapState([
      "userEmail",
      "userFirstName",
      "userLastName",
      "userInitials",
      "profilePictureData"
    ]),
    ...mapGetters(["hasProfilePicture"])
  },
  async mounted() {
    this.loading = true;
    await this.$store.dispatch("fetchProfileImg");
    this.loading = false;
  },
  methods: {
    getInitials() {
      let str = "";
      if (this.userFirstName) {
        str += this.userFirstName.substr(0, 1).toUpperCase();
      }
      if (this.userLastName) {
        str += this.userLastName.substr(0, 1).toUpperCase();
      }
      return str;
    },

    isDark() {
      return this.$theme.isDark;
    }
  }
};
</script>
