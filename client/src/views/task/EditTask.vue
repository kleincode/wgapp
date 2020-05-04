<template>
  <v-container fluid>
    <div style="display: flex">
      <v-btn exact icon color="primary" class="mt-2 mr-2" @click="back">
        <v-icon>keyboard_arrow_left</v-icon>
      </v-btn>
      <div v-if="editMode" class="display-2 pb-6">Edit task - "{{ name }}"</div>
      <div v-if="!editMode" class="display-2 pb-6">Add task - "{{ name }}"</div>
    </div>
    <v-card outlined :loading="loading">
      <div class="container">
        <v-card-text>
          <v-select
            v-model="mode"
            :items="modes"
            item-value="value"
            label="Task Mode"
            outlined
          ></v-select>
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
                  <v-radio-group
                    v-model="iterating"
                    :disabled="mode == 'Single'"
                  >
                    <v-radio
                      :key="0"
                      :label="'Single'"
                      :disabled="mode == 'On-Demand'"
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
                    v-model="selectedMember"
                    :items="getHouseholdUsersAsItemList"
                    item-value="value"
                    label="Assigned to"
                    outlined
                    :disabled="iterating && mode != 'Single'"
                  ></v-select>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="4" lg="4" style="text-align: center">
              <v-icon style="font-size: 12em">{{ getIcon(icon) }}</v-icon>
              <br />
              <IconChooser
                v-model="selectedIcon"
                @ok="newIconSelected"
                @cancel="noNewIconSelected"
              ></IconChooser>
            </v-col>
          </v-row>
          <div v-show="mode != 'On-Demand'" class="title">Time & Date</div>
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
                    v-show="mode != 'On-Demand'"
                    v-model="date"
                    label="Choose your start day"
                    prepend-icon="event"
                    readonly
                    outlined
                    v-on="on"
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
                    v-show="mode != 'On-Demand'"
                    v-model="time"
                    label="Choose your task time"
                    prepend-icon="access_time"
                    readonly
                    outlined
                    v-on="on"
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
              <v-switch
                v-show="mode != 'On-Demand'"
                v-model="reminder"
                label="Toggle Reminder"
              ></v-switch>
            </v-col>
            <v-col cols="12" lg="4" md="6">
              <v-select
                v-show="mode == 'Repeating'"
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
                v-show="mode == 'Repeating'"
                v-model="repetitionEvery"
                type="number"
                label="Repeat every"
                required
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="4" md="6">
              <v-select
                v-show="mode == 'Repeating'"
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
              <v-btn large outlined color="error darken-2" v-on="on"
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

import {
  computeNextDueDay,
  dateToLocalTime,
  dateToLocalDate
} from "@/assets/tasksHelper.js";

