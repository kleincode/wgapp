import "@mdi/font/css/materialdesignicons.css";
import Vue from "vue";
import colors from "vuetify/lib/util/colors";
import { preset } from "vue-cli-plugin-vuetify-preset-reply/preset";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  preset,
  icons: {
    iconfont: "mdi" // default - only for display purposes
  },
  themes: {
    light: {
      primary: colors.blue.darken4,
      secondary: colors.blueGrey.darken4,
      accent: "#F9AA33",
      error: colors.red.base,
      warning: colors.orange.base,
      info: colors.teal.base,
      success: colors.green.base
    },
    dark: {
      primary: colors.blue.darken4,
      secondary: colors.blueGrey.darken4,
      accent: "#F9AA33",
      error: colors.red.base,
      warning: colors.orange.base,
      info: colors.teal.base,
      success: colors.green.base
    }
  }
});
