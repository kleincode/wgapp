<template>
  <Widget title="Tasks">
    <div class="md-body-2">1. Einkaufen - Matti</div>
    <div class="md-body-1">2. Müll rausbringen - Matti</div>
    <div class="md-body-1">3. Bad putzen - Matti</div>
  </Widget>
</template>

<script>
import Widget from "./Widget";

export default {
  name: "TasksWidget",
  components: {
    Widget
  }
};
</script>
