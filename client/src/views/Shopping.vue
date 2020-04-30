<template>
  <v-container>
    <h1 class="display-2 pb-6">Shopping</h1>
    <v-row class="ml-4" cols="12">
      <v-col>
        <v-card style="height: 100%">
          <v-card-title>
            Lists
            <v-spacer></v-spacer>
            <edit-shopping-list-dialog
              ref="editDialog"
              v-model="editList"
              @committed="updateRemoteFunction()"
            />
          </v-card-title>
          <v-list v-if="lists.length > 0">
            <v-list-item-group
              v-model="selectedList"
              color="primary"
              @change="fetchShoppingItems"
            >
              <v-list-item v-for="list in lists" :key="list.id"
                ><v-list-item-icon>
                  <v-icon>{{ getIcon(list.icon) }}</v-icon> </v-list-item-icon
                ><v-list-item-content
                  ><v-list-item-title v-text="list.name"></v-list-item-title
                ></v-list-item-content>

                <v-list-item-action style="display: block" class="">
                  <v-btn icon @click="$refs.editDialog.startEdit(list)">
                    <v-icon>
                      {{ shoppingIcons[0] }}
                    </v-icon>
                  </v-btn>
                  <v-btn icon @click="deleteList(list)">
                    <v-icon>
                      {{ shoppingIcons[2] }}
                    </v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list-item-group>
          </v-list>
          <div
            v-else
            style="text-align: center"
            class="text--disabled pb-12 pt-8"
          >
            <v-icon style="font-size: 10em" class="text--disabled"
              >shopping_cart</v-icon
            >
            <br />Go make a list, shopping is fun!
          </div>
        </v-card>
      </v-col>

      <v-col>
        <v-card style="height: 100%">
          <v-card-title>
            <v-icon class="mr-2">
              {{ getIcon(selectedListIcon) }}
            </v-icon>
            {{ selectedListName }}
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              :disabled="!isListSelected"
              @click="pushItem"
            >
              New Item
            </v-btn>
          </v-card-title>

          <v-card-text>
            <v-row class="my-1 mr-4" align="center">
              <strong class="mx-4 info--text text--darken-2">
                Remaining: {{ remainingTasks }}
              </strong>
              <v-divider vertical></v-divider>
              <strong class="mx-4 success--text text--darken-2">
                Completed: {{ completedTasks }}
              </strong>
              <v-spacer></v-spacer>
              <v-progress-circular
                :value="progress"
                class="mr-2"
              ></v-progress-circular>
            </v-row>
            <v-list v-if="items.length > 0" dense>
              <transition-group name="shopping-items" tag="ul">
                <v-list-item v-for="(item, i) in displayedItems" :key="item.id">
                  <v-list-item-content style="display: contents">
                    <v-checkbox
                      v-model="item.checked"
                      class="mt-0"
                      hide-details
                      @change="updateItem(item, i)"
                    >
                    </v-checkbox>
                    <v-combobox
                      ref="combo"
                      v-model="item.text"
                      :solo="activeItemIndex != i"
                      dense
                      :class="{
                        'shopping-combo': true,
                        'mt-0': true,
                        'pl-3': activeItemIndex == i,
                        'pr-3': activeItemIndex == i
                      }"
                      :single-line="true"
                      hide-details
                      :items="autocompleteItems"
                      auto-select-first
                      append-icon=""
                      :disabled="!!item.checked"
                      :menu-props="{
                        maxHeight: 150
                      }"
                      @keydown.enter="selectNextItem(i)"
                      @focus="focusItem(i)"
                      @blur="updateItem(item, i)"
                    >
                      <template #append>
                        <v-btn
                          v-if="activeItemIndex == i"
                          icon
                          small
                          @click="deleteItem(item, i)"
                        >
                          <v-icon color="red">
                            delete
                          </v-icon>
                        </v-btn>
                      </template>
                    </v-combobox>
                  </v-list-item-content>
                </v-list-item>
              </transition-group>
            </v-list>
            <div
              v-else
              style="text-align: center"
              class="text--disabled pb-12 pt-8"
            >
              <v-icon style="font-size: 10em" class="text--disabled"
                >shopping_basket</v-icon
              >
              <br />Happy shopping!
            </div></v-card-text
          >
          <div class="ma-4">
            <FinishShoppingDialog
              v-model="lists[selectedList]"
              :completed-tasks="completedTasks"
              :remaining-tasks="remainingTasks"
            ></FinishShoppingDialog>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import FinishShoppingDialog from "@/components/dialogs/FinishShoppingDialog.vue";
import EditShoppingListDialog from "@/components/dialogs/EditShoppingListDialog.vue";
import icons from "@/assets/icons.js";
import en_autoItems from "@/assets/en_shoppingitems.js";
import de_autoItems from "@/assets/de_shoppingitems.js";