export default {
  name: "EditTask",
  components: {
    IconChooser
  },
  data: () => ({
    editMode: false,
    id: -1,
    mode: "Single",
    name: "",
    iterating: true,
    icon: 0,
    selectedIcon: 0,
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
    modes: ["Single", "Repeating", "On-Demand"],

    startDateMenu: false,
    startTimeMenu: false,
    snackbar: false,
    snackText: "",
    deleteDialog: false,

    loading: false
  }),
  computed: {
    ...mapGetters(["getHouseholdUsersAsItemList"])
  },
  mounted() {
    this.id = this.$route.params.id;
    this.editMode = !!this.$route.params.id;
    if (this.editMode) {
      this.fetch_settings(this.id);
    }
  },
  methods: {
    async fetch_settings(id) {
      this.loading = true;
      try {
        const { data } = await this.$http.get("/_/fetchtasks", {
          params: { id }
        });
        if (data.success) {
          if (data.data.length == 0 || data.data.length > 1) {
            this.$store.dispatch(
              "showSnackbar",
              "Error while fetching tasks. Multiple or no task received."
            );
          }
          let task = data.data[0];
          this.id = task.id;
          this.mode = this.getMode(task.mode);
          this.name = task.name;
          this.iterating = Boolean(parseInt(task.iteratingMode));
          this.selectedMember = task.assignedMember;
          this.chosenDays = task.repetitionDays.map(
            day => day[0].toUpperCase() + day.substr(1, day.length)
          );
          this.icon = task.icon;
          let date = new Date(task.startDate * 1000);
          this.time = dateToLocalTime(date);
          this.date = dateToLocalDate(date);
          this.datelong = date;
          this.repetitionEvery = parseInt(task.repetitionEvery);
          this.repetitionUnit = this.repetitionUnits[task.repetitionUnit];
          this.reminder = !!task.reminder;
        } else {
          this.$store.dispatch(
            "showSnackbar",
            "Error while fetching settings data. Please try again later."
          );
          console.error(data);
        }
      } catch (err) {
        this.$store.dispatch(
          "showSnackbar",
          "Error while fetching settings data. Please try again later."
        );
        console.error(err);
      }
      this.loading = false;
    },

    getMode(mode) {
      switch (mode) {
        case 0:
          return "Single";
        case 1:
          return "Repeating";
        case 2:
          return "On-Demand";
      }
    },

    getIDFromMode(mode) {
      switch (mode) {
        case "Single":
          return 0;
        case "Repeating":
          return 1;
        case "On-Demand":
          return 2;
      }
    },

    async postChanges() {
      let id = this.id;
      let name = this.name;
      let icon = this.icon;
      let mode = this.getIDFromMode(this.mode);
      let iteratingMode;
      if (mode == 2) {
        iteratingMode = true;
      } else {
        iteratingMode = this.iterating;
      }
      let assignedMember = this.selectedMember;
      let repetitionDays = this.chosenDays.map(
        day => day[0].toLowerCase() + day.substr(1, day.length)
      );
      let repetitionEvery = parseInt(this.repetitionEvery);
      let repetitionUnit;
      if (this.repetitionUnits.indexOf(this.repetitionUnit)) {
        repetitionUnit = true;
      } else {
        repetitionUnit = false;
      }

      let startDate = new Date(this.date);
      startDate.setHours(this.time.substr(0, 2));
      startDate.setMinutes(this.time.substr(3, 2));

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
      if ((!repetitionEvery || repetitionEvery == 0) && mode == 1) {
        this.snackText = "You need to specify a valid intervall.";
        this.snackbar = true;
        return;
      }
      if (repetitionDays.length == 0 && mode == 1) {
        this.snackText = "You need to specify at least one weekday.";
        this.snackbar = true;
        return;
      }
      let due;
      switch (mode) {
        case 0:
          due = new Date(startDate);
          break;
        case 1:
          due = computeNextDueDay(
            new Date(),
            new Date(startDate),
            repetitionDays,
            this.repetitionUnit == "Weeks" ? 0 : 1,
            this.repetitionEvery
          );
          break;
        case 2:
          due = "";
          break;
      }
      try {
        if (this.editMode) {
          const { data } = await this.$http.post("/_/edittask", {
            id,
            name,
            mode,
            icon,
            iteratingMode,
            assignedMember,
            repetitionDays,
            repetitionEvery: repetitionEvery || 0,
            repetitionUnit,
            reminder,
            startDate: Math.floor(startDate.getTime() / 1000),
            due
          });
          if (data.success) {
            this.$store.dispatch(
              "showSnackbar",
              "Successfully edited the task."
            );
          } else {
            this.$store.dispatch(
              "showSnackbar",
              "Error while editing the task."
            );
          }
        } else {
          const { data } = await this.$http.post("/_/addtask", {
            name,
            icon,
            mode,
            iteratingMode,
            assignedMember,
            repetitionDays,
            repetitionEvery: repetitionEvery || 0,
            repetitionUnit,
            reminder,
            startDate: Math.floor(startDate.getTime() / 1000),
            due
          });
          if (data.success) {
            this.$store.dispatch(
              "showSnackbar",
              "Successfully added the new task."
            );
          } else {
            this.$store.dispatch(
              "showSnackbar",
              "Error while adding the new task."
            );
            console.error(data);
          }
        }
      } catch (err) {
        this.$store.dispatch(
          "showSnackbar",
          "Error while connecting to the server. Please try again later."
        );
        console.log(err);
      }
      this.$router.push({ name: "Tasks" });
    },
    getIcon(id) {
      return icons[id];
    },
    newIconSelected(id) {
      this.icon = id;
      this.selectedIcon = id;
    },
    noNewIconSelected() {
      this.selectedIcon = this.icon;
    },
    async deleteTask() {
      this.deleteDialog = false;
      let id = this.id;
      try {
        const { data } = await this.$http.post("/_/deletetask", {
          id
        });
        if (data.success) {
          this.$store.dispatch("showSnackbar", "Deleted task.");
        } else {
          this.$store.dispatch("showSnackbar", "Error while deleting task.");
          console.error(data);
        }
      } catch (err) {
        this.$store.dispatch(
          "showSnackbar",
          "Error while connecting to the server. Please try again later."
        );
      }
      this.$router.push({ name: "Tasks" });
    },

    back() {
      this.$router.back();
    }
  }
};
</script>
<style lang="scss" scoped></style>
