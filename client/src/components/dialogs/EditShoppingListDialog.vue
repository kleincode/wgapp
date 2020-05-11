<template>
  <v-dialog v-model="dialogShown" max-width="720px">
    <template v-slot:activator="{ on }">
      <v-btn
        color="success"
        icon
        :aria-label="$t('shopping.list.create')"
        v-on="on"
      >
        <v-icon>add</v-icon>
      </v-btn>
    </template>
    <v-form ref="form" v-model="formValid" @submit.prevent="save">
      <v-card :loading="loading">
        <v-card-title>
          <span class="headline">{{
            editMode ? $t("shopping.list.edit") : $t("shopping.list.new")
          }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" style="text-align: center">
                <v-icon style="font-size: 10em" class="mb-3">{{
                  getIcon(value.icon)
                }}</v-icon>
                <br />
                <icon-chooser
                  v-model="selectedIcon"
                  @ok="newIconSelected"
                  @cancel="noNewIconSelected"
                ></icon-chooser>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  ref="name"
                  v-model="value.name"
                  label="Name"
                  outlined
                  counter="160"
                  maxlength="160"
                  :rules="nameRules"
                  @input="updateValue()"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="reset">{{
            $t("commands.cancel")
          }}</v-btn>
          <v-btn color="green" text type="submit" :disabled="!formValid">{{
            $t("commands.save")
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import icons from "@/assets/icons.js";
import IconChooser from "@/components/IconChooser.vue";

export default {
  name: "EditShoppingListDialog",
  components: {
    IconChooser
  },
  props: {
    value: {
      type: Object,
      default: () => ({
        name: "",
        icon: 0
      })
    }
  },
  data: () => ({
    dialogShown: false,
    formValid: null,
    loading: false,
    editMode: false,
    editId: null,
    selectedIcon: 0
  }),
  computed: {
    nameRules() {
      return [
        v => !!v || this.$t("shopping.list.provideListName"),
        v =>
          (!!v && v.length <= 160) || this.$t("shopping.list.listNameTooLong")
      ];
    }
  },
  methods: {
    getIcon(index) {
      return icons[index];
    },
    updateValue(val) {
      this.$emit("input", val || this.value);
    },
    newIconSelected(id) {
      this.updateValue({ ...this.value, icon: id });
      this.selectedIcon = id;
    },
    noNewIconSelected() {
      this.selectedIcon = this.value.icon;
    },
    async commitNewList(listData) {
      await this.$store.dispatch("shopping/pushList", {
        ...listData,
        id: this.$uuid.v1()
      });
    },
    async commitEditList(listData) {
      await this.$store.dispatch("shopping/editList", listData);
    },
    async save() {
      if (!this.formValid) return;
      this.loading = true;
      try {
        if (this.editMode) await this.commitEditList(this.value);
        else await this.commitNewList(this.value);
        this.reset();
        this.$emit("committed");
      } catch (err) {
        this.$store.dispatch(
          "showSnackbar",
          err || this.$t("shopping.list.addFail")
        );
        console.warn(err);
      }
      this.loading = false;
    },
    reset() {
      this.dialogShown = false;
      setTimeout(() => {
        this.updateValue({
          name: "",
          id: "",
          icon: 0
        });
        this.$refs.form.resetValidation();
        this.editMode = false;
      }, 100);
    },
    startEdit(itemData) {
      this.editMode = true;
      this.updateValue({
        name: itemData.name,
        id: itemData.id,
        icon: itemData.icon
      });
      this.dialogShown = true;
    }
  }
};
</script>
