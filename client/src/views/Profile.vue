<template>
  <v-container
    ><v-row justify="center">
      <v-col xl="9" lg="10" md="12">
        <h1 class="display-2 pb-6">{{ $t("profile.title") }}</h1>
        <!-- Profile -->
        <v-card
          class="pa-6 trans"
          :loading="loading"
          :color="editMode ? '' : 'accent'"
          :elevation="6"
        >
          <transition name="fade-transition" mode="out-in">
            <ProfileEdit
              v-if="editMode"
              key="edit"
              :edit-mode="editMode"
              @close="editMode = false"
            ></ProfileEdit>
            <div v-else key="show">
              <v-row>
                <v-col cols="12" md="6" lg="4" class="text-center">
                  <v-avatar
                    size="250"
                    class="mb-2"
                    :color="hasProfilePicture ? '' : 'primary'"
                  >
                    <v-img v-if="hasProfilePicture" :src="profilePictureData">
                    </v-img>
                    <span v-else class="white--text display-4">{{
                      getInitials()
                    }}</span>
                  </v-avatar>
                </v-col>
                <v-col cols="12" md="6" lg="8" class="pa-4">
                  <v-row
                    ><v-col cols="12" md="8">
                      <div class="overline">{{ $t("profile.username") }}</div>
                      <h1 class="display-1">
                        {{ userFirstName }} {{ userLastName }}
                      </h1>
                      <template v-if="userNickName">
                        <div class="overline mt-6">
                          {{ $t("profile.nickname") }}
                        </div>
                        <h1 class="headline">{{ userNickName }}</h1>
                      </template>
                      <div class="overline mt-6">{{ $t("profile.email") }}</div>
                      <h1 class="headline">{{ userEmail }}</h1>
                      <div class="overline mt-6">
                        {{ $t("profile.password") }}
                      </div>
                      <h1 class="headline">************</h1>
                    </v-col>
                    <v-col cols="12" md="4" class="text-right">
                      <v-btn color="primary" @click="editMode = true"
                        >edit</v-btn
                      >
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </div>
          </transition>
        </v-card>
        <v-row class="mt-6">
          <!-- Critical Actions -->
          <v-col cols="12">
            <v-card :elevation="6">
              <v-card-title>
                Unforgivable curses
              </v-card-title>
              <v-card-text>
                <p>
                  Don't worry though, as you're most likely not a wizard you
                  will not be sent to Azkaban.
                </p>
                <div
                  class="d-md-flex"
                  :style="
                    $vuetify.breakpoint.smAndDown ? { display: 'grid' } : {}
                  "
                >
                  <!-- Delete local data (IndexedDB) -->
                  <confirm-dialog
                    v-model="deleteLocalDataDialogShown"
                    :max-width="500"
                    positive-option="Do it!"
                    negative-option="Cancel"
                    invert-colors
                    :title="
                      'Delete local data' +
                        (databaseSize
                          ? ' (' + Math.floor(databaseSize / 1024) + ' KB)'
                          : '')
                    "
                    :loading="dialogLoading"
                    @negative="deleteLocalDataDialogShown = false"
                    @positive="deleteDatabases"
                  >
                    <template #activator="{ on }">
                      <v-btn text color="red" v-on="on">
                        Delete local data{{
                          databaseSize
                            ? " (" + Math.floor(databaseSize / 1024) + " KB)"
                            : ""
                        }}
                      </v-btn>
                    </template>
                    Deleting stored local data forces Jeff to refetch all your
                    household data remotely. Pages will load slower and actions
                    will take longer to perform until the cache is repopulated.
                    Note that this will not clear cached application assets.
                    Continue?
                  </confirm-dialog>
                  <!-- Logout -->
                  <confirm-dialog
                    v-model="logoutDialogShown"
                    :max-width="500"
                    positive-option="Logout"
                    negative-option="Cancel"
                    invert-colors
                    title="Logout and clear local data?"
                    :loading="dialogLoading"
                    @negative="logoutDialogShown = false"
                    @positive="logout"
                  >
                    <template #activator="{ on }">
                      <v-btn text color="red" v-on="on">
                        Logout
                      </v-btn>
                    </template>
                    Logging out causes all authorization data saved on your
                    machine to expire and all local household data to be
                    deleted. Except for changing accounts, logging out is
                    usually not necessary. Continue?
                  </confirm-dialog>
                  <!-- Delete account -->
                  <confirm-dialog
                    v-model="deleteAccountDialogShown"
                    :max-width="500"
                    positive-option="Delete account"
                    negative-option="Cancel"
                    invert-colors
                    title="Permanently delete your account?"
                    :loading="dialogLoading"
                    @negative="deleteAccountDialogShown = false"
                    @positive="deleteAccount"
                  >
                    <template #activator="{ on }">
                      <v-btn text color="red" v-on="on">
                        Delete account
                      </v-btn>
                    </template>
                    <p>
                      All your personal data (i.e. name, email, password, and
                      nickname) will be permanently deleted from our server and
                      from this device. Your household will remember you by the
                      beautiful name of "Unknown User" and all your expenses and
                      former tasks will remind them of you in a melancholic yet
                      heartwarming way. You are to be logged out of this
                      application and it will be as if all this never happened.
                      Still - never will you be forgotten, Unknown User.
                    </p>
                    <p>
                      But seriously: <b>This action cannot be undone.</b> So, to
                      end with the inspiring words of one of the great minds of
                      our time:
                    </p>
                    <blockquote class="blockquote">
                      Ooh, think twice.<br />
                      - Phil Collins
                    </blockquote>
                  </confirm-dialog>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <!-- Latest expenses -->
          <v-col cols="12" md="6">
            <v-card :elevation="6">
              <v-card-title>{{ $t("profile.expenses") }}</v-card-title>
              <v-card-text>
                <v-list v-if="expenses.length > 0">
                  <v-list-item v-for="(exp, i) in expenses" :key="i">
                    <v-list-item-content>
                      <v-list-item-title>
                        <v-row
                          ><v-col cols="8">
                            {{ exp.description }}
                          </v-col>
                          <v-col cols="4" style="text-align: right;">
                            {{ getCurrency((exp.amount / 100).toFixed(2)) }}
                          </v-col>
                        </v-row>
                      </v-list-item-title>
                      <v-list-item-subtitle>{{
                        formatDateRelative(exp.date)
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
                <div v-else class="text-center text--secondary mt-8 mb-8">
                  {{ $t("profile.noExpenses") }}
                </div>
              </v-card-text>
              <v-card-title>{{ $t("profile.monthlyExpenses") }}</v-card-title>
              <v-card-text>
                <v-list v-if="getFilteredMonthlyCharges.length > 0">
                  <v-list-item
                    v-for="(exp, i) in getFilteredMonthlyCharges"
                    :key="i"
                  >
                    <v-list-item-icon>
                      <v-icon class="mt-1">{{ getIcon(exp.icon) }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>
                        <v-row
                          ><v-col cols="8">
                            {{ exp.name }}
                          </v-col>
                          <v-col cols="4" style="text-align: right;">
                            {{ getCurrency(exp.amount.toFixed(2)) }}
                          </v-col>
                        </v-row>
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
                <div v-else class="text-center text--secondary mt-8 mb-8">
                  {{ $t("profile.noMonthlyExpenses") }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <!-- Tasks log -->
          <v-col cols="12" md="6">
            <TasksLogCard
              :user-images="userImages"
              :tasks="getTasks"
              :loading="loading"
              headless
            ></TasksLogCard>
          </v-col>
        </v-row>
      </v-col> </v-row
  ></v-container>
</template>

<script>
import ProfileEdit from "@/components/ProfileEdit.vue";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog.vue";
import TasksLogCard from "@/components/TasksLogCard.vue";
import { fetchProfileImg } from "@/assets/profileimagesHelper.js";
import { mapState, mapGetters } from "vuex";
import icons from "@/assets/icons.js";
import { db } from "@/store/LocalAppStore";

export default {
  name: "Profile",
  components: {
    ProfileEdit,
    TasksLogCard,
    ConfirmDialog
  },
  data: () => ({
    userImages: {},
    editMode: false,
    loading: false,
    profilePictureExists: false,
    imageSource: "",
    expenses: [],
    monthlyCharges: [],
    databaseSize: null,
    deleteLocalDataDialogShown: false,
    logoutDialogShown: false,
    deleteAccountDialogShown: false,
    dialogLoading: false
  }),
  computed: {
    getTasks() {
      return this.loggedTasks.filter(task => task.working == this.uid);
    },
    getFilteredMonthlyCharges() {
      return this.monthlyCharges.filter(
        charge => !charge.allMode && charge.responsibleUser == this.uid
      );
    },
    ...mapState("tasks", ["loggedTasks"]),
    ...mapState([
      "uid",
      "userEmail",
      "userFirstName",
      "userLastName",
      "userNickName",
      "userInitials",
      "profilePictureData"
    ]),
    ...mapGetters(["hasProfilePicture"]),
    ...mapGetters("userSettings", ["formatDateRelative"])
  },
  mounted() {
    this.loading = true;
    const prom1 = this.$store.dispatch("fetchProfileImg");
    const prom2 = this.$store.dispatch("tasks/fetchTasks");
    const prom3 = this.fetchExpenses();
    const prom4 = this.fetchMonthlyData();
    Promise.all([prom1, prom2, prom3, prom4]).then(() => {
      this.loggedTasks.forEach(async task => {
        if (!this.userImages[task.assigned]) {
          this.$set(
            this.userImages,
            task.assigned,
            await fetchProfileImg(task.assigned)
          );
        }
      });
      this.loading = false;
    });
    this.estimateLocalStorage();
  },
  methods: {
    async fetchExpenses() {
      try {
        const { data } = await this.$http.get("/_/fetchfinances", {
          params: {
            ps: 5,
            uid: this.uid,
            s: "date",
            desc: true
          }
        });
        if (data.success) {
          this.expenses = data.data;
        } else {
          this.$store.dispatch(
            "showSnackbar",
            this.$t("profile.errors.fetchUserExpensesFailed")
          );
          console.warn(data);
        }
      } catch (err) {
        this.$store.dispatch(
          "showSnackbar",
          this.$t("profile.errors.fetchUserExpensesError")
        );
        console.error(err);
      }
    },
    async fetchMonthlyData() {
      try {
        const { data } = await this.$http.get("/_/fetchmonthlycharges");
        if (data.success) {
          this.monthlyCharges = [];
          data.data.forEach(charge => {
            let user, allMode;
            if (charge.uid == -1) {
              user = "ALL";
              allMode = true;
            } else {
              user = charge.uid;
              allMode = false;
            }
            this.monthlyCharges.push({
              name: charge.name,
              amount: charge.amount / 100,
              icon: charge.icon,
              responsibleUser: user,
              all: allMode
            });
          });
        } else {
          this.$store.dispatch(
            "showSnackbar",
            this.$t("profile.errors.fetchMonthlyExpensesFailed")
          );
          console.warn("Error during fetching monthly data", data);
        }
      } catch (err) {
        this.$store.dispatch(
          "showSnackbar",
          this.$t("profile.errors.fetchMonthlyExpensesError")
        );
        console.error("Error during fetching monthly data");
      }
    },
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
    getCurrency(val) {
      if (val == 0) {
        val = 0.0;
      }
      return new Intl.NumberFormat(
        this.$store.state.userSettings.locale || undefined,
        {
          style: "currency",
          currency: this.$store.state.userSettings.currency
        }
      ).format(val);
    },
    getIcon(id) {
      return icons[id];
    },
    estimateLocalStorage() {
      navigator.storage
        .estimate()
        .then(res => {
          this.databaseSize =
            res && res.usageDetails ? res.usageDetails.indexedDB : null;
        })
        .catch(() => {
          this.databaseSize = null;
        });
    },
    async deleteDatabases() {
      this.dialogLoading = true;
      await db.delete();
      this.dialogLoading = false;
      this.deleteLocalDataDialogShown = false;
      this.$store.dispatch("showSnackbar", "All local data deleted.");
      this.estimateLocalStorage();
    },
    async logout() {
      this.dialogLoading = true;
      await db.delete();
      this.$store.dispatch("logout");
      delete this.$http.defaults.headers.common["x-access-token"];
      this.dialogLoading = false;
      this.logoutDialogShown = false;
      window.location.href = "/";
    },
    async deleteAccount() {
      this.dialogLoading = true;
      try {
        const { data } = await this.$http.post("/_/deleteaccount");
        if (data.success) {
          await db.delete();
          this.$store.dispatch("logout");
          delete this.$http.defaults.headers.common["x-access-token"];
          this.dialogLoading = false;
          this.logoutDialogShown = false;
          window.location.href = "/";
        } else {
          this.$store.dispatch(
            "showSnackbar",
            data.message || "Deleting account failed."
          );
        }
      } catch (err) {
        this.$store.dispatch(
          "showSnackbar",
          "Could not establish contact to server."
        );
        console.warn(err);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.trans {
  transition: all 0.5s ease-out;
}
</style>
