<template>
  <HelpArticle title="General" :path="path">
    <template v-slot:content>
      <div class="headline mb-1 font-weight-bold">General</div>
      <p class="text-justify body-1">
        So that everyone can see who has just cleaned the bathroom, set a
        profile picture!
      </p>
      <div class="title mb-1">My Profile</div>
      <p class="text-justify body-1">
        This place isn't just to manage your profile but also to take a look on
        each of your charitable deeds. However to upload your latest profile
        picture or change your password, click on "edit".
      </p>
      <v-alert type="info" color="primary lighten-1">
        You can also set a nickname, which will be used as the displayed name.
      </v-alert>
      <div class="title mb-1">Manage Household</div>
      <p class="text-justify body-1">
        Every member has the same rights and freedoms. Do you have a new
        roommate? With a link that you have to copy, each of you can expand your
        household. Also, no one can be kicked out, so if you move out, please
        vacate the premises.
      </p>
    </template>
  </HelpArticle>
</template>
<script>
import HelpArticle from "@/components/HelpArticle.vue";
export default {
  name: "GeneralHelp",
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
        text: "General",
        disabled: true,
        exact: true,
        to: { name: "Help" }
      }
    ]
  })
};
</script>
