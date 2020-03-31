<template>
  <div>
    <div class="md-layout md-gutter md-alignment-top-center">
      <md-card class="tasks-card">
        <md-card-header>
          <div class="md-title div-flex">
            <div class="md-layout md-gutter">
              <div class="md-layout-item">Tasks</div>
              <div class="md-layout-item md-size-15">
                <md-button class="md-icon-button md-raised md-primary" style="float: right; margin-right: 2em">
                  <md-icon>add</md-icon>
                </md-button>
              </div>
            </div>
          </div>
        </md-card-header>
        <md-card-content>
          <div class="md-layout md-gutter md-alignment-top-center fill-width">
            <md-list class="md-triple-line">
              <md-empty-state
                v-if="tasks.length == 0"
                md-icon="feedback"
                md-label="Create your first task"
                md-description="Click on the add button to create your first task. You can change various options for each task."
              ></md-empty-state>
              <div v-for="(task,i) in tasks" :key="'task-' + i">
                <md-list-item>
                  <md-avatar class="md-large">
                    <md-icon class="md-size-3x">{{task.icon}}</md-icon>
                  </md-avatar>
                  <div class="md-list-item-text div-block">
                    <span>{{task.name}}</span>
                    <md-chip
                      :class="task.missed ? 'md-accent' : 'md-primary'"
                      class="normal-chip"
                    >{{task.due}}</md-chip>
                    <br />
                    <span>- {{task.assigned}}</span>
                  </div>
                  <md-button class="md-icon-button md-list-action">
                    <md-icon>edit</md-icon>
                  </md-button>
                </md-list-item>
                <md-divider class="md-inset"></md-divider>
              </div>
            </md-list>
          </div>
        </md-card-content>
      </md-card>
    </div>
  </div>
</template>
<script>
export default {
  name: "Tasks",
  data: () => ({
    tasks: [
      {
        name: "Bad putzen",
        assigned: "Felix",
        due: "yesterday",
        missed: true,
        icon: "bathtub"
      },
      {
        name: "Müll rausbringen",
        assigned: "Felix",
        due: "in 3 days",
        missed: false,
        icon: "delete"
      },
      {
        name: "Saugen",
        assigned: "Felix",
        due: "in 7 days",
        missed: false,
        icon: "rowing"
      }
    ]
  })
};
</script>
<style lang="scss" scoped>
.tasks-card {
  min-width: 50%;
  max-width: 90%;
  width: 700px;
}
.fill-width {
  width: 100%;
}
.flex-item {
  display: flex;
  & > .pushleft {
    margin: 0 auto 0 0;
  }
}
.md-list {
  width: 98%;
  max-width: 98%;
  display: inline-block;
  vertical-align: top;
}

.div-flex {
  display: flex;
}

.div-block {
  display: block;
}

.normal-chip {
  width: auto;
  height: auto;
  line-height: 1.7em;
  margin-left: 1em;
}

.md-layout-item {
  height: 40px;

  &:after {
    width: 100%;
    height: 100%;
    display: block;
    background: md-get-palette-color(green, 200);
    content: " ";
  }
}
</style>