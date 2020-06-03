<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      max-width="1000px"
      scrollable
      @click:outside="cancel"
    >
      <template v-slot:activator="{ on }">
        <v-btn
          :color="$vuetify.theme.dark ? 'primary lighten-2' : 'primary'"
          text
          :disabled="disabled"
          v-on="on"
          >{{ $t("iconChooser.changeIcon") }}</v-btn
        >
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">{{ $t("iconChooser.title") }}</span>
        </v-card-title>
        <v-card-text style="height: 500px;">
          <p class="subtitle-1">{{ $t("iconChooser.commonIcons") }}</p>
          <v-row>
            <v-col
              v-for="(icon, i) in icons.slice(0, 11)"
              :key="'icon-' + i"
              cols="4"
              md="3"
              lg="1"
              class="iconEntry"
              @click="select(i)"
              @dblclick="
                select(i);
                save();
              "
            >
              <v-hover v-slot:default="{ hover }">
                <v-card
                  :elevation="hover ? 8 : 4"
                  :color="value == i ? 'primary' : null"
                  class="pt-2 pb-2"
                >
                  <v-icon
                    style="font-size: 3em"
                    class="pb-1"
                    :color="value == i ? 'white' : null"
                    >{{ icon }}</v-icon
                  >
                </v-card>
              </v-hover>
            </v-col>
          </v-row>

          <p class="subtitle-1 pt-12">{{ $t("iconChooser.allIcons") }}</p>
          <v-row>
            <v-col
              v-for="(icon, i) in icons.slice(11, icons.length)"
              :key="'icon-' + i"
              cols="4"
              md="3"
              lg="1"
              class="iconEntry"
              @click="select(i + offset)"
              @dblclick="
                select(i);
                save();
              "
            >
              <v-hover v-slot:default="{ hover }">
                <v-card
                  :elevation="hover ? 8 : 4"
                  :color="value == i + offset ? 'primary' : null"
                  class="pt-2 pb-2"
                >
                  <v-icon
                    style="font-size: 3em"
                    class="pb-1"
                    :color="value == i + offset ? 'white' : null"
                    >{{ icon }}</v-icon
                  >
                </v-card>
              </v-hover>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="cancel">{{ $t("commands.cancel") }}</v-btn>
          <v-btn text color="success" @click="save">{{
            $t("commands.ok")
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import icons from "@/assets/icons.js";

export default {
  props: {
    value: {
      type: Number,
      default: 0
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {
      dialog: false,
      icons,
      offset: 11
    };
  },
  methods: {
    select(id) {
      this.$emit("input", id);
    },

    save() {
      this.$emit("ok", this.value);
      this.dialog = false;
    },

    cancel() {
      this.$emit("cancel");
      this.dialog = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.iconEntry {
  text-align: center;
}
</style>
