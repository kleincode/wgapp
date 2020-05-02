<template>
  <v-dialog v-model="dialog" width="500">
    <template v-slot:activator="{ on }">
      <v-btn
        icon
        x-large
        :color="
          hover ? (hasProfilePicture ? 'primary' : 'white') : 'transparent'
        "
        v-on="on"
        ><v-icon v-if="hasProfilePicture" x-large>edit</v-icon
        ><v-icon v-else x-large>add_photo_alternate</v-icon></v-btn
      >
    </template>
    <v-card>
      <v-container>
        <h2 class="mb-7">Upload Profile Picture</h2>
        <v-file-input
          v-model="imageFile"
          type="file"
          accept="image/png, image/jpeg, image/bmp"
          placeholder="Upload your profile picture"
          prepend-icon="mdi-camera"
          label="Profile Picture"
        ></v-file-input>
      </v-container>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="triggerUpload()">upload</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import Compressor from "compressorjs";
export default {
  name: "UploadProfileImageDialog",
  props: {
    hover: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    dialog: false,
    imageFile: null
  }),
  computed: {
    ...mapGetters(["hasProfilePicture"])
  },
  methods: {
    async triggerUpload() {
      if (!this.imageFile) {
        this.$store.dispatch("showSnackbar", "Please specify an image");
        return;
      }
      this.loading = true;
      new Compressor(this.imageFile, {
        quality: 0.6,
        convertSize: 0, // always convert to jpeg
        maxWidth: 800,
        maxHeight: 800,
        success: async result => {
          await this.upload(result);
          this.loading = false;
          this.dialog = false;
        },
        error: err => {
          this.$store.dispatch(
            "showSnackbar",
            "Error while compressing the image."
          );
          console.log(err.message);
          this.loading = false;
          this.dialog = false;
        }
      });
    },
    async upload(result) {
      this.loading = true;
      let formData = new FormData();
      formData.append("profilePicture", result);
      try {
        const { data } = await this.$http.post(
          "/_/uploadprofilepicture",
          formData,
          {
            headers: {
              "content-type": "multipart/form-data"
            }
          }
        );
        if (data.success) {
          this.$store.dispatch("showSnackbar", "Profile picture uploaded");
          setTimeout(() => this.$store.dispatch("fetchProfileImg"), 200);
        } else {
          this.$store.dispatch("showSnackbar", data.message || "Upload error");
        }
        this.loading = false;
      } catch (err) {
        this.$store.dispatch(
          "showSnackbar",
          "Error while uploading profile picture."
        );
        console.error(err);
        this.loading = false;
      }
    }
  }
};
</script>
