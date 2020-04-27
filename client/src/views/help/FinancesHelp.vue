<template>
  <v-container>
    <div class="headline mb-1 font-weight-bold">Finances</div>
    <p class="text-justify body-1">
      While living in a shared apartment, there are always expenses that benefit
      everyone. In order not to lose the overview, you can enter all these
      expenses under "Finances".
    </p>
    <div class="title mb-1">New Entry</div>
    <p class="text-justify body-1">
      If you have bought something for your shared apartment, click on "New
      Expence" and enter your expenditure. To show full transparency you can
      also upload the receipt here.
    </p>
    <p class="text-justify body-1">
      GIF: "Upload a receipt"
    </p>
    <v-alert type="info">
      If you don't feel like taking a picture of the receipt at the moment or to
      clear faults, you can add the bill later or edit your Entry under
      "Actions".</v-alert
    >
    <div class="title mb-1">Timespan</div>
    <p class="text-justify body-1">
      At the top right you can choose a time span over which the expances should
      be displayed. (This setting affects beside the "Member Expances" also the
      overview and the trendcurve below.)
    </p>
    <div class="title mb-1">Member Expances</div>
    <p class="text-justify body-1">
      "Member Expances" is a quick overview to see who has already spent how
      much over the selected period of time. If you click once on a name, you
      will see under "Expences" all the expenses belonging to him or her in the
      selected time period. A second click brings you back to the general view.
    </p>
    <p class="text-justify body-1">
      GIF: "Select member"
    </p>
    <div class="title mb-1">Monthly Charges</div>
    <p class="text-justify body-1">
      In every household there are also running costs, to keep an eye on these
      too, there is room for this under "Monthly charges".
    </p>
    <div class="title mb-1">Overview Expenses</div>
    <p class="text-justify body-1">
      To better define the financial frame, it is possible to specify a monthly
      limit here. In the display below, the previous expances are compared to
      the target. Monthly expenditures are calculated on the first of each
      month.
    </p>
    <div class="title mb-1">Bill Manager</div>
    <p class="text-justify body-1">
      Since not all errands cost the same, you may have to compensate. With the
      "Bill Manager" this happens automatically. Compensation payments are
      calculated for the costs incurred since the last bill, so that the
      expenses are in balance. You can also include your "Monthly Charges" in
      the bill. To order an invoice, go to "Save Payments". The order will be
      added to the history as red marked. For the settlement to be considered
      complete, everyone must check the box belonging to them after their
      payment. Only then does the red mark disappear. You can open and download
      an overview of an invoice under "Export".
    </p>
    <p class="text-justify body-1"></p>
    <p class="text-justify body-1"></p>
  </v-container>
</template>

<script>
export default {
  name: "FinancesHelp",
  data: () => ({})
};
</script>
