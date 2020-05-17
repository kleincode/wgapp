<template>
  <v-dialog v-model="show" width="600" persistent @click:outside="closeDialog">
    <v-card>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-toolbar :color="selCalendar.backgroundColor" prominent>
          <v-text-field
            v-model="title"
            :dark="textColor"
            label="Add Title"
            class="largeTextfield mt-3 mt-9 mb-3 ml-1"
            :rules="titleRules"
            required
          ></v-text-field>
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-row>
                <v-col cols="12">
                  <v-select
                    v-model="selCalendar"
                    :items="calendars"
                    :disabled="!add"
                    return-object
                    item-text="summary"
                    prepend-icon="event"
                    label="Select calendar"
                  ></v-select>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="desc"
                    prepend-icon="info"
                    label="Add Description"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-menu
                    ref="startDateMenu"
                    v-model="startDateMenu"
                    :close-on-content-click="false"
                    :return-value.sync="startDate"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="startDateFormated"
                        label="Choose start date"
                        prepend-icon="event"
                        readonly
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="startDate"
                      no-title
                      scrollable
                      :first-day-of-week="1"
                      :locale="finalLocale"
                    >
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="menu = false"
                        >Cancel</v-btn
                      >
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.startDateMenu.save(startDate)"
                        >OK</v-btn
                      >
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" md="6">
                  <v-menu
                    ref="startTimeMenu"
                    v-model="startTimeMenu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    :return-value.sync="startTime"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="startTimeFormatted"
                        label="Choose start time"
                        prepend-icon="access_time"
                        readonly
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      v-if="startTimeMenu"
                      v-model="startTime"
                      :format="timeFormat"
                      full-width
                      @click:minute="$refs.startTimeMenu.save(startTime)"
                    ></v-time-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" md="6">
                  <v-menu
                    ref="endDateMenu"
                    v-model="endDateMenu"
                    :close-on-content-click="false"
                    :return-value.sync="endDate"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="endDateFormated"
                        label="Choose end date"
                        prepend-icon="event"
                        readonly
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="endDate"
                      no-title
                      scrollable
                      :first-day-of-week="1"
                      :locale="finalLocale"
                    >
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="menu = false"
                        >Cancel</v-btn
                      >
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.endDateMenu.save(endDate)"
                        >OK</v-btn
                      >
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" md="6">
                  <v-menu
                    ref="endTimeMenu"
                    v-model="endTimeMenu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    :return-value.sync="endTime"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="endTimeFormatted"
                        label="Choose end time"
                        prepend-icon="access_time"
                        readonly
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      v-if="endTimeMenu"
                      v-model="endTime"
                      :format="timeFormat"
                      full-width
                      @click:minute="$refs.endTimeMenu.save(endTime)"
                    ></v-time-picker>
                  </v-menu>
                </v-col>
              </v-row>
              <v-alert v-if="end <= start" dense type="error">
                The end time must be after the start time.
              </v-alert>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeDialog">
            cancel
          </v-btn>
          <v-btn color="primary" text :disabled="end <= start" @click="save">
            save
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { getForegroundColor } from "@/assets/colorHelper.js";
import { addNewEvent, updateEvent, rfc3339 } from "@/assets/googleCalendar.js";

