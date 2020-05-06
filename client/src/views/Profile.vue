<template>
  <v-container
    ><v-row justify="center">
      <v-col xl="9" lg="10" md="12">
        <h1 class="display-2 pb-6">{{ $t("profile.title") }}</h1>
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
                          {{ $t("profile.nick") }}
                        </div>
                        <h1 class="headline">{{ userNickName }}</h1>
                      </template>
                      <div class="overline mt-6">{{ $t("profile.mail") }}</div>
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
                  {{ $t("profile.noexpenses") }}
                </div>
              </v-card-text>
              <v-card-title>{{ $t("profile.monexpenses") }}</v-card-title>
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
                  {{ $t("profile.nomonexpenses") }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>
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
import TasksLogCard from "@/components/TasksLogCard.vue";
import { fetchProfileImg } from "@/assets/profileimagesHelper.js";
import { mapState, mapGetters } from "vuex";
import icons from "@/assets/icons.js";
export default {
  name: "Profile",
  components: {
    ProfileEdit,
    TasksLogCard
  },
  data: () => ({
    userImages: {},
    editMode: false,
    loading: false,
    profilePictureExists: false,
    imageSource: "",
    expenses: [],
    monthlyCharges: []
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
          this.$store.dispatch("showSnackbar", this.$t("profile.errors.users"));
          console.warn(data);
        }
      } catch (err) {
        this.$store.dispatch(
          "showSnackbar",
          this.$t("profile.errors.usersErr")
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
          this.$store.dispatch("showSnackbar", this.$t("profile.errors.mon"));
          console.warn("Error during fetching monthly data", data);
        }
      } catch (err) {
        this.$store.dispatch("showSnackbar", this.$t("profile.errors.monErr"));
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
    isDark() {
      return this.$theme.isDark;
    }
  }
};
</script>
<style lang="scss" scoped>
.trans {
  transition: all 0.5s ease-out;
}
</style>
