<template>
  <v-dialog v-model="dialog" width="800">
    <template v-slot:activator="{ on }">
      <v-btn small icon class="mr-2" v-on="on"
        ><v-icon>camera_alt</v-icon></v-btn
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
            >
              <div class="pt-12 pb-12 grey--text">
                No receipt uploaded yet
              </div>
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
              text
              block
              :disabled="receiptExists"
              @click="triggerUpload"
            >
              upload
            </v-btn>
            <v-btn text block :disabled="!receiptExists" @click="deleteReceipt">
              delete receipt
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
    receiptExists: true
  }),
  methods: {
    async triggerUpload() {
      this.loading = true;
      if (!this.receiptFile) {
        this.$store.dispatch("showSnackbar", "Please specify an image");
        return;
      }
      new Compressor(this.receiptFile, {
        quality: 0.6,
        convertSize: 500000, //0.5MB png => converted to jpg
        async success(result) {
          await this.upload(result);
          this.loading = false;
        },
        error(err) {
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
      let formData = new FormData();
      formData.append("fid", this.expense.fid);
      formData.append("receiptPicture", result);
      try {
        await this.$http.post("/_/uploadreceipt", formData, {
          headers: {
            "content-type": "multipart/form-data"
          }
        });
        this.$store.dispatch("showSnackbar", "Receipt uploaded");
      } catch (err) {
        this.$store.dispatch("showSnackbar", "Error while uploading receipt.");
        console.error(err);
        this.loading = false;
      }
    },

    async deleteReceipt() {
      try {
        this.loading = true;
        const { data } = await this.$http.post("/_/deletereceipt", {
          fid: this.expense.fid
        });
        this.$store.dispatch("showSnackbar", data.message);
        this.loading = false;
      } catch (err) {
        this.$store.dispatch("showSnackbar", "Error while deleting receipt.");
        console.error(err);
        this.loading = false;
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