export default {
  name: "ShoppingList",
  components: {
    FinishShoppingDialog,
    EditShoppingListDialog
  },
  data: () => ({
    editList: {
      name: "",
      icon: 0
    },
    shoppingIcons: ["edit", "check", "delete", "cancel"],
    selectedList: 0,
    selectedItem: 0,
    loading: false,
    activeItemIndex: -1,
    updateRemoteFunction: null
  }),

  computed: {
    ...mapState("userSettings", ["locale"]),
    ...mapState("shopping", ["lists", "items"]),
    isListSelected() {
      return (
        typeof this.selectedList === "number" && !!this.lists[this.selectedList]
      );
    },
    selectedListName() {
      return this.isListSelected
        ? this.lists[this.selectedList].name
        : "No list selected";
    },
    selectedListIcon() {
      return this.isListSelected ? this.lists[this.selectedList].icon : "";
    },
    completedTasks() {
      return this.items.filter(task => task.checked).length;
    },
    progress() {
      return (this.completedTasks / this.items.length) * 100;
    },
    remainingTasks() {
      return this.items.length - this.completedTasks;
    },
    autocompleteItems() {
      let locale = this.locale;
      if (!locale) locale = "en-US";
      if (locale.toString().substr(0, 2) == "de") {
        return de_autoItems;
      } else {
        return en_autoItems;
      }
    },
    displayedItems() {
      return this.items.filter(el => !el.deleted);
    }
  },

  async mounted() {
    try {
      await this.$store.dispatch("shopping/sync");
      await this.fetchShoppingItems();
      this.updateRemoteFunction = this.updateRemote();
      if (navigator.onLine) this.updateRemoteFunction();
      window.addEventListener("online", this.updateRemoteFunction);
    } catch (err) {
      this.$store.dispatch("showSnackbar", "Sync failed: " + err);
    }
  },

  beforeDestroy() {
    window.removeEventListener("online", this.updateRemoteFunction);
  },

  methods: {
    async pushItem() {
      const newItem = {
        text: "",
        checked: false,
        list: this.lists[this.selectedList].id,
        id: this.$uuid.v1()
      };
      await this.$store.dispatch("shopping/pushItem", newItem);
      let lastindex = this.items.length - 1;
      setTimeout(() => this.$refs.combo[lastindex].focus(), 100);
    },

    updateItem(item, index) {
      if (item.deleted) return;
      this.$refs.combo[index].blur();
      this.activeItemIndex = -1;
      // wait for next tick because combobox doesn't update its text value right away (vuetify bug)
      this.$nextTick(async () => {
        if (await this.$store.dispatch("shopping/editItem", item)) {
          this.updateRemoteFunction();
        }
      });
    },

    async deleteItem(item, index) {
      item.deleted = true;
      if (await this.$store.dispatch("shopping/deleteItem", item.id)) {
        this.updateRemoteFunction();
      }
      setTimeout(() => this.selectNextItem(index - 1), 200);
    },

    async deleteList(list) {
      list.deleted = true;
      if (await this.$store.dispatch("shopping/deleteList", list.id)) {
        this.updateRemoteFunction();
      }
    },

    focusItem(index) {
      this.activeItemIndex = index;
      this.$nextTick(() =>
        this.$refs.combo[this.activeItemIndex].$refs.input.setSelectionRange(
          1000,
          1000
        )
      );
    },

    async fetchShoppingItems() {
      this.$store.dispatch(
        "shopping/loadList",
        this.isListSelected ? this.lists[this.selectedList].id : false
      );
      console.log(
        "fetching",
        this.isListSelected ? this.lists[this.selectedList].id : false
      );
    },

    updateRemote() {
      const that = this;
      return async () => {
        if (navigator.onLine) {
          that.loading = true;
          await that.$store.dispatch("shopping/updateRemote");
          that.loading = false;
        }
      };
    },

    getIcon(index) {
      return icons[index];
    },

    selectNextItem(i) {
      if (i >= 0) this.$refs.combo[i].blur();
      if (this.remainingTasks < 1) return;
      for (
        let next = (i + 1) % this.items.length;
        next != i;
        next = (next + 1) % this.items.length
      ) {
        if (!this.items[next].checked) {
          this.$refs.combo[next].focus();
          break;
        }
      }
    }
  }
};
</script>
<style lang="scss">
.shopping-items-move {
  transition: transform 0.6s;
}
.shopping-combo {
  & * {
    box-shadow: none !important;
    -webkit-box-shadow: none !important;
  }
  & > .v-input__control {
    min-height: 38px !important;
  }
}
</style>