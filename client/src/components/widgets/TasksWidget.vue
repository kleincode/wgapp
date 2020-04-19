<template>
  <Widget title="Tasks" :content-pad="false">
    <v-carousel
      cycle
      hide-delimiter-background
      :show-arrows="false"
      height="120"
      delimiter-icon="fiber_manual_record"
      class="bottom-carousel"
      :interval="10000"
    >
      <v-carousel-item class="pl-5 pr-5">
        <v-list-item class="mb-4">
          <v-list-item-avatar>
            <v-icon large>home</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="task-entry">
              First task
              <div class="overline pl-2 pt-1">- Today</div>
            </v-list-item-title>
            <v-list-item-subtitle>
              <v-chip small>
                <v-avatar style="max-height: 80%; max-width: 90%" left>
                  <img src="https://randomuser.me/api/portraits/men/81.jpg" />
                </v-avatar>
                Max Mustermann
              </v-chip>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-carousel-item>
      <v-carousel-item class="pl-5 pr-5">
        <v-list-item class="mb-4">
          <v-list-item-avatar>
            <v-icon large>home</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="task-entry">
              First task
              <div class="overline pl-2 pt-1">- Today</div>
            </v-list-item-title>
            <v-list-item-subtitle>
              <v-chip small>
                <v-avatar style="max-height: 80%; max-width: 90%" left>
                  <img src="https://randomuser.me/api/portraits/men/81.jpg" />
                </v-avatar>
                Max Mustermann
              </v-chip>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-carousel-item>
      <v-carousel-item class="pl-5 pr-5">
        <v-list-item class="mb-4">
          <v-list-item-avatar>
            <v-icon large>home</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="task-entry">
              First task
              <div class="overline pl-2 pt-1">- Today</div>
            </v-list-item-title>
            <v-list-item-subtitle>
              <v-chip small>
                <v-avatar style="max-height: 80%; max-width: 90%" left>
                  <img src="https://randomuser.me/api/portraits/men/81.jpg" />
                </v-avatar>
                Max Mustermann
              </v-chip>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-carousel-item>
    </v-carousel>
    <div style="height: 120px;"></div>
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
.task-entry {
  display: flex;
}
</style>
