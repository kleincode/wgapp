<template>
  <Widget
    title="Do Not Disturb"
    :loading="loading"
    with-footer
    :context-items="contextItems"
    @context-action="contextAction"
  >
    <v-row class="mb-4">
      <v-col v-for="(member, i) in members" :key="i" cols="4" md="3">
        <v-avatar
          size="48"
          :color="!userImages[member.id] ? 'primary' : ''"
          left
          :style="
            !!member.status
              ? 'border-color: red !important; border-width: 3px; border-style: solid;'
              : ''
          "
        >
          <v-img
            v-show="userImages[member.id]"
            :src="userImages[member.id]"
          ></v-img>
          <span v-show="!userImages[member.id]" class="white--text headline"
            >{{ getUserInitials(member.id) }}
          </span>
        </v-avatar>
      </v-col>
    </v-row>
    <template #footer
      ><v-btn v-if="!userStatus" text block @click="toggle">Activate</v-btn>
      <v-btn v-else color="red" block @click="toggle">Deactivate</v-btn>
    </template>
  </Widget>
</template>

<script>
import Widget from "./Widget";
import { mapState, mapGetters } from "vuex";
import { fetchProfileImg } from "@/assets/profileimagesHelper.js";

export default {
  name: "StatusWidget",
  components: {
    Widget
  },
  data: () => ({
    loading: false,
    error: false,
    userStatus: false,
    userImages: {},
    members: [],
    contextItems: [
      {
        action: "settings",
        text: "Widget Settings",
        icon: "settings"
      }
    ]
  }),
  computed: {
    ...mapGetters(["getUserName", "getUserInitials"]),
    ...mapState(["uid"])
  },
  async mounted() {
    this.loading = true;
    await this.update();
    this.loading = false;
    this.clockIntervalID = setInterval(() => this.update(), 60 * 1000);
  },
  beforeDestroy() {
    clearInterval(this.clockIntervalID);
  },
  methods: {
    async update() {
      const { data } = await this.$http.get("/_/fetchhousehold");
      if (data.success) {
        this.members = data.members;
        this.householdName = data.name;
        this.householdType = data.type;
        this.householdRegistered = data.registered;
        this.members.forEach(async member => {
          if (member.id == this.uid) {
            this.userStatus = !!member.status;
          }
          if (!this.userImages[member]) {
            this.$set(
              this.userImages,
              member.id,
              await fetchProfileImg(member.id)
            );
          }
        });
      } else if (data.exists === false) {
        this.error = true;
      } else {
        this.$store.dispatch(
          "showSnackbar",
          data.message || "Could not connect to server."
        );
      }
    },
    async toggle() {
      this.userStatus = !this.userStatus;
      try {
        this.loading = true;
        const { data } = await this.$http.post("/_/toggleuserstatus", {
          value: this.userStatus
        });
        if (data.success) {
          this.$store.dispatch("showSnackbar", "Updated user status");
        } else {
          this.$store.dispatch("showSnackbar", "Could not connect to server.");
          this.userStatus = !this.userStatus;
        }
      } catch (err) {
        console.error(err);
        this.$store.dispatch("showSnackbar", "Error toggling user status.");
        this.userStatus = !this.userStatus;
      }
      this.loading = false;
    },
    contextAction(item) {
      switch (item.action) {
        case "settings":
          this.$router.push({ name: "DashboardSettings", hash: "#status" });
      }
    }
  }
};
</script>

<style></style>
