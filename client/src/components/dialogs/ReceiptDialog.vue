<template>
  <v-dialog v-model="dialog" width="800">
    <template v-slot:activator="{ on }">
      <v-btn small icon class="mr-2" v-on="on"
        ><v-icon small>camera_alt</v-icon></v-btn
      >
    </template>

    <v-card :loading="loading">
      <v-card-title class="headline" primary-title>
        Receipt - {{ expense.description }} -
        {{ getCurrency(expense.amount / 100) }}
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-card
              class="ml-8 mr-8"
              color="grey darken-4"
              style="text-align: center"
              :loading="imageLoading"
            >
              <div v-if="!receiptExists" class="pt-12 pb-12 grey--text">
                {{
                  imageLoading
                    ? "Loading receipt..."
                    : "No receipt uploaded yet"
                }}
              </div>
              <v-img
                v-if="receiptExists"
                :src="imageSource"
                height="400"
                contain
              ></v-img>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-file-input
              v-model="receiptFile"
              type="file"
              accept="image/png, image/jpeg, image/bmp"
              placeholder="Upload your receipt"
              prepend-icon="mdi-camera"
              label="Receipt"
            ></v-file-input>
            <v-btn
              color="primary"
              class="mt-3"
              :disabled="!receiptFile"
              @click="triggerUpload"
            >
              {{ receiptExists ? "Replace" : "Upload" }}
            </v-btn>
            <v-btn
              text
              class="ml-3 mt-3"
              :disabled="!receiptExists"
              @click="deleteReceipt"
            >
              Delete receipt
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="dialog = false">
          close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import Compressor from "compressorjs";

export default {
  name: "ReceiptDialog",
  props: {
    expense: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    receiptFile: null,
    dialog: false,
    loading: false,
    imageSource: "",
    receiptExists: false,
    imageLoading: true
  }),
  watch: {
    dialog(val) {
      if (val) {
        this.fetchReceipt();
      }
    }
  },
  methods: {
    async triggerUpload() {
      if (!this.receiptFile) {
        this.$store.dispatch("showSnackbar", "Please specify an image");
        return;
      }
      this.loading = true;
      new Compressor(this.receiptFile, {
        quality: 0.6,
        convertSize: 0, // always convert to jpeg
        maxWidth: 800,
        maxHeight: 800,
        success: async result => {
          await this.upload(result);
          this.loading = false;
        },
        error: err => {
          this.$store.dispatch(
            "showSnackbar",
            "Error while compressing the image."
          );
          console.log(err.message);
          this.loading = false;
        }
      });
    },

    async upload(result) {
      this.loading = true;
      let formData = new FormData();
      formData.append("fid", this.expense.fid);
      formData.append("receiptPicture", result);
      try {
        const { data } = await this.$http.post("/_/uploadreceipt", formData, {
          headers: {
            "content-type": "multipart/form-data"
          }
        });
        if (data.success) {
          this.$store.dispatch("showSnackbar", "Receipt uploaded");
          setTimeout(() => this.fetchReceipt(), 200);
        } else {
          this.$store.dispatch("showSnackbar", data.message || "Upload error");
        }
        this.loading = false;
      } catch (err) {
        this.$store.dispatch("showSnackbar", "Error while uploading receipt.");
        console.error(err);
        this.loading = false;
      }
    },

    async deleteReceipt() {
      this.loading = true;
      try {
        const { data } = await this.$http.post("/_/delreceipt", {
          fid: this.expense.fid
        });
        if (data.success) {
          this.$store.dispatch("showSnackbar", "Receipt deleted.");
        } else
          this.$store.dispatch(
            "showSnackbar",
            data.message || "Could not delete receipt."
          );
        this.loading = false;
        setTimeout(() => this.fetchReceipt(), 200);
      } catch (err) {
        this.$store.dispatch("showSnackbar", "Error while deleting receipt.");
        console.error(err);
        this.loading = false;
      }
    },

    async fetchReceipt() {
      this.receiptExists = false;
      this.imageLoading = true;
      try {
        const { data, headers } = await this.$http.get("/_/fetchreceipt", {
          params: {
            fid: this.expense.fid
          },
          responseType: "arraybuffer"
        });
        if (headers["content-type"] !== "application/json; charset=utf-8") {
          const buffer = Buffer.from(data, "binary").toString("base64");
          this.imageSource = `data:${headers["content-type"]};base64,${buffer}`;
          this.receiptExists = true;
        }
        this.imageLoading = false;
      } catch (err) {
        console.error(err);
        this.imageLoading = false;
      }
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
    }
  }
};
</script>
