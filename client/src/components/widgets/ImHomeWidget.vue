<template>
  <Widget
    title="Home"
    :context-items="contextItems"
    class="text-center"
    @context-action="contextAction"
  >
    <v-btn icon x-large @click="bell"
      ><v-icon x-large>notifications_active</v-icon></v-btn
    >
    <br />
    <p class="display-1">"I'm home!"</p>
  </Widget>
</template>

<script>
import Widget from "./Widget";

export default {
  name: "ImHomeWidget",
  components: {
    Widget
  },
  data: () => ({
    contextItems: [
      {
        action: "settings",
        text: "Widget Settings",
        icon: "settings"
      }
    ]
  }),
  methods: {
    async bell() {
      try {
        const { data } = await this.$http.post("/_/imhome");
        if (data.success) {
          this.$store.dispatch("showSnackbar", "Notified members.");
        } else {
          console.log(data);
          this.$store.dispatch("showSnackbar", "Couldn't notify members.");
        }
      } catch (err) {
        console.error(err);
        this.$store.dispatch("showSnackbar", "Error notifing members.");
      }
    },
    contextAction(item) {
      switch (item.action) {
        case "settings":
          this.$router.push({ name: "DashboardSettings", hash: "#home" });
      }
    }
  }
};
</script>

<style></style>
