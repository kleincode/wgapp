<template>
  <v-container fluid>
    <div style="display: flex">
      <v-btn exact icon color="primary" @click="back" class="mt-2 mr-2">
        <v-icon>keyboard_arrow_left</v-icon>
      </v-btn>
      <div v-if="editMode" class="display-2 pb-6">Edit task - "{{ name }}"</div>
      <div v-if="!editMode" class="display-2 pb-6">Add task - "{{ name }}"</div>
    </div>
    <v-card outlined>
      <div class="container">
        <v-card-text>
          <v-row>
            <v-col cols="12" md="8" lg="8">
              <v-text-field
                v-model="name"
                :counter="128"
                label="Name"
                required
                outlined
              ></v-text-field>
              <div class="title">Member mode</div>
              <v-row>
                <v-col cols="12" md="6">
                  <v-radio-group v-model="iterating">
                    <v-radio
                      :key="0"
                      :label="'Single'"
                      :value="false"
                    ></v-radio>
                    <v-radio
                      :key="1"
                      :label="'Iterating'"
                      :value="true"
                    ></v-radio>
                  </v-radio-group>
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    :items="getUserSelect"
                    v-model="selectedMember"
                    item-value="value"
                    label="Assigned to"
                    outlined
                    :disabled="iterating"
                  ></v-select>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="4" lg="4" style="text-align: center">
              <v-icon style="font-size: 12em">{{
                this.getIcon(this.icon)
              }}</v-icon>
              <br />
              <IconChooser v-model="icon"></IconChooser>
            </v-col>
          </v-row>
          <div class="title">Time & Date</div>
          <v-row>
            <v-col cols="12" lg="4" md="6">
              <v-menu
                v-model="startDateMenu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="date"
                    label="Choose your start day"
                    prepend-icon="event"
                    readonly
                    v-on="on"
                    outlined
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="date"
                  @input="startDateMenu = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" lg="4" md="6">
              <v-menu
                ref="menu"
                v-model="startTimeMenu"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="time"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="time"
                    label="Choose your task time"
                    prepend-icon="access_time"
                    readonly
                    v-on="on"
                    outlined
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-if="startTimeMenu"
                  v-model="time"
                  format="24hr"
                  full-width
                  @click:minute="$refs.menu.save(time)"
                ></v-time-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" lg="4" md="6">
              <v-switch v-model="reminder" label="Toggle Reminder"></v-switch>
            </v-col>
            <v-col cols="12" lg="4" md="6">
              <v-select
                v-model="chosenDays"
                :items="days"
                chips
                label="Repeat on"
                multiple
                outlined
              ></v-select>
            </v-col>
            <v-col cols="12" lg="4" md="6">
              <v-text-field
                type="number"
                v-model="repetitionEvery"
                label="Repeat every"
                required
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="4" md="6">
              <v-select
                v-model="repetitionUnit"
                :items="repetitionUnits"
                label="Repetition unit"
                outlined
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions style="text-align: right; display: block">
          <v-btn large color="primary" @click="postChanges()">save</v-btn>
          <v-btn large :to="{ name: 'Tasks' }">cancel</v-btn
          ><v-divider class="mx-4" inset vertical></v-divider>
          <v-dialog v-model="deleteDialog" width="500">
            <template v-slot:activator="{ on }">
              <v-btn large v-on="on" outlined color="error darken-2"
                >delete</v-btn
              >
            </template>
            <v-card>
              <v-card-title class="headline" primary-title>
                Do you really want to delete this task?
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" text @click="deleteTask">
                  delete
                </v-btn>
                <v-btn text @click="deleteDialog = false">
                  cancel
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card-actions>
      </div>
    </v-card>
    <v-snackbar v-model="snackbar">
      {{ snackText }}
      <v-btn color="primary" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>
<script>
import IconChooser from "@/components/IconChooser.vue";
import icons from "@/assets/icons.js";
import { mapGetters } from "vuex";

