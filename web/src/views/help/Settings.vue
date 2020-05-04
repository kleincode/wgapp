<template>
  <HelpArticle title="Settings" :path="path">
    <template v-slot:content>
      <div class="headline mb-1 font-weight-bold">Settings</div>

      <p class="text-justify body-1">
        Just learned a new language and ready to try it out? Just change your
        settings.
      </p>
      <div class="title mb-1">General</div>
      <p class="text-justify body-1">
        Only general stuff going on here.
      </p>

      <p class="text-justify body-1">
        <b>Appearance:</b> If your eyes are dazzled by the screen light in the
        middle of the night, set the "darke mode" here.
      </p>
      <p class="text-justify body-1">
        <b>Locale:</b> Dates, times and currency are set according to the local
        settings.
      </p>
      <v-alert type="info" color="primary lighten-1">
        Note that the currency setting only changes the symbol used for
        displaying money amounts. No conversion is applied. If your household is
        an international conglomerate, we apologize for the inconvenience caused
        by this inadequacy.
      </v-alert>

      <p class="text-justify body-1">
        <b>Notifcations:</b> If you allow notifications, you can be reminded not
        only by the app, but also by your roommates, to make sure you don't
        forget anything.
      </p>
      <div class="title mb-1">Set your dashboard</div>
      <p class="text-justify body-1">
        Choose from four possible widgets which you would like to see on your
        home screen.
      </p>
      <p class="text-justify body-1">
        <b>Clock Widget:</b> To be the one who always has the most important
        answers at hand, activate the clock.
      </p>
      <v-alert type="info" color="primary lighten-1">
        Notice that the clock widget displays the time according to your locale
        settings.</v-alert
      >
      <p class="text-justify body-1">
        <b>Weather Widget:</b> To see a little bit into the future, you can view
        the weather forecast for your city. To do so, you have to create an
        account under "Open Weather Map". Once you have signed in, you can
        create a key under "API keys". You have to insert this key in the app's
        settings and enter your zip code. Check and confirm your settings with
        "check" and you're done.
      </p>
      <p class="text-justify body-1">
        <b>Tasks Widget:</b> To get an overview of all tasks, activate the
        "Tasks Widget".
      </p>
      <p class="text-justify body-1">
        <b>Finances Widget:</b> With this widget you can see the latest expances
        of your roommates.
      </p>
      <div class="title mb-1">Integration</div>
      <p class="text-justify body-1">
        Use the Integration-feature and migrate all your duties to your Google
        Calendar. All you have to do is activate the integration and log in with
        your Google account. Under "Calendar" you are in full control of your
        appointments.
      </p>
    </template>
  </HelpArticle>
</template>
<script>
import HelpArticle from "@/components/HelpArticle.vue";
export default {
  name: "SettingsHelp",
  components: { HelpArticle },
  data: () => ({
    path: [
      {
        text: "Jeff",
        to: { name: "Help" },
        exact: true,
        disabled: false
      },
      {
        text: "Settings",
        disabled: true,
        exact: true,
        to: { name: "Help" }
      }
    ]
  })
};
</script>
