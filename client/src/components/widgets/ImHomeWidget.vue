<template>
  <Widget
    :title="$t('widgets.home.title')"
    :context-items="contextItems"
    class="text-center"
    :large="homeWidgetLarge"
    @context-action="contextAction"
    @togglesize="homeWidgetLarge = !homeWidgetLarge"
  >
    <v-row style="height: 80%" align="center" justify="center">
      <v-col cols="12" class="text-center">
        <v-btn icon x-large @click="bell"
          ><v-icon x-large>notifications_active</v-icon></v-btn
        >
        <br />
        <p class="display-1">{{ $t("widgets.home.msg") }}</p>
      </v-col>
    </v-row>
  </Widget>
</template>
<script>
import Widget from "./Widget";

export default {
  name: "ImHomeWidget",
  components: {
    Widget
  },
  computed: {
    contextItems() {
      return [
        {
          action: "settings",
          text: this.$t("widgets.settings"),
          icon: "settings"
        }
      ];
    },
    homeWidgetLarge: {
      set(val) {
        this.$store.commit("userSettings/set_key", {
          key: "homeWidgetLarge",
          value: val
        });
      },
      get() {
        return this.$store.state.userSettings.homeWidgetLarge;
      }
    }
  },
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
