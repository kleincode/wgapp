<template>
  <Widget
    :title="$t('widgets.disturb.title')"
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
      ><v-btn v-if="!userStatus" text block @click="toggle">{{
        $t("commands.activate")
      }}</v-btn>
      <v-btn v-else color="red" block @click="toggle">{{
        $t("commands.deactivate")
      }}</v-btn>
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
    members: []
  }),
  computed: {
    contextItems() {
      return [
        {
          action: "settings",
          text: this.$t("widgets.settings"),
          icon: "settings"
        }
      ];
    },
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
          data.message || this.$t("widgets.disturb.connect")
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
          this.members.forEach(member => {
            if (member.id == this.uid) {
              member.status = !member.status;
            }
          });
        } else {
          this.$store.dispatch(
            "showSnackbar",
            this.$t("widgets.disturb.connect")
          );
          this.userStatus = !this.userStatus;
        }
      } catch (err) {
        console.error(err);
        this.$store.dispatch("showSnackbar", this.$t("widgets.disturb.err"));
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
