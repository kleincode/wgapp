<template>
  <v-dialog v-model="show" width="600" persistent @click:outside="closeDialog">
    <v-card>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-toolbar :color="selCalendar.backgroundColor" prominent>
          <v-toolbar-title>
            <v-text-field
              v-model="name"
              :dark="textColor"
              label="Add Title"
              class="largeTextfield mt-3 mb-3 ml-1"
              :rules="titleRules"
              required
            ></v-text-field>
          </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-row>
                <v-col cols="12">
                  <v-select
                    v-model="selCalendar"
                    :items="calendars"
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
                        v-model="startTime"
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
                        v-model="endTime"
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
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="close">
            cancel
          </v-btn>
          <v-btn color="primary" text @click="closeDialog">
            save
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from "vuex";
import { getForegroundColor } from "@/assets/colorHelper.js";

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
    calendars: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    selCalendar: null,
    valid: false,
    name: "",
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
    textColor() {
      return getForegroundColor(this.selCalendar.backgroundColor) == "white";
    },
    ...mapState("userSettings", ["locale"])
  },
  watch: {
    show(val) {
      if (val) {
        if (this.add) {
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
        }
        //init standard calendar
        this.selCalendar = this.calendars.filter(c => c.primary)[0];
      }
    }
  },
  methods: {
    closeDialog() {
      this.$emit("close");
    },
    save() {
      this.$refs.form.validate();
      //TODO: send
      this.closeDialog();
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
