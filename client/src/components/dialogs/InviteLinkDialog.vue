<template>
  <v-dialog v-model="dialogShown" max-width="500" @input="dialogChange">
    <template v-slot:activator="{ on }">
      <v-btn text color="primary" v-on="on">
        <v-icon left>group_add</v-icon>
        {{ $t("household.invite.inviteButton") }}
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="headline">{{
        $t("household.invite.title")
      }}</v-card-title>
      <v-card-text>
        <p>{{ $t("household.invite.inviteMessage") }}:</p>
        <v-text-field
          ref="addLink"
          v-model="householdLink"
          readonly
          append-icon="assignment"
          outlined
          :loading="loading"
          :disabled="loading"
          @click:append="copyAddLink"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="dialogShown = false">{{
          $t("commands.close")
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: "InviteLinkDialog",
  data: () => ({
    dialogShown: false,
    loading: false,
    hid: "",
    sec: 0
  }),
  computed: {
    householdLink() {
      return this.loading
        ? "Loading..."
        : window.location.origin +
            `/household/join?h=${this.hid}&s=${this.sec}`;
    }
  },
  methods: {
    copyAddLink(event) {
      this.$refs.addLink.$refs.input.select();
      document.execCommand("copy");
      event.target.focus();
      this.$store.dispatch("showSnackbar", this.$t("household.invite.copied"));
    },
    async dialogChange(state) {
      if (state)
        try {
          this.loading = true;
          const { data } = await this.$http.get("/_/fetchinvitelink");
          if (data.success) {
            this.hid = data.hid;
            this.sec = data.sec;
          } else {
            this.$store.dispatch(
              "showSnackbar",
              data.message || this.$t("household.invite.fail")
            );
            this.dialogShown = false;
          }
          this.loading = false;
        } catch (err) {
          this.$store.dispatch(
            "showSnackbar",
            this.$t("household.invite.error")
          );
          this.dialogShown = false;
        }
    }
  }
};
</script>
