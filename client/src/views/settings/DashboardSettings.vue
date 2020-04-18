<template>
  <v-card flat tile>
    <v-card-text>
      <div class="display-1 mb-2">Dashboard</div>
      <!-- CLOCK WIDGET -->
      <div class="title pt-2">Clock Widget</div>
      <p>
        A revolutionary time-telling device. Follows the laws of special and
        general relativity.
      </p>
      <v-switch
        v-model="clockWidgetEnabled"
        label="Enable clock widget"
      ></v-switch>
      <!-- WEATHER WIDGET -->
      <div class="title pt-2">Weather Widget</div>
      <p>
        Provides you with the latest weather data using the free
        <a href="https://openweathermap.org/" target="_blank"
          >Open Weather Map</a
        >
        API.
      </p>
      <v-switch
        v-model="weatherWidgetEnabled"
        label="Enable weather widget"
      ></v-switch>
      <v-radio-group v-model="temperatureUnit" label="Temperature unit">
        <v-radio label="°C (Celsius)" value="c"></v-radio>
        <v-radio label="°F (Fahrenheit)" value="f"></v-radio>
        <v-radio label="K (Kelvin)" value="k"></v-radio>
      </v-radio-group>
      <!-- TASKS WIDGET -->
      <div class="title pt-2">Tasks Widget</div>
      <p>
        This widget makes sure things are getting done in your home. No one ever
        dared to question its authority. (It might be useless at the moment, but
        the authority is already implemented.)
      </p>
      <v-switch
        v-model="tasksWidgetEnabled"
        label="Enable tasks widget"
      ></v-switch>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  name: "DashboardSettings",
  computed: {
    weatherWidgetEnabled: {
      set(val) {
        this.$store.commit("userSettings/set_key", {
          key: "weatherWidgetEnabled",
          value: val
        });
      },
      get() {
        return this.$store.state.userSettings.weatherWidgetEnabled;
      }
    },
    clockWidgetEnabled: {
      set(val) {
        this.$store.commit("userSettings/set_key", {
          key: "clockWidgetEnabled",
          value: val
        });
      },
      get() {
        return this.$store.state.userSettings.clockWidgetEnabled;
      }
    },
    tasksWidgetEnabled: {
      set(val) {
        this.$store.commit("userSettings/set_key", {
          key: "tasksWidgetEnabled",
          value: val
        });
      },
      get() {
        return this.$store.state.userSettings.tasksWidgetEnabled;
      }
    },
    temperatureUnit: {
      set(val) {
        this.$store.commit("userSettings/set_key", {
          key: "temperatureUnit",
          value: val
        });
      },
      get() {
        return this.$store.state.userSettings.temperatureUnit;
      }
    }
  }
};
</script>
