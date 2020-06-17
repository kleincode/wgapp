<template>
  <HelpArticle title="Tasks" :path="path">
    <template v-slot:content>
      <h2>First Header</h2>
      <p>
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
        eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
        voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
        clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
        amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
        nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
        sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
        rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem
        ipsum dolor sit amet.
      </p>
    </template>
  </HelpArticle>
</template>
<script>
import HelpArticle from "@/components/HelpArticle.vue";
export default {
  name: "TasksHelp",
  components: { HelpArticle },
  data: () => ({
    path: [
      {
        text: "Roomie",
        to: { name: "Help" },
        exact: true,
        disabled: false
      },
      {
        text: "Tasks",
        disabled: true,
        exact: true,
        to: { name: "Help" }
      }
    ]
  })
};
</script>
