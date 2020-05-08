<template>
  <v-container fluid>
    <div style="display: flex">
      <v-btn exact icon color="primary" class="mt-2 mr-2" @click="back">
        <v-icon>keyboard_arrow_left</v-icon>
      </v-btn>
      <div v-if="editMode" class="display-2 pb-6">
        {{ $t("tasks.editTask.titleEdit") }} - "{{ name }}"
      </div>
      <div v-if="!editMode" class="display-2 pb-6">
        {{ $t("tasks.editTask.titleAdd") }} - "{{ name }}"
      </div>
    </div>
    <v-card outlined :loading="loading">
      <div class="container">
        <v-card-text>
          <v-select
            v-model="mode"
            :items="modes"
            item-value="value"
            :label="$t('tasks.editTask.taskMode')"
            outlined
          ></v-select>
          <v-row>
            <v-col cols="12" md="8" lg="8">
              <v-text-field
                v-model="name"
                :counter="128"
                :label="$t('tasks.editTask.name')"
                required
                outlined
              ></v-text-field>
              <div class="title">{{ $t("tasks.editTask.memberMode") }}</div>
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
                    :label="$t('tasks.editTask.assigned')"
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
          <div v-show="mode != 'On-Demand'" class="title">
            {{ $t("tasks.editTask.titleTime") }}
          </div>
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
                    :label="$t('tasks.editTask.lblStart')"
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
                    :label="$t('tasks.editTask.lblTime')"
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
                :label="$t('tasks.editTask.lblReminder')"
              ></v-switch>
            </v-col>
            <v-col cols="12" lg="4" md="6">
              <v-select
                v-show="mode == 'Repeating'"
                v-model="chosenDays"
                :items="days"
                item-value="val"
                chips
                :label="$t('tasks.editTask.lblRepeatOn')"
                multiple
                outlined
              ></v-select>
            </v-col>
            <v-col cols="12" lg="4" md="6">
              <v-text-field
                v-show="mode == 'Repeating'"
                v-model="repetitionEvery"
                type="number"
                :label="$t('tasks.editTask.lblRepeatEvery')"
                required
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="4" md="6">
              <v-select
                v-show="mode == 'Repeating'"
                v-model="repetitionUnit"
                :items="repetitionUnits"
                :label="$t('tasks.editTask.lblRepeatUnit')"
                outlined
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions style="text-align: right; display: block">
          <v-btn large color="primary" @click="postChanges()">{{
            $t("commands.save")
          }}</v-btn>
          <v-btn large :to="{ name: 'Tasks' }">{{
            $t("commands.cancel")
          }}</v-btn
          ><v-divider class="mx-4" inset vertical></v-divider>
          <v-dialog v-model="deleteDialog" width="500">
            <template v-slot:activator="{ on }">
              <v-btn large outlined color="error darken-2" v-on="on">{{
                $t("commands.delete")
              }}</v-btn>
            </template>
            <v-card>
              <v-card-title class="headline" primary-title>
                {{ $t("tasks.editTask.deleteDialog") }}
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" text @click="deleteTask">
                  {{ $t("commands.delete") }}
                </v-btn>
                <v-btn text @click="deleteDialog = false">
                  {{ $t("commands.cancel") }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card-actions>
      </div>
    </v-card>
    <v-snackbar v-model="snackbar">
      {{ snackText }}
      <v-btn color="primary" text @click="snackbar = false">{{
        $t("commands.close")
      }}</v-btn>
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
    chosenDays: [],
    time: null,
    reminder: false,
    repetitionEvery: "",
    repetitionUnit: "",
    startDateMenu: false,
    startTimeMenu: false,
    snackbar: false,
    snackText: "",
    deleteDialog: false,

    loading: false
  }),
  computed: {
    modes() {
      return [
        { text: this.$t("tasks.modes.single"), value: "Single" },
        { text: this.$t("tasks.modes.rep"), value: "Repeating" },
        { text: this.$t("tasks.modes.ondem"), value: "On-Demand" }
      ];
    },
    repetitionUnits() {
      return [
        {
          text: this.$t("time.weeks"),
          value: "Weeks"
        },
        {
          text: this.$t("time.months"),
          value: "Months"
        }
      ];
    },
    days() {
      return [
        {
          val: "Monday",
          text: this.$t("weekdays.mon")
        },
        {
          val: "Tuesday",
          text: this.$t("weekdays.tue")
        },
        {
          val: "Wednesday",
          text: this.$t("weekdays.wed")
        },
        {
          val: "Thursday",
          text: this.$t("weekdays.thu")
        },
        {
          val: "Friday",
          text: this.$t("weekdays.fri")
        },
        {
          val: "Saturday",
          text: this.$t("weekdays.sat")
        },
        {
          val: "Sunday",
          text: this.$t("weekdays.sun")
        }
      ];
    },
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
              this.$t("tasks.editTask.errors.number")
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
            this.$t("tasks.editTask.errors.settings")
          );
          console.error(data);
        }
      } catch (err) {
        this.$store.dispatch(
          "showSnackbar",
          this.$t("tasks.editTask.errors.settingsErr")
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
        this.snackText = this.$t("tasks.editTask.messages.name");
        this.snackbar = true;
        return;
      }
      if ((!repetitionEvery || repetitionEvery == 0) && mode == 1) {
        this.snackText = this.$t("tasks.editTask.messages.intervall");
        this.snackbar = true;
        return;
      }
      if (repetitionDays.length == 0 && mode == 1) {
        this.snackText = this.$t("tasks.editTask.messages.weekday");
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
              this.$t("tasks.editTask.messages.success")
            );
          } else {
            this.$store.dispatch(
              "showSnackbar",
              this.$t("tasks.editTask.errors.edit")
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
              this.$t("tasks.editTask.messages.success")
            );
          } else {
            this.$store.dispatch(
              "showSnackbar",
              this.$t("tasks.editTask.errors.add")
            );
            console.error(data);
          }
        }
      } catch (err) {
        this.$store.dispatch(
          "showSnackbar",
          this.$t("tasks.editTask.errors.addErr")
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
          this.$store.dispatch(
            "showSnackbar",
            this.$t("tasks.editTask.messages.delete")
          );
        } else {
          this.$store.dispatch(
            "showSnackbar",
            this.$t("tasks.editTask.errors.delete")
          );
          console.error(data);
        }
      } catch (err) {
        this.$store.dispatch(
          "showSnackbar",
          this.$t("tasks.editTask.errors.deleteErr")
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
