<template>
  <v-container>
    <h1 class="display-2 pb-6">{{ householdName }}</h1>
    <v-row>
      <v-col cols="12" md="6" lg="4" xl="3">
        <v-card style="height: 100%;" :elevation="6" :loading="loading">
          <v-card-title>
            {{ $t("household.members") }}
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
                    getFullUserName(member)
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
          <v-card-actions>
            <v-btn text color="red" @click="leaveDialogOpen = true">
              {{ $t("household.leaveHousehold") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="4" xl="3">
        <v-card style="height: 100%;" :elevation="6" :loading="loading">
          <v-card-title>
            {{ $t("household.info") }}
            <v-spacer></v-spacer>
            <v-btn icon @click="edit"><v-icon>edit</v-icon></v-btn>
          </v-card-title>
          <v-list v-if="!editMode" disabled>
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
                  {{ householdTypes[householdType].text }}
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
          <v-container v-else class="text-right">
            <v-text-field
              v-model="eName"
              :label="$t('household.create.householdName')"
            ></v-text-field>
            <v-select
              v-model="eType"
              :items="householdTypes"
              :label="$t('household.create.householdType')"
            ></v-select>
            <v-btn color="success" class="mr-2" @click="saveEdit">{{
              $t("commands.save")
            }}</v-btn>
            <v-btn text @click="editMode = false">{{
              $t("commands.cancel")
            }}</v-btn>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <confirm-dialog
      v-model="leaveDialogOpen"
      :title="$t('household.leaveHousehold') + '?'"
      :negative-option="$t('household.leave')"
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
          {{ householdTypes[householdType].text }}<br />
          {{ $t("household.created") }}: {{ formatDate(householdRegistered) }}
        </v-card-text>
      </v-card>
      <p>
        <b>{{ $t("household.confirmLeave2") }}</b>
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
    loading: false,
    editMode: false,
    householdName: "Manage household",
    members: [],
    userImages: {},
    householdType: 0,
    householdRegistered: "",
    leaveDialogOpen: false,
    eName: "",
    eType: ""
  }),
  computed: {
    householdTypes() {
      return [
        {
          text: this.$t("household.types[0]"),
          value: 0
        },
        {
          text: this.$t("household.types[1]"),
          value: 1
        },
        {
          text: this.$t("household.types[2]"),
          value: 2
        }
      ];
    },
    ...mapGetters(["getFullUserName", "getUserInitials"])
  },
  mounted() {
    this.fetchHousehold();
  },
  methods: {
    formatDate(strdate) {
      return new Date(strdate).toLocaleString();
    },
    edit() {
      if (this.editMode) {
        this.editMode = false;
        return;
      }
      this.eName = this.householdName;
      this.eType = this.householdType;
      this.editMode = true;
    },
    async fetchHousehold() {
      this.loading = true;
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
          this.$t("household.errors.userNotAssignedToHousehold")
        );
        this.$router.push({ name: "Create Household" });
      } else {
        this.$store.dispatch(
          "showSnackbar",
          data.message || this.$t("general.errors.connect")
        );
      }
      this.loading = false;
    },
    async saveEdit() {
      try {
        const { data } = await this.$http.post("/_/edithousehold", {
          name: this.eName,
          type: this.eType
        });
        if (data.success) {
          this.$store.dispatch("showSnackbar", this.$t("household.update"));
          this.householdName = this.eName;
          this.householdType = this.eType;
        } else {
          this.$store.dispatch(
            "showSnackbar",
            this.$t("household.errors.updateFailed")
          );
          console.log(data);
        }
      } catch (err) {
        this.$store.dispatch(
          "showSnackbar",
          this.$t("household.errors.updateError")
        );
        console.error(err);
      }
      this.editMode = false;
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
        this.$store.dispatch("showSnackbar", this.$t("general.errors.connect"));
      }
    }
  }
};
</script>
