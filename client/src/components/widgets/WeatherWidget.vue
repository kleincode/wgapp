<template>
  <Widget
    :title="$t('widgets.weather.title')"
    :loading="loading"
    :error="!display"
    with-footer
    :context-items="contextItems"
    @context-action="contextAction"
  >
    <template v-if="display">
      <span class="display-3">{{ convertedTemperature }}</span>
      <span class="display-1" style="vertical-align: top;">
        {{ displayTemperatureUnit }}</span
      >
    </template>
    <template v-else>
      <p>{{ $t("widgets.weather.configError") }}</p>
      <v-btn text to="/settings/dashboard">{{
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
  data: () => ({
    temperature: 0,
    lastUpdate: null,
    condition: "...",
    cityName: "",
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
    convertedTemperature() {
      switch (this.temperatureUnit) {
        case "c":
          return Math.round(this.temperature - 273.15);
        case "f":
          return Math.round((this.temperature * 9) / 5 - 459.67);
        default:
          return Math.round(this.temperature);
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
    }
  }
};
</script>
