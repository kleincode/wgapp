<template>
  <v-container>
    <h1 class="display-2 pl-12 pb-6">{{ householdName }}</h1>
    <v-row>
      <v-col cols="12" md="6" lg="4" xl="3">
        <v-card>
          <v-card-title>
            Members
            <v-spacer></v-spacer>
            <v-btn text color="primary">
              <v-icon left>group_add</v-icon>
              Invite
            </v-btn>
          </v-card-title>
          <v-list avatar>
            <v-list-item-group color="primary">
              <v-list-item
                v-for="member in members"
                :key="'hmem-' + member"
                :value="member"
              >
                <v-list-item-avatar size="48" color="teal" left>
                  <span class="white--text headline">{{
                    getUserInitials(member)
                  }}</span>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{
                    getUserName(member)
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "ManageHousehold",
  data: () => ({
    householdName: "Manage household",
    members: [],
    householdType: 0,
    householdRegistered: ""
  }),
  computed: {
    ...mapGetters(["getUserName", "getUserInitials"])
  },
  methods: {
    formatDate(strdate) {
      return new Date(strdate).toLocaleString();
    }
  },
  async mounted() {
    const { data } = await this.$http.get("/_/fetchhousehold");
    if (data.success) {
      this.members = data.members;
      this.householdName = data.name;
      this.householdType = data.type;
      this.householdRegistered = data.registered;
    } else if (data.exists === false) {
      this.$store.dispatch(
        "showSnackbar",
        "You are not assigned to a household yet. Please create one now."
      );
      this.$router.push({ name: "Create Household" });
    } else {
      this.$store.dispatch(
        "showSnackbar",
        data.message || "Could not connect to server."
      );
    }
  }
};
</script>
