<template>
  <v-container>
    <h1 class="display-2 pl-12 pb-6">{{ householdName }}</h1>
    <v-row>
      <v-col cols="12" md="6" lg="4" xl="3">
        <v-card style="height: 100%;" :elevation="6">
          <v-card-title>
            {{ $t("household.title") }}
            <v-spacer></v-spacer>
            <invite-link-dialog></invite-link-dialog>
          </v-card-title>
          <v-list avatar>
            <v-list-item-group color="primary">
              <v-list-item
                v-for="member in members"
                :key="'hmem-' + member"
                :value="member"
              >
                <v-list-item-avatar
                  size="48"
                  :color="!userImages[member] ? 'primary' : ''"
                  left
                >
                  <v-img
                    v-show="userImages[member]"
                    :src="userImages[member]"
                  ></v-img>
                  <span
                    v-show="!userImages[member]"
                    class="white--text headline"
                    >{{ getUserInitials(member) }}
                  </span>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{
                    getUserName(member)
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
          <v-card-actions>
            <v-btn text color="red" @click="leaveDialogOpen = true">
              {{ $t("household.leave") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="4" xl="3">
        <v-card style="height: 100%;" :elevation="6">
          <v-card-title>
            {{ $t("household.info") }}
          </v-card-title>
          <v-list disabled>
            <v-list-item-group>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>text_format</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  {{ householdName }}
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>home_work</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  {{ householdTypes[householdType] }}
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>history</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  {{ $t("household.created") }}:
                  {{ formatDate(householdRegistered) }}
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
    <confirm-dialog
      v-model="leaveDialogOpen"
      :title="$t('household.leave') + '?'"
      :negative-option="$t('household.lea')"
      :positive-option="$t('household.stay')"
      :max-width="500"
      @positive="leaveCancel"
      @negative="leaveConfirm"
    >
      <p>{{ $t("household.confirmLeave") }}</p>
      <v-card color="primary" class="mb-4">
        <v-card-title class="pb-0 white--text">
          {{ householdName }}
        </v-card-title>
        <v-card-text class="white--text">
          {{ householdTypes[householdType] }}<br />
          {{ $t("household.created") }}: {{ formatDate(householdRegistered) }}
        </v-card-text>
      </v-card>
      <p>
        <b>{{ $t("household.confirmExp") }}</b>
      </p>
    </confirm-dialog>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import { fetchProfileImg } from "@/assets/profileimagesHelper.js";

import InviteLinkDialog from "@/components/dialogs/InviteLinkDialog.vue";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog.vue";

export default {
  name: "ManageHousehold",
  components: {
    InviteLinkDialog,
    ConfirmDialog
  },
  data: () => ({
    householdName: "Manage household",
    members: [],
    userImages: {},
    householdType: 0,
    householdRegistered: "",
    householdTypes: [],
    leaveDialogOpen: false
  }),
  computed: {
    ...mapGetters(["getUserName", "getUserInitials"])
  },
  created() {
    this.householdTypes = [];
    this.householdTypes.push(this.$t("household.types[0]"));
    this.householdTypes.push(this.$t("household.types[1]"));
    this.householdTypes.push(this.$t("household.types[2]"));
  },
  mounted() {
    this.fetchHousehold();
  },
  methods: {
    formatDate(strdate) {
      return new Date(strdate).toLocaleString();
    },
    async fetchHousehold() {
      const { data } = await this.$http.get("/_/fetchhousehold");
      if (data.success) {
        this.members = data.members.map(member => member.id);
        this.householdName = data.name;
        this.householdType = data.type;
        this.householdRegistered = data.registered;
        this.members.forEach(async member => {
          if (!this.userImages[member]) {
            this.$set(this.userImages, member, await fetchProfileImg(member));
          }
        });
      } else if (data.exists === false) {
        this.$store.dispatch(
          "showSnackbar",
          this.$t("household.errors.assigned")
        );
        this.$router.push({ name: "Create Household" });
      } else {
        this.$store.dispatch(
          "showSnackbar",
          data.message || this.$t("household.errors.connect")
        );
      }
    },
    leaveCancel() {
      this.leaveDialogOpen = false;
    },
    async leaveConfirm() {
      this.leaveDialogOpen = false;
      try {
        const { data } = await this.$http.post("/_/leavehousehold");
        if (data.success) {
          this.$store.commit("update_household_users", {});
          this.fetchHousehold();
        } else
          this.$store.dispatch(
            "showSnackbar",
            data.message || this.$t("household.errors.unkown")
          );
      } catch (err) {
        this.$store.dispatch(
          "showSnackbar",
          this.$t("household.errors.connect")
        );
      }
    }
  }
};
</script>
