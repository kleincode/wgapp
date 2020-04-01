<template>
  <v-container fluid>
    <h1 class="display-2 pb-6">Tasks</h1>
    <v-row>
      <v-col cols="12" md="6" lg="4">
        <v-card outlined class="text-center">
          <h2 class="title pt-8 pb-12">Today's Tasks:</h2>
          <div class="container">
          <v-row justify="center">
            <v-col cols="12" md="10">
              <v-card
                raised
                class="main-task text-center"
                v-if="tasks.length > 0"
                :class="tasks[0].missed ? 'red': 'primary'"
              >
                <div class="overline">DUE TODAY</div>
                <v-icon style="font-size: 10em" x-large>{{tasks[0].icon}}</v-icon>
                <div class="font-regular pt-4 display-1">
                  {{tasks[0].name}}
                  <v-btn icon>
                    <v-icon x-large>check</v-icon>
                  </v-btn>
                </div>
                <div class="caption pt-2">{{tasks[0].time}}</div>
                <v-divider class="mt-4 mb-4"></v-divider>
                <v-chip>
                  <v-avatar left>
                    <img src="https://randomuser.me/api/portraits/men/81.jpg" />
                  </v-avatar>
                  {{tasks[0].assigned}}
                </v-chip>
              </v-card>
              <v-card raised class="main-task text-center secondary" v-else>
                <div class="overline text--disabled">DUE TODAY</div>
                <v-icon class="text--disabled" style="font-size: 10em" x-large>bathtub</v-icon>
                <div class="font-regular pt-4 display-1 text--disabled">Nothing to do</div>
                <div class="caption pt-2 text--disabled">--:--</div>
                <v-divider class="mt-4 mb-4"></v-divider>
                <v-chip style="width: 30%">
                  <v-avatar left></v-avatar>
                </v-chip>
              </v-card>
            </v-col>
          </v-row>
          </div>

          <v-divider class="mt-4 mb-4"></v-divider>
          <div class="overline">other:</div>
          <v-list avatar class="text-left pl-4">
            <div v-if="tasks.length > 1">
              <v-list-item v-for="(task,i) in tasks.slice(1, tasks.length)" :key="'task-' + i">
                <v-list-item-avatar>
                  <v-icon>{{task.icon}}</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="task-entry">
                    {{task.name}}
                    <div class="overline pl-2 pt-1">- {{task.time}}</div>
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    <v-chip small>
                      <v-avatar style="max-height: 80%; max-width: 90%" left>
                        <img src="https://randomuser.me/api/portraits/men/81.jpg" />
                      </v-avatar>
                      {{task.assigned}}
                    </v-chip>
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-icon>
                  <v-btn icon>
                    <v-icon>check</v-icon>
                  </v-btn>
                </v-list-item-icon>
              </v-list-item>
            </div>
            <v-list-item v-else>
              <v-list-item-avatar>
                <v-icon class="text--disabled">hourglass_empty</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="text--disabled">Nothing to do</v-list-item-title>
                <v-list-item-subtitle>
                  <div class="overline text--disabled">--:--</div>
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-icon>
                <v-btn icon>
                  <v-icon class="text--disabled">check</v-icon>
                </v-btn>
              </v-list-item-icon>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="8">
        <v-card outlined>
          <v-row>
            <v-col cols="9" md="10" lg="10">
              <h2 class="title pl-8 pt-4">All Tasks:</h2>
            </v-col>
            <v-col class="text-right pt-5 pr-8" cols="3" md="2" lg="2">
              <v-btn fab class="mx-2 primary">
                <v-icon>add</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-list v-if="tasks.length > 0">
            <v-list-item
              v-for="(task,i) in tasks"
              :key="'task-' + i"
              :class="task.missed ? 'red': ''"
            >
              <v-list-item-avatar>
                <v-icon>{{task.icon}}</v-icon>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title class="pb-2 task-entry">
                  {{task.name}}
                  <div class="overline pl-2 pt-1">- {{task.day}}, {{task.time}}</div>
                </v-list-item-title>
                <v-list-item-subtitle>
                  <v-chip>
                    <v-avatar left>
                      <img src="https://randomuser.me/api/portraits/men/81.jpg" />
                    </v-avatar>
                    {{task.assigned}}
                  </v-chip>
                </v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-icon>
                <v-hover>
                  <v-btn icon>
                    <v-icon>check</v-icon>
                  </v-btn>
                </v-hover>
                <v-hover>
                  <v-btn icon>
                    <v-icon>edit</v-icon>
                  </v-btn>
                </v-hover>
              </v-list-item-icon>
            </v-list-item>
          </v-list>
          <div style="text-align: center" class="text--disabled pb-12 pt-8" v-else>
            <v-icon style="font-size: 10em" class="text--disabled">hourglass_empty</v-icon>
            <br />No tasks added yet
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: "Tasks",
  data: () => ({
    tasks: [
      {
        name: "Bad putzen",
        assigned: "Felix",
        day: "Today",
        time: "14:00",
        due: "yesterday",
        missed: false,
        icon: "bathtub"
      },
      {
        name: "Müll rausbringen",
        assigned: "Felix",
        day: "Today",
        time: "17:00",
        missed: false,
        icon: "delete"
      },
      {
        name: "Saugen",
        assigned: "Felix",
        day: "Tomorrow",
        time: "18:00",
        missed: false,
        icon: "rowing"
      },
      {
        name: "Aufräumen",
        assigned: "Felix",
        day: "in 2 days",
        time: "12:00",
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

.fill-height {
  height: 100%;
}

.main-task {
  padding: 2em;
  margin: 2em;
  margin-bottom: 4em;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.task-entry {
  display: flex;
}
</style>