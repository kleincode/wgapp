<template>
  <div>
    <h1 class="headline">Edit profile</h1>
    <v-row>
      <v-col cols="12" md="6" lg="4" class="text-center">
        <v-hover v-slot:default="{ hover }">
          <v-avatar
            size="250"
            class="mb-2"
            :color="hasProfilePicture ? '' : 'primary'"
          >
            <div class="centered">
              <UploadProfileImageDialog
                :hover="hover"
              ></UploadProfileImageDialog>
            </div>
            <v-img
              v-if="hasProfilePicture"
              class="profileImage"
              :class="{ 'on-hover': hover }"
              :src="profilePictureData"
              alt="John"
            >
            </v-img>
            <span
              v-else
              class="profileImage white--text display-4"
              :class="{ 'on-hover': hover }"
              >{{ getInitials() }}</span
            >
          </v-avatar>
        </v-hover>
        <br />
        <v-btn text @click="deleteProfilePicture()">remove</v-btn>
      </v-col>
      <v-col cols="12" md="6" lg="8" class="pa-3">
        <v-text-field
          v-model="firstName"
          label="First name"
          outlined
        ></v-text-field>
        <v-text-field
          v-model="lastName"
          label="Last Name"
          outlined
        ></v-text-field>
        <v-text-field
          v-model="nickname"
          label="Nickname"
          outlined
          hint="Will be used as the displayed name"
        ></v-text-field>
        <v-text-field
          v-model="email"
          outlined
          :rules="emailRules"
          label="E-mail"
          required
        ></v-text-field>
        <v-text-field
          v-model="oldPassword"
          outlined
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="[passwordRules.min]"
          :type="showPassword ? 'text' : 'password'"
          name="input-10-2"
          label="Old Password"
          @click:append="showPassword = !showPassword"
        ></v-text-field>
        <v-text-field
          v-model="password1"
          outlined
          :append-icon="showPassword1 ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="[passwordRules.required, passwordRules.min]"
          :type="showPassword1 ? 'text' : 'password'"
          name="input-10-2"
          label="New Password"
          autocomplete="new-password"
          @click:append="showPassword1 = !showPassword1"
        ></v-text-field>
        <v-text-field
          v-model="password2"
          outlined
          :append-icon="showPassword2 ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="[passwordRules.required, passwordRules.min]"
          :type="showPassword2 ? 'text' : 'password'"
          name="input-10-2"
          label="Repeat New Password"
          autocomplete="new-password"
          @click:append="showPassword2 = !showPassword2"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text class="mr-4" color="error" @click="cancel">cancel</v-btn>
      <v-btn color="info" @click="save">save</v-btn>
    </v-card-actions>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import UploadProfileImageDialog from "@/components/dialogs/UploadProfileImageDialog.vue";
export default {
  name: "ProfileEdit",
  components: {
    UploadProfileImageDialog
  },
  props: {
    editMode: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    loading: false,
    deleteDialogVisible: false,
    firstName: "",
    lastName: "",
    nickname: "",
    email: "",
    emailRules: [
      v => !!v || "E-mail is required",
      v => /.+@.+\..+/.test(v) || "E-mail must be valid"
    ],
    oldPassword: "",
    password1: "",
    password2: "",
    showPassword: false,
    showPassword1: false,
    showPassword2: false,
    passwordRules: {
      required: value => !!value || "Required.",
      min: v => v.length >= 8 || "Min 8 characters"
    }
  }),
  computed: {
    ...mapState([
      "uid",
      "userEmail",
      "userFirstName",
      "userLastName",
      "userNickName",
      "profilePictureData"
    ]),
    ...mapGetters(["hasProfilePicture"])
  },
  watch: {
    editMode(newVal) {
      if (newVal) this.loadValues();
    }
  },
  mounted() {
    this.loadValues();
  },
  methods: {
    loadValues() {
      this.firstName = this.userFirstName;
      this.lastName = this.userLastName;
      this.nickname = this.userNickName;
      this.email = this.userEmail;
      this.oldPassword = "";
      this.password1 = "";
      this.password2 = "";
    },
    cancel() {
      this.$emit("close");
    },
    async save() {
      try {
        this.loading = true;
        let firstName = "";
        let lastName = "";
        let nickname = "";
        let mail = "";
        let password = "";
        let newPassword = "";
        if (this.firstName != "") {
          firstName = this.firstName;
        }
        if (this.lastName != "") {
          lastName = this.lastName;
        }
        if (this.nickname != "") {
          nickname = this.nickname;
        }
        if (this.mail != "") {
          mail = this.email;
        }
        if (
          this.oldPassword != "" &&
          this.password1 != "" &&
          this.password2 != ""
        ) {
          if (this.password1 != this.password2) {
            this.$store.dispatch(
              "showSnackbar",
              "Please repeat the new password correctly."
            );
            return;
          } else {
            password = this.oldPassword;
            newPassword = this.password1;
          }
        }

        const { data } = await this.$http.post("/_/updateprofile", {
          firstName,
          lastName,
          nickname,
          mail,
          password,
          newPassword
        });
        if (data.success) {
          this.loading = false;
          this.$emit("close");
          this.$store.commit("update_user", [
            this.uid,
            this.email,
            this.firstName,
            this.lastName,
            this.nickname
          ]);
          this.$store.dispatch("showSnackbar", "Successfully updated profile.");
        } else {
          console.log(data);
          this.$store.dispatch("showSnackbar", "Couldn't update profile.");
        }
      } catch (err) {
        this.loading = false;
        console.error(err);
        this.$store.dispatch("showSnackbar", "Error while updating profile.");
      }
    },
    async deleteProfilePicture() {
      try {
        const { data } = await this.$http.post("/_/deleteprofilepicture");
        if (data.success) {
          this.$store.dispatch(
            "showSnackbar",
            "Successfully deleted profile picture."
          );
          this.$store.commit("set_profile_picture", null);
        } else {
          this.$store.dispatch(
            "showSnackbar",
            "Couldn't delete profile picture."
          );
        }
      } catch (err) {
        console.error(err);
        this.$store.dispatch(
          "showSnackbar",
          "Error while deleting profile picture."
        );
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
    getEffect(hover) {
      if (hover) {
        return "to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)";
      } else {
        return "";
      }
    },
    isDark() {
      return !this.$theme.isDark;
    }
  }
};
</script>

<style scoped>
.repeating-gradient {
  background-image: repeating-linear-gradient(
    -45deg,
    rgba(255, 0, 0, 0.25),
    rgba(255, 0, 0, 0.25) 5px,
    rgba(0, 0, 255, 0.25) 5px,
    rgba(0, 0, 255, 0.25) 10px
  );
}
.profileImage {
  transition: all 0.2s ease-out;
}

.profileImage.on-hover {
  opacity: 0.36;
  filter: saturate(0.36);
}

.centered {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 20;
}
</style>
