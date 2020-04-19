<template>
  <Widget title="Tasks" :content-pad="false">
    <v-carousel
      cycle
      hide-delimiter-background
      :show-arrows="false"
      height="100"
      delimiter-icon="fiber_manual_record"
      class="bottom-carousel"
    >
      <v-carousel-item class="pl-5 pr-5">
        <p>1. Aufgabe - Max</p>
      </v-carousel-item>
      <v-carousel-item class="pl-5 pr-5">
        <p>2. Aufgabe - Gundula</p>
      </v-carousel-item>
    </v-carousel>
    <div style="height: 100px;"></div>
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
<style lang="scss" scoped>
.bottom-carousel {
  position: absolute;
  bottom: 0;
}
</style>