export default {
  name: "EditEventDialog",
  props: {
    show: {
      type: Boolean,
      default: false
    },
    add: {
      type: Boolean,
      default: true
    },
    event: {
      type: Object,
      default: () => {}
    },
    calendars: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    id: null,
    selCalendar: null,
    valid: false,
    title: "",
    desc: "",
    startDateMenu: false,
    startDate: "",
    startTimeMenu: false,
    startTime: "",
    endDateMenu: false,
    endDate: "",
    endTimeMenu: false,
    endTime: "",

    titleRules: [
      v => !!v || "A title is required",
      v => v.length <= 60 || "Title must be less than 60 characters"
    ]
  }),
  computed: {
    startDateFormated() {
      if (this.startDate != "") {
        return new Date(this.startDate).toLocaleDateString(
          this.locale || undefined
        );
      }
      return "";
    },
    endDateFormated() {
      if (this.endDate != "") {
        return new Date(this.endDate).toLocaleDateString(
          this.locale || undefined
        );
      }
      return "";
    },
    startTimeFormatted() {
      if (this.startTime && this.startTime != "") {
        let timeAsDate = new Date();
        timeAsDate.setHours(this.startTime.substr(0, 2));
        timeAsDate.setMinutes(this.startTime.substr(3, 2));
        return this.formatTimeHMWithoutS(timeAsDate);
      }
      return "";
    },
    endTimeFormatted() {
      if (this.endTime && this.endTime != "") {
        let timeAsDate = new Date();
        timeAsDate.setHours(this.endTime.substr(0, 2));
        timeAsDate.setMinutes(this.endTime.substr(3, 2));
        return this.formatTimeHMWithoutS(timeAsDate);
      }
      return "";
    },
    finalLocale() {
      return this.locale || navigator.language;
    },
    timeFormat() {
      if (this.finalLocale.includes("en")) {
        return "ampm";
      } else {
        return "24hr";
      }
    },
    start() {
      let start = new Date(this.startDate);
      start.setHours(this.startTime.substr(0, 2), this.startTime.substr(3, 2));
      return start;
    },
    end() {
      let end = new Date(this.endDate);
      end.setHours(this.endTime.substr(0, 2), this.endTime.substr(3, 2));
      return end;
    },
    textColor() {
      return getForegroundColor(this.selCalendar.backgroundColor) == "white";
    },
    ...mapState("userSettings", ["locale"]),
    ...mapGetters("userSettings", ["formatTimeHMWithoutS"])
  },
  watch: {
    show(val) {
      if (val) {
        if (this.add) {
          this.title = "";
          this.desc = "";
          let today = new Date();
          this.startDate = today.toISOString().substr(0, 10);
          this.endDate = today.toISOString().substr(0, 10);
          this.startTime = today
            .toLocaleTimeString(this.locale || undefined)
            .substr(0, 5);
          today.setHours(today.getHours() + 1);
          this.endTime = today
            .toLocaleTimeString(this.locale || undefined)
            .substr(0, 5);
          //init standard calendar
          this.selCalendar = this.calendars.filter(c => c.primary)[0];
        } else {
          if (this.event.start.length <= 10) {
            //catch when wholeday event
            this.closeDialog();
            this.$store.dispatch(
              "showSnackbar",
              "Whole day events are currently not supported"
            );
            return;
          }
          this.title = this.event.name;
          this.id = this.event.id;
          this.description = this.event.description;
          this.startDate = new Date(this.event.start.toString());
          this.endDate = new Date(this.event.end.toString());
          this.startTime =
            this.event.start.substr(11, 2) +
            ":" +
            this.event.start.substr(14, 2);
          this.endTime =
            this.event.end.substr(11, 2) + ":" + this.event.end.substr(14, 2);

          this.selCalendar = this.calendars.filter(
            c => this.event.calendarId == c.id
          )[0];
        }
      }
    }
  },
  methods: {
    closeDialog() {
      this.$emit("close");
    },
    async save() {
      await this.$refs.form.validate();
      if (this.valid && this.end > this.start) {
        try {
          let start = this.start;
          let end = this.end;
          this.loading = true;
          let event = {
            summary: this.title,
            description: this.description || "",
            start: {
              dateTime: rfc3339(start)
            },
            end: {
              dateTime: rfc3339(end)
            }
          };
          if (this.add) {
            //add
            await addNewEvent(this.selCalendar.id, event);
            this.$store.dispatch(
              "showSnackbar",
              "Successfully added new event"
            );
            this.$emit("closeSuccessfull");
          } else {
            //edit
            await updateEvent(this.selCalendar.id, this.id, event);
            this.$store.dispatch(
              "showSnackbar",
              "Successfully edited the event"
            );
            this.$emit("closeSuccessfullEdit", {
              name: this.title,
              desc: this.desc
            });
          }
        } catch (err) {
          console.error(err);
          this.$store.dispatch("showSnackbar", "Error adding event");
          this.closeDialog();
        }
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.largeTextfield >>> input {
  font-size: 1.8em;
  text-transform: capitalize;
}
.largeTextfield >>> label {
  font-size: 1.3em;
}
</style>
