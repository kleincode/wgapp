<template>
  <v-container fluid>
    <h1 v-if="editMode" class="display-2 pb-6">Edit task - "{{ name }}"</h1>
    <h1 v-if="!editMode" class="display-2 pb-6">Add task - "{{ name }}"</h1>
    <v-card outlined>
      <div class="container">
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
                  <v-radio :key="0" :label="'Single'" :value="false"></v-radio>
                  <v-radio
                    :key="1"
                    :label="'Iterating'"
                    :value="true"
                  ></v-radio>
                </v-radio-group>
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  :items="members"
                  label="Assigned to"
                  outlined
                  :disabled="iterating"
                ></v-select>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="4" lg="4" style="text-align: center">
            <v-icon style="font-size: 12em">bathtub</v-icon>
            <br />
            <v-btn text>Change Icon</v-btn>
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
                  label="Choose you task time"
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
              :items="repetitionUnits"
              label="Repetition unit"
              outlined
            ></v-select>
          </v-col>
          <v-col cols="12" style="text-align: right">
            <v-btn large color="primary" class="mr-4">save</v-btn>
            <v-btn large>cancel</v-btn>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </v-container>
</template>
<script>
export default {
  name: "EditTask",
  data: () => ({
    editMode: false,
    id: -1,
    name: "Bad putzen",
    iterating: true,
    selectedMember: "none",
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
    chosenDays: ["Friday"],
    time: null,
    reminder: false,
    repetitionEvery: "",
    repetitionUnit: "",
    repetitionUnits: ["Weeks", "Months"],
    assignedMember: ["Felix", "Matti", "Tom"],

    startDateMenu: false,
    startTimeMenu: false
  }),
  methods: {},
  mounted() {
    this.id = this.$route.params.id;
    this.editMode = !!this.$route.params.id;
  }
};
</script>
<style lang="scss" scoped></style>
