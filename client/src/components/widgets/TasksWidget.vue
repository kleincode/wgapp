<template>
  <Widget title="Tasks">
    <div class="body-1">1. Einkaufen - Matti</div>
    <div class="body-2">2. Müll rausbringen - Matti</div>
    <div class="body-2">3. Bad putzen - Matti</div>
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
