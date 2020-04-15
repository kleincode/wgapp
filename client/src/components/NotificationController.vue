<template>
  <div>
    <v-switch
      v-model="notificationsEnabled"
      label="Enable push notifications"
      :loading="loading"
      :disabled="loading || notPermDenied"
      @change="onSwitchToggle"
    ></v-switch>
    <!-- Warning if no service worker is registered -->
    <v-alert v-if="_initialized && !isServiceWorkerRegistered" type="warning">
      Your system does not support push notifications.<br />
      (No service worker found)
    </v-alert>
    <!-- Warning if push registration failed -->
    <v-alert v-if="notRegFailed && !notPermDenied" type="error">
      Enabling push notifications failed.<br />
      ({{ notRegMessage }})
    </v-alert>
    <!-- Warning if push permission denied -->
    <v-alert v-if="notPermDenied" type="warning">
      The permission to send push notifications was denied on your system.
      Please check your website settings and allow them if you want to use this
      feature.
    </v-alert>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";

const pushpk =
  "BMum53keG-6pczsbC5uAMMtbEEJoUTdNXiZTF4tAJm-Y9hAIW_fJFhlb1FakepVV2kfX9feuUaXp3xHrVVb35hw";

function urlB64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default {
  name: "NotificationController",
  data: () => ({
    notificationsEnabled: false,
    loading: false,
    notRegFailed: false,
    notRegMessage: "",
    notPermDenied: false
  }),
  computed: {
    ...mapState(["serviceWorker"]),
    ...mapState("userSettings", ["_initialized"]),
    ...mapGetters(["isServiceWorkerRegistered"])
  },
  watch: {
    serviceWorker(sw) {
      this.checkNotificationsEnabled(sw);
      this.notPermDenied = sw && Notification.permission === "denied";
    }
  },
  mounted() {
    if (this.isServiceWorkerRegistered) {
      this.checkNotificationsEnabled(this.serviceWorker);
    }
    this.notPermDenied =
      this.isServiceWorkerRegistered && Notification.permission === "denied";
  },
  methods: {
    async checkNotificationsEnabled(sw) {
      if (!sw) this.notificationsEnabled = false;
      else {
        let subscription = await sw.pushManager.getSubscription();
        this.notificationsEnabled = subscription !== null;
      }
    },
    async onSwitchToggle(val) {
      this.loading = true;
      this.notRegFailed = false;
      if (!this.isServiceWorkerRegistered) {
        setTimeout(() => {
          this.notificationsEnabled = false;
          this.loading = false;
        }, 500);
      } else if (val) {
        // enable push notifications
        const applicationServerKey = urlB64ToUint8Array(pushpk);
        try {
          const subscription = await this.serviceWorker.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey
          });
          await this.updateSubscriptionOnServer(subscription);
          this.notificationsEnabled = true;
          this.loading = false;
        } catch (err) {
          console.warn("Failed to subscribe user", err);
          this.notRegFailed = true;
          this.notRegMessage = err;
          setTimeout(() => {
            this.notificationsEnabled = false;
            this.loading = false;
            this.notPermDenied =
              this.isServiceWorkerRegistered &&
              Notification.permission === "denied";
          }, 100);
        }
      } else {
        //disable push notifications
        try {
          const subscription = await this.serviceWorker.pushManager.getSubscription();
          if (subscription) {
            await subscription.unsubscribe();
          }
        } catch (err) {
          console.warn("Failed to unsubscribe user", err);
        }
        this.loading = false;
      }
    },
    async updateSubscriptionOnServer(subscription) {
      console.log(subscription);
      await this.$http.post("/_/subscribepush", subscription);
    }
  }
};
</script>
