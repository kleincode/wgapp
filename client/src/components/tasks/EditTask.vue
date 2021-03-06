<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card :class="$vuetify.breakpoint.mdAndDown ? 'mb-8' : ''">
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="$emit('close')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title v-if="editMode">{{
          $t("tasks.editTask.titleEdit")
        }}</v-toolbar-title>
        <v-toolbar-title v-else>{{
          $t("tasks.editTask.titleAdd")
        }}</v-toolbar-title>
      </v-toolbar>
      <v-card class="container mt-6" style="max-width: 1200px; margin: 0 auto">
        <v-progress-linear
          v-if="loading"
          indeterminate
          class="mb-4"
        ></v-progress-linear>
        <v-tabs
          v-model="mode"
          background-color="transparent"
          color="basil"
          grow
        >
          <v-tab v-for="(item, i) in modes" :key="i" :value="i">
            {{ item.text }}
          </v-tab>
        </v-tabs>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="8" lg="8">
              <v-text-field
                v-model="name"
                :disabled="loading"
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
                    :disabled="mode == 0 || loading"
                  >
                    <v-radio
                      :key="0"
                      :label="'Single'"
                      :disabled="mode == 2"
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
                    :label="$t('tasks.editTask.assignedTo')"
                    outlined
                    :disabled="(iterating && mode != 0) || loading"
                  ></v-select>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="4" lg="4" style="text-align: center">
              <v-icon style="font-size: 12em">{{ getIcon(icon) }}</v-icon>
              <br />
              <IconChooser
                v-model="selectedIcon"
                :disabled="loading"
                @ok="newIconSelected"
                @cancel="noNewIconSelected"
              ></IconChooser>
            </v-col>
          </v-row>
          <div v-show="mode != 2" class="title">
            {{ $t("tasks.editTask.timeAndDate") }}
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
                  <v-expand-transition>
                    <v-text-field
                      v-show="mode != 2"
                      v-model="dateFormated"
                      :disabled="loading"
                      :label="$t('tasks.editTask.chooseStartDay')"
                      prepend-icon="event"
                      readonly
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </v-expand-transition>
                </template>
                <v-date-picker
                  v-model="date"
                  :locale="finaleLocale"
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
                  <v-expand-transition>
                    <v-text-field
                      v-show="mode != 2"
                      v-model="timeFormatted"
                      :disabled="loading"
                      :label="$t('tasks.editTask.chooseTaskTime')"
                      prepend-icon="access_time"
                      readonly
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </v-expand-transition>
                </template>
                <v-time-picker
                  v-if="startTimeMenu"
                  v-model="time"
                  :disabled="loading"
                  :format="timeFormat"
                  full-width
                  @click:minute="$refs.menu.save(time)"
                ></v-time-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" lg="4" md="6">
              <v-switch
                v-show="mode != 2"
                v-model="reminder"
                :disabled="loading"
                :label="$t('tasks.editTask.toggleReminder')"
              ></v-switch>
            </v-col>
            <v-col cols="12" lg="4" md="6">
              <v-expand-transition>
                <v-select
                  v-show="mode == 1"
                  v-model="chosenDays"
                  :disabled="loading"
                  :items="days"
                  item-value="val"
                  chips
                  :label="$t('tasks.editTask.repeatOn')"
                  multiple
                  outlined
                ></v-select>
              </v-expand-transition>
            </v-col>
            <v-col cols="12" lg="4" md="6">
              <v-expand-transition>
                <v-text-field
                  v-show="mode == 1"
                  v-model="repetitionEvery"
                  :disabled="loading"
                  type="number"
                  :label="$t('tasks.editTask.repeatEvery')"
                  required
                  outlined
                ></v-text-field>
              </v-expand-transition>
            </v-col>
            <v-col cols="12" lg="4" md="6">
              <v-expand-transition>
                <v-select
                  v-show="mode == 1"
                  v-model="repetitionUnit"
                  :disabled="loading"
                  :items="repetitionUnits"
                  :label="$t('tasks.editTask.repeatUnit')"
                  outlined
                ></v-select>
              </v-expand-transition>
            </v-col>
          </v-row>
        </v-card-text>
        <div
          class="white elevation-6"
          style="position: fixed; left: 0; bottom: 0; right: 0;"
        >
          <v-divider class="secondary"></v-divider>
          <v-card-actions class="secondary" style="height: 82px">
            <v-spacer></v-spacer>
            <v-dialog v-model="deleteDialog" width="600">
              <template v-slot:activator="{ on }">
                <v-btn large text color="error" v-on="on">{{
                  $t("commands.delete")
                }}</v-btn>
              </template>
              <v-card>
                <v-card-title class="headline" primary-title>
                  {{ $t("tasks.editTask.confirmDelete") }}
                </v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text @click="deleteDialog = false">
                    {{ $t("commands.cancel") }}
                  </v-btn>
                  <v-btn color="error" text @click="deleteTask">
                    {{ $t("commands.delete") }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-btn text color="success" class="mr-4" @click="postChanges">
              {{ $t("commands.save") }}
            </v-btn>
          </v-card-actions>
        </div>
      </v-card>
      <v-snackbar v-model="snackbar">
        {{ snackText }}
        <v-btn color="primary" text @click="snackbar = false">{{
          $t("commands.close")
        }}</v-btn>
      </v-snackbar>
    </v-card>
  </v-dialog>
</template>
<script>
import IconChooser from "@/components/IconChooser.vue";
import icons from "@/assets/icons.js";
import { mapGetters, mapState } from "vuex";

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
  props: {
    dialog: {
      type: Boolean,
      default: () => false
    },
    editTask: {
      type: Object,
      default: () => null
    }
  },
  data: () => ({
    id: -1,
    mode: "Single",
    name: "",
    iterating: true,
    icon: 10,
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
    editMode() {
      return !!this.editTask;
    },
    modes() {
      return [
        { text: this.$t("tasks.modes.single"), value: "Single" },
        {
          text: this.$t("tasks.modes.repeating"),
          value: "Repeating"
        },
        { text: this.$t("tasks.modes.ondemand"), value: "On-Demand" }
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
    dateFormated() {
      if (this.date != "") {
        return new Date(this.date).toLocaleDateString(this.locale || undefined);
      }
      return "";
    },
    finaleLocale() {
      return this.locale || navigator.language;
    },
    timeFormatted() {
      if (this.time && this.time != "") {
        let timeAsDate = new Date();
        timeAsDate.setHours(this.time.substr(0, 2));
        timeAsDate.setMinutes(this.time.substr(3, 2));
        return this.formatTimeHMWithoutS(timeAsDate);
      }
      return "";
    },
    timeFormat() {
      if (this.finaleLocale.includes("en")) {
        return "ampm";
      } else {
        return "24hr";
      }
    },
    ...mapGetters("userSettings", ["formatTimeHMWithoutS"]),
    ...mapState("userSettings", ["locale"]),
    ...mapGetters(["getHouseholdUsersAsItemList"])
  },
  watch: {
    dialog: function(val) {
      if (val) {
        if (this.editMode) {
          this.fetch_settings(this.editTask.id);
        } else {
          this.name = "";
          this.chosenDays = [];
          this.icon = 10;
          this.iterating = true;
          this.mode = 0;
          this.repetitionEvery = 1;
          this.repetitionUnit = "Weeks";
          let now = new Date();
          this.time = now.getHours() + ":" + now.getMinutes();
          this.selectedMember = this.getHouseholdUsersAsItemList[0].value;
        }
      }
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
          this.mode = task.mode;
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

    async postChanges() {
      let id = this.id;
      let name = this.name;
      let repetitionEvery = parseInt(this.repetitionEvery);
      let icon = this.icon;
      let mode = this.mode;
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
      let repetitionUnit;
      if (this.repetitionUnits.indexOf(this.repetitionUnit)) {
        repetitionUnit = true;
      } else {
        repetitionUnit = false;
      }

      if (name == "") {
        this.snackText = this.$t("tasks.editTask.messages.name");
        this.snackbar = true;
        return;
      }
      if ((!repetitionEvery || repetitionEvery == 0) && mode == 1) {
        this.snackText = this.$t("tasks.editTask.messages.interval");
        this.snackbar = true;
        return;
      }
      if (repetitionDays.length == 0 && mode == 1) {
        this.snackText = this.$t("tasks.editTask.messages.weekday");
        this.snackbar = true;
        return;
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
              this.$t("tasks.editTask.messages.successEdit")
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
              this.$t("tasks.editTask.messages.successAdd")
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
      this.$emit("closeUpdate");
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
