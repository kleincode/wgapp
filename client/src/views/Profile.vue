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
            :color="isDark ? 'secondary' : 'secondary lighten-5'"
          >
            <v-row>
              <v-col cols="12" md="6" lg="4" class="text-center">
                <v-avatar size="250" class="mb-2">
                  <v-img
                    src="https://cdn.vuetifyjs.com/images/john.jpg"
                    alt="John"
                  >
                  </v-img>
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
                    <v-btn color="primary" @click="edit">edit</v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card>
        </v-card>
      </v-col>
    </v-row></v-container
  >
</template>

<script>
import ProfileEdit from "@/components/ProfileEdit.vue";
import { mapState } from "vuex";
export default {
  name: "Profile",
  components: {
    ProfileEdit
  },
  data: () => ({
    editMode: false
  }),
  computed: {
    ...mapState(["userEmail", "userFirstName", "userLastName"])
  },
  methods: {
    edit() {
      this.editMode = true;
    },

    isDark() {
      return this.$theme.isDark;
    }
  }
};
</script>
