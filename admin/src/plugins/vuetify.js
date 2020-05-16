import Vue from "vue";
import Vuetify from "vuetify/lib";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import { preset } from "vue-cli-plugin-vuetify-preset-reply/preset";
import colors from "vuetify/lib/util/colors";

Vue.use(Vuetify);

export default new Vuetify({
  preset,
  icons: {
    iconfont: "md"
  },
  theme: {
    themes: {
      light: {
        primary: colors.blue.darken4,
        secondary: colors.blueGrey.darken4,
        accent: colors.amber.base,
        error: colors.red.base,
        warning: colors.orange.base,
        info: colors.teal.base,
        success: colors.green.base
      },
      dark: {
        primary: colors.blue.darken4,
        secondary: colors.blueGrey.darken4,
        accent: colors.yellow.darken4,
        error: colors.red.base,
        warning: colors.orange.base,
        info: colors.teal.base,
        success: colors.green.base
      }
    }
  }
});
