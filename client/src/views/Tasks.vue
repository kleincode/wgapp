<template>
  <v-container fluid>
    <h1 class="display-2 pl-12 pb-6">Tasks</h1>
    <v-row>
      <v-col cols="12" md="6" lg="4">
        <v-card outlined class="text-center">
          <h2 class="title pt-8 pb-12">Today's Tasks:</h2>
          <v-card raised class="main-task text-center primary">
            <div class="overline">DUE TODAY</div>
            <v-icon style="font-size: 10em" x-large>bathtub</v-icon>
            <div class="font-regular pt-4 display-1">Bad putzen</div>
            <div class="caption pt-2">14:00</div>
            <v-divider class="mt-4 mb-4"></v-divider>
            <v-chip>
              <v-avatar left>
                <img src="https://randomuser.me/api/portraits/men/81.jpg" />
              </v-avatar>Matti Frind
            </v-chip>
          </v-card>
          <v-divider class="mt-4 mb-4"></v-divider>
          <div class="overline">other:</div>
          <v-list avatar class="text-left pl-4">
            <v-list-item>
              <v-list-item-avatar>
                <v-icon>rowing</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>Saugen</v-list-item-title>
                <v-list-item-subtitle><div class="overline">17:00</div></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-avatar>
                <v-icon>delete</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>Müll rausbringen</v-list-item-title>
                <v-list-item-subtitle><div class="overline">18:00</div></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="8">
        <v-card outlined>
          <h2 class="title pl-8 pt-4">All Tasks:</h2>
          <v-list>
            <v-list-item
              v-for="(task,i) in tasks"
              :key="'task-' + i"
              :class="task.missed ? 'red': ''"
            >
              <v-list-item-avatar>
                <v-icon>{{task.icon}}</v-icon>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title v-text="task.name" class="pb-2"></v-list-item-title>
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
                <v-hover><v-btn icon><v-icon>check</v-icon></v-btn></v-hover>
                <v-hover><v-btn icon><v-icon>edit</v-icon></v-btn></v-hover>
              </v-list-item-icon>
            </v-list-item>
          </v-list>
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

.fill-height {
  height: 100%;
}

.main-task {
  max-width: 70%;
  padding: 2em;
  margin: 2em;
  margin-bottom: 4em;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>