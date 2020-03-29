<template>
  <md-card md-with-hover class="md-transparent">
    <md-ripple>
      <md-card-header>
        <div class="md-subhead">{{ title }}</div>
      </md-card-header>
      <md-card-content>
        <slot></slot>
      </md-card-content>
    </md-ripple>
  </md-card>
</template>

<script>
export default {
  name: "Widget",
  props: {
    title: String
  }
};
</script>
