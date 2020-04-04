<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" max-width="1000px" scrollable>
      <template v-slot:activator="{ on }">
        <v-btn color="primary" outlined dark v-on="on">Change Icon</v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Icon Chooser</span>
        </v-card-title>
        <v-card-text style="height: 500px;">
          <p class="subtitle-1">Common icons</p>
          <v-row>
            <v-col
              cols="4"
              md="3"
              lg="1"
              v-for="(icon, i) in icons.slice(0, 11)"
              :key="'icon-' + i"
              @click="select(i)"
              class="iconEntry"
            >
              <v-hover v-slot:default="{ hover }">
                <v-card
                  :class="{ 'on-hover': hover, primary: selId == i }"
                  :elevation="hover ? 12 : 2"
                  class="pt-2 pb-2"
                >
                  <v-icon style="font-size: 3em" class="pb-1">{{
                    icon
                  }}</v-icon>
                </v-card>
              </v-hover>
            </v-col>
          </v-row>

          <p class="subtitle-1 pt-12">All icons</p>
          <v-row>
            <v-col
              cols="4"
              md="3"
              lg="1"
              v-for="(icon, i) in icons.slice(11, icons.length)"
              :key="'icon-' + i"
              @click="select(i + offset)"
              class="iconEntry"
            >
              <v-hover v-slot:default="{ hover }">
                <v-card
                  :class="{ 'on-hover': hover, primary: selId == i + offset }"
                  :elevation="hover ? 12 : 2"
                  class="pt-2 pb-2"
                >
                  <v-icon style="font-size: 3em" class="pb-1">{{
                    icon
                  }}</v-icon>
                </v-card>
              </v-hover>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn outlined text @click="save">ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import icons from "@/assets/icons.js";

export default {
  data: () => {
    return {
      dialog: false,
      icons,
      selId: -1,
      offset: 11
    };
  },
  methods: {
    select(id) {
      this.selId = id;
    },

    save() {
      this.$emit("input", this.selId);
      this.dialog = false;
    }
  },
  props: {
    value: {
      type: Number,
      default: 0
    }
  }
};
</script>
<style lang="scss" scoped>
.iconEntry {
  text-align: center;
}
</style>
