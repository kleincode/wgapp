<template>
  <v-dialog v-model="dialogShown" max-width="800" scrollable>
    <v-card :loading="loading">
      <v-card-title class="headline" primary-title>
        {{ $t("finances.receipt.title") }} - {{ expense.description }} -
        {{ getCurrency(expense.amount / 100) }}
      </v-card-title>

      <v-card-text>
        <div v-if="!receiptExists" class="pt-12 pb-12 grey--text">
          {{
            loading ? $t("finances.receipt.load") : $t("finances.receipt.noRec")
          }}
        </div>
        <v-row justify="center">
          <img
            v-if="receiptExists"
            :src="imageSource"
            style="max-width: 100%; max-height: 600px;"
          />
        </v-row>
        <v-row v-if="!receiptExists">
          <v-col cols="12" md="8" lg="9">
            <v-file-input
              v-model="receiptFile"
              type="file"
              accept="image/png, image/jpeg, image/bmp"
              :placeholder="$t('finances.receipt.upload')"
              prepend-icon="mdi-camera"
              :label="$t('finances.receipt.lbl')"
            ></v-file-input>
          </v-col>
          <v-col cols="12" md="4" lg="3">
            <v-btn
              color="primary"
              class="mt-3"
              :block="$vuetify.breakpoint.mdAndUp"
              :disabled="!receiptFile"
              @click="triggerUpload"
            >
              {{ $t("commands.upload") }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-btn
          v-if="receiptExists"
          text
          class="ml-3 mt-3"
          color="red"
          @click="deleteReceipt"
        >
          {{ $t("finances.receipt.del") }}
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn text @click="dialogShown = false">
          {{ $t("commands.close") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import Compressor from "compressorjs";

export default {
  name: "ReceiptDialog",
  data: () => ({
    expense: {},
    receiptFile: null,
    dialogShown: false,
    loading: false,
    imageSource: "",
    receiptExists: false
  }),
  methods: {
    open(expense) {
      this.expense = expense;
      this.receiptFile = null;
      this.fetchReceipt();
      this.dialogShown = true;
    },
    async triggerUpload() {
      if (!this.receiptFile) {
        this.$store.dispatch(
          "showSnackbar",
          this.$t("finances.receipt.imgHint")
        );
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
            this.$t("finances.receipt.compressHint")
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
          this.$store.dispatch(
            "showSnackbar",
            this.$t("finances.receipt.successUpload")
          );
          setTimeout(() => this.fetchReceipt(), 200);
        } else {
          this.$store.dispatch(
            "showSnackbar",
            data.message || this.$t("finances.receipt.upErr")
          );
        }
        this.loading = false;
      } catch (err) {
        this.$store.dispatch("showSnackbar", this.$t("finances.receipt.upErr"));
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
          this.$store.dispatch(
            "showSnackbar",
            this.$t("finances.receipt.successDel")
          );
        } else
          this.$store.dispatch(
            "showSnackbar",
            data.message || this.$t("finances.receipt.delFail")
          );
        this.loading = false;
        setTimeout(() => this.fetchReceipt(), 200);
      } catch (err) {
        this.$store.dispatch(
          "showSnackbar",
          this.$t("finances.receipt.delErr")
        );
        console.error(err);
        this.loading = false;
      }
    },

    async fetchReceipt() {
      this.receiptExists = false;
      this.loading = true;
      try {
        const { data, headers } = await this.$http.get("/_/fetchreceipt", {
          params: {
            fid: this.expense.fid
          },
          responseType: "arraybuffer"
        });
        if (
          headers &&
          headers["content-type"] !== "application/json; charset=utf-8"
        ) {
          const buffer = Buffer.from(data, "binary").toString("base64");
          this.imageSource = `data:${headers["content-type"]};base64,${buffer}`;
          this.receiptExists = true;
        }
        this.loading = false;
      } catch (err) {
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