export default {
  name: "EditTask",
  components: {
    IconChooser
  },
  data: () => ({
    editMode: false,
    id: -1,
    name: "",
    iterating: true,
    icon: 0,
    selectedMember: 0,
    date: new Date().toISOString().substr(0, 10),
    days: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ],
    chosenDays: [],
    time: null,
    reminder: false,
    repetitionEvery: "",
    repetitionUnit: "",
    repetitionUnits: ["Weeks", "Months"],

    startDateMenu: false,
    startTimeMenu: false,
    snackbar: false,
    snackText: "",
    deleteDialog: false
  }),
  methods: {
    async fetch_settings(id) {
      const { data } = await this.$http.get("/_/fetchtasks", {
        params: { id }
      });
      if (data.success) {
        if (data.data.length == 0 || data.data.length > 1) {
          console.error(
            "Error while fetching tasks. Multiple or no task received."
          );
        }
        let task = data.data[0];
        this.id = task.id;
        this.name = task.name;
        this.iterating = Boolean(parseInt(task.iteratingMode));
        this.selectedMember = task.assignedMember;
        this.chosenDays = task.repetitionDays.map(
          day => day[0].toUpperCase() + day.substr(1, day.length)
        );
        this.icon = task.icon;
        this.time = task.time.substr(0, 5);
        this.date = task.startDate.substr(0, 10);
        this.repetitionEvery = parseInt(task.repetitionEvery);
        this.repetitionUnit = this.repetitionUnits[task.repetitionUnit];
        this.reminder = !!task.reminder;
      }
    },

    async postChanges() {
      let id = this.id;
      let name = this.name;
      let icon = this.icon;
      let iteratingMode = this.iterating;
      let assignedMember = this.selectedMember;
      let repetitionDays = this.chosenDays.map(
        day => day[0].toLowerCase() + day.substr(1, day.length)
      );
      let time = this.time;
      let repetitionEvery = parseInt(this.repetitionEvery);
      let repetitionUnit;
      if (this.repetitionUnits.indexOf(this.repetitionUnit)) {
        repetitionUnit = true;
      } else {
        repetitionUnit = false;
      }
      let startDate = this.date;
      let reminder;
      if (this.reminder) {
        reminder = true;
      } else {
        reminder = false;
      }
      if (name.length == 0) {
        this.snackText = "You need to specify a name.";
        this.snackbar = true;
        return;
      }
      if (!repetitionEvery || repetitionEvery == 0) {
        this.snackText = "You need to specify a valid intervall.";
        this.snackbar = true;
        return;
      }
      if (repetitionDays.length == 0) {
        this.snackText = "You need to specify at least one weekday.";
        this.snackbar = true;
        return;
      }

      if (this.editMode) {
        await this.$http.post("/_/edittask", {
          id,
          name,
          icon,
          iteratingMode,
          assignedMember,
          repetitionDays,
          time,
          repetitionEvery,
          repetitionUnit,
          reminder,
          startDate
        });
      } else {
        let date = startDate;
        const { data } = await this.$http.post("/_/addtask", {
          name,
          icon,
          iteratingMode,
          assignedMember,
          repetitionDays,
          repetitionEvery,
          repetitionUnit,
          reminder,
          date,
          time
        });
        console.log(data);
      }
      this.$router.push({ name: "Tasks" });
    },
    getIcon(id) {
      return icons[id];
    },
    deleteTask() {
      this.deleteDialog = false;
      let id = this.id;
      this.$http.post("/_/deletetask", {
        id
      });
      this.$router.push({ name: "Tasks" });
    },

    back() {
      this.$router.back();
    }
  },
  mounted() {
    this.id = this.$route.params.id;
    this.editMode = !!this.$route.params.id;
    if (this.editMode) {
      this.fetch_settings(this.id);
    }
  },

  computed: {
    ...mapGetters(["getUserSelect"])
  }
};
</script>
<style lang="scss" scoped></style>
