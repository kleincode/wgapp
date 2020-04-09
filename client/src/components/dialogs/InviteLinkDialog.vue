<template>
  <v-dialog v-model="dialogShown" max-width="500" @input="dialogChange">
    <template v-slot:activator="{ on }">
      <v-btn text color="primary" v-on="on">
        <v-icon left>group_add</v-icon>
        Invite
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="headline">Invite members</v-card-title>
      <v-card-text>
        <p>Please use this link to invite members to join this household:</p>
        <v-text-field
          v-model="householdLink"
          readonly
          append-icon="assignment"
          @click:append="copyAddLink"
          ref="addLink"
          outlined
          :loading="loading"
          :disabled="loading"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="dialogShown = false">Close</v-btn>
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
      this.$store.dispatch(
        "showSnackbar",
        "Copied to clipboard. Happy pasting! :)"
      );
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
              data.message ||
                "Error fetching invite link. Please try again later."
            );
            this.dialogShown = false;
          }
          this.loading = false;
        } catch (err) {
          this.$store.dispatch(
            "showSnackbar",
            "Error fetching invite link. Please try again later."
          );
          this.dialogShown = false;
        }
    }
  }
};
</script>
