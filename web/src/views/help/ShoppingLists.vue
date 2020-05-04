<template>
  <HelpArticle title="Shopping Lists" :path="path">
    <template v-slot:content>
      <div class="headline mb-1 font-weight-bold">Shopping Lists</div>
      <p class="text-justify body-1">
        To throw epic house parties, you have to do a lot of shopping. Big plans
        have to be organized. Well, you've come to the right place.
      </p>
      <div class="title mb-1">Start shopping</div>
      <p class="text-justify body-1">
        First you have to create a new list by clicking on "New Shoppinglist".
        After you have chosen a name and a symbol, you can add wish purchases.
        If you don't know yet what do get? Try the autocompletion.
      </p>
      <p class="text-justify body-1">
        For each entry a box will be created that can be checked as soon as this
        point is settled. If you select any shopping list on the left side, you
        will see on the right side next to the articles also the current
        progress in the upper right corner.
      </p>

      <div class="title mb-1">Tranfer to finances</div>
      <p class="text-justify body-1">
        Finished shopping lists, can be transferred to the finances. You can
        transfer finished shopping lists to your finances. All you have to do is
        select the finished list and hit "transfer to finances". In the next
        step you can enter the value of the purchase and with the confirmation
        the costs will be added to your "Finances-account".
      </p>
      <v-alert type="info" color="primary lighten-1"
        >Note that once you transfered you can decide weather you want to delete
        or reactivate the list for a reuse.
      </v-alert>
    </template>
  </HelpArticle>
</template>
<script>
import HelpArticle from "@/components/HelpArticle.vue";
export default {
  name: "ShoppingListsHelp",
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
        text: "Shopping Lists",
        disabled: true,
        exact: true,
        to: { name: "Help" }
      }
    ]
  })
};
</script>
