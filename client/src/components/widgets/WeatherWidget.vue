<template>
  <Widget
    :title="$t('widgets.weather.title')"
    :loading="loading"
    :error="!display"
    with-footer
    :large="large"
    :context-items="contextItems"
    @context-action="contextAction"
  >
    <template v-if="display">
      <v-row>
        <v-col :cols="large ? '6' : '3'" class="ma-0 pa-0">
          <v-img
            v-if="conditionICON != ''"
            :src="
              'http://openweathermap.org/img/wn/' + conditionICON + '@4x.png'
            "
          ></v-img>
        </v-col>
        <v-col
          :cols="large ? '6' : '9'"
          style="align-self: center"
          class="pt-0"
        >
          <span class="display-3">
            <v-icon x-large>fa-thermometer-half</v-icon>
            {{ convertTemperature(temperature) }}</span
          >
          <span class="display-1" style="vertical-align: top;">
            {{ displayTemperatureUnit }}
          </span>
          <br />
          <span class="title"
            ><v-icon>keyboard_arrow_down</v-icon
            >{{ convertTemperature(tempMin) + displayTemperatureUnit }}</span
          >
          <span class="title"
            ><v-icon>keyboard_arrow_up</v-icon
            >{{ convertTemperature(tempMax) + displayTemperatureUnit }}</span
          >
          <br />
          <span v-if="large" class="headline">
            <v-icon>fa-tint</v-icon>
            {{ humidity }}%
          </span>
        </v-col>
        <v-col v-if="large" cols="6" class="py-0">
          <p class="title">
            <v-icon>fa-wind</v-icon>
            {{ displayWind }}
          </p>
        </v-col>
        <v-col v-if="large" cols="6" class="py-0">
          <p class="title"><v-icon>fa-eye</v-icon> {{ displayVisibility }}</p>
        </v-col>
        <v-col v-if="large" cols="6" class="py-0">
          <p class="title"><v-icon>fa-cloud</v-icon> {{ cloudiness }}%</p>
        </v-col>
        <v-col v-if="large" cols="6" class="py-0">
          <p class="title">
            <v-icon>fa-globe-europe</v-icon> {{ displayPressure }}
          </p>
        </v-col>
      </v-row>
    </template>
    <template v-else>
      <p class="mb-12 mt-4" style="height: 60%">
        {{ $t("widgets.weather.configError") }}
      </p>
      <v-btn block text to="/settings/dashboard">{{
        $t("navigation.settings")
      }}</v-btn>
    </template>
    <template #footer>
      {{ condition }} | {{ cityName }}
      {{ lastUpdate ? formatTimeHM(lastUpdate) : "" }}
    </template>
  </Widget>
</template>

<script>
import axios from "axios";
import { mapState, mapGetters } from "vuex";
import Widget from "./Widget";

export default {
  name: "WeatherWidget",
  components: {
    Widget
  },
  props: {
    large: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    imperial: false,

    temperature: 0,
    tempMin: 0,
    tempMax: 0,
    lastUpdate: null,
    condition: "...",
    humidity: "0%",
    conditionICON: "",
    cityName: "",
    wind: 0,
    cloudiness: 0,
    visibility: 0,
    pressure: 0,
    display: true,
    loading: false
  }),
  computed: {
    ...mapState("userSettings", [
      "_initialized",
      "locale",
      "temperatureUnit",
      "weatherZip",
      "weatherCountryCode",
      "weatherAPIKey"
    ]),
    ...mapGetters("userSettings", ["formatTimeHM"]),
    displayTemperatureUnit() {
      switch (this.temperatureUnit) {
        case "c":
          return "°C";
        case "f":
          return "°F";
        default:
          return "K";
      }
    },
    displayWind() {
      if (this.imperial) {
        return (
          Math.round(
            this.$units(this.wind)
              .from("m/s")
              .to("m/h") * 100
          ) /
            100 +
          " mi/h"
        );
      } else {
        return this.wind + " m/s";
      }
    },
    displayVisibility() {
      if (this.imperial) {
        let vis = this.$units(this.visibility)
          .from("m")
          .to("mi");
        return Math.round(100 * vis) / 100 + " mi";
      } else {
        let vis = this.$units(this.visibility)
          .from("m")
          .toBest();
        return vis.val + " " + vis.unit;
      }
    },
    displayPressure() {
      if (this.imperial) {
        let pres = this.$units(this.visibility)
          .from("hPa")
          .to("torr");
        return Math.round(pres) / 10 + " mmHg";
      } else {
        return this.pressure + " hPa";
      }
    },
    contextItems() {
      return [
        {
          action: "refresh",
          text: this.$t("commands.refresh"),
          icon: "refresh",
          subtext: this.$t("widgets.lastUpdated", {
            time: this.lastUpdate
              ? this.formatTimeHM(this.lastUpdate)
              : this.$t("widgets.never")
          })
        },
        {
          action: "settings",
          text: this.$t("widgets.settings"),
          icon: "settings"
        }
      ];
    }
  },
  watch: {
    _initialized(val) {
      if (val) this.update();
    }
  },
  mounted() {
    if (this._initialized) this.update();
    this.clockIntervalID = setInterval(() => this.update(), 5 * 60 * 1000);
  },
  beforeDestroy() {
    clearInterval(this.clockIntervalID);
  },
  methods: {
    async update() {
      this.loading = true;
      try {
        const { data } = await axios.get(
          "https://api.openweathermap.org/data/2.5/weather",
          {
            params: {
              zip: this.weatherZip + "," + this.weatherCountryCode,
              appid: this.weatherAPIKey
            },
            validateStatus: () => true
          }
        );
        if (data.cod == 200) {
          this.temperature = data.main.temp;
          this.condition = data.weather[0].main;
          this.conditionICON = data.weather[0].icon;
          this.humidity = data.main.humidity;
          this.tempMax = data.main.temp_max;
          this.tempMin = data.main.temp_min;
          this.wind = data.wind.speed;
          this.visibility = data.visibility;
          this.cloudiness = data.clouds.all;
          this.pressure = data.main.pressure;
          this.cityName = data.name;
          this.lastUpdate = new Date();
          this.display = true;
        } else {
          this.display = false;
        }
      } catch (err) {
        // ignore, offline
      }
      this.loading = false;
    },
    contextAction(item) {
      switch (item.action) {
        case "refresh":
          this.update();
          break;
        case "settings":
          this.$router.push({ name: "DashboardSettings", hash: "#weather" });
      }
    },
    convertTemperature(temperature) {
      switch (this.temperatureUnit) {
        case "c":
          return Math.round(temperature - 273.15);
        case "f":
          return Math.round((temperature * 9) / 5 - 459.67);
        default:
          return Math.round(temperature);
      }
    }
  }
};
</script>
