<template>
  <v-container fluid>
    <h1 class="display-2 pb-6">Shopping</h1>
    <v-row class="ml-4" cols="12">
      <v-col>
        <v-card :loading="loadingLists" style="height: 100%">
          <v-card-title>
            Lists
            <v-spacer></v-spacer>
            <edit-shopping-list-dialog ref="editDialog" v-model="editList" />
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
                  <v-btn icon @click="deleteShoppingsList(list)">
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
        <v-card :loading="loadingItems" style="height: 100%">
          <v-card-title>
            <v-icon class="mr-2">
              {{ getIcon(getSelectListIcon()) }}
            </v-icon>
            {{ getSelectListName() }}
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              :disabled="!isListSelected"
              @click="clickCreateItem"
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
            <v-list v-if="itemlist.length > 0" dense>
              <transition-group name="shopping-items" tag="ul">
                <v-list-item
                  v-for="(item, i) in itemlist"
                  :key="item.id"
                  @blur="onSave(item)"
                >
                  <v-list-item-content style="display: contents">
                    <v-checkbox
                      v-model="item.checked"
                      @change="checkItem(item)"
                    >
                    </v-checkbox>
                    <v-list-item-title
                      ><v-combobox
                        ref="combo"
                        v-model="item.item"
                        :single-line="true"
                        :items="getAutocompletionItems()"
                        auto-select-first
                        append-icon=""
                        :disabled="item.checked"
                        @keydown.enter="selectNextItem(i)"
                        @blur="onSave(item)"
                      ></v-combobox
                    ></v-list-item-title>
                  </v-list-item-content>

                  <v-list-item-action style="display: block">
                    <v-btn icon @click="onClickDeleteCancel(item)">
                      <v-icon>{{ item.cancelIcon }}</v-icon>
                    </v-btn>
                  </v-list-item-action>
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
              v-model="shoppingLists[selectedList]"
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
    //Variablen einfügen
    disabledTest: true,
    addListDialog: false,
    addItem: false,
    editList: {
      name: "",
      icon: 0
    },
    selectedIcon: 0,
    textFieldNewItemName: "",
    textFieldNewItemAmount: 0,
    selected: [],
    shoppingIcons: ["edit", "check", "delete", "cancel"],
    headers: [
      {
        text: "Item",
        align: "start",
        sortable: false,
        value: "item"
      },
      { text: "Amount", value: "amount" }
    ],
    itemlist: [],
    shoppingLists: [],
    selectedList: 0,
    selectedItem: 0,
    loadingItems: false,
    loadingLists: false
  }),

  computed: {
    ...mapState("userSettings", ["locale"]),
    ...mapState("shopping", ["lists"]),
    isListSelected() {
      return !(
        this.selectedList < 0 ||
        this.selectedList >= this.shoppingLists.length ||
        this.selectedList == undefined
      );
    },
    completedTasks() {
      return this.itemlist.filter(task => task.checked).length;
    },
    progress() {
      return (this.completedTasks / this.itemlist.length) * 100;
    },
    remainingTasks() {
      return this.itemlist.length - this.completedTasks;
    }
  },

  async mounted() {
    try {
      await this.$store.dispatch("shopping/sync");
    } catch (err) {
      this.$store.dispatch("showSnackbar", "Sync failed: " + err);
    }
  },

  methods: {
    clickCreateItem() {
      this.itemlist.push({
        item: "",
        checked: false,
        listid: this.shoppingLists[this.selectedList].id,
        disabledProp: false,
        id: -1
      });
      let lastindex = this.itemlist.length - 1;
      setTimeout(() => this.$refs.combo[lastindex].focus(), 100);
    },

    onClickDeleteCancel(item) {
      //Alten content des textfeldes speichern und bei cancel restore
      //handeln was passiert wenn deleted / cancelled wird
      if (this.selectedItem != item.id) {
        this.setDefaultIcons(this.itemlist[this.selectedItem]);
      }
      if (item.disabledProp == true) {
        this.deleteShoppingItem(item);
      } else {
        //cancel methode
        this.setDefaultIcons(item);
      }
    },
    onSave(item) {
      setTimeout(() => {
        if (item.id == -1) {
          this.createItem(item);
        } else {
          this.editItem(item.item, item.id, item.checked);
        }
        this.setDefaultIcons(item);
      }, 50);
    },
    setEditIcons(item) {
      //setzt nur icons
      item.disabledProp = false;
      item.cancelIcon = this.shoppingIcons[3];
    },
    setDefaultIcons(item) {
      //setzt nur icons
      try {
        item.disabledProp = true;
        item.cancelIcon = this.shoppingIcons[2];
      } catch (err) {
        console.error(err);
      }
    },

    //Shopping lists

    async fetchShoppinglists() {
      try {
        this.loadingLists = true;
        const { data } = await this.$http.get("/_/fetchshoppinglists");

        if (data.success) {
          this.shoppingLists = [];
          data.data.forEach(list => {
            this.shoppingLists.push({
              name: list.name,
              icon: list.icon,
              cancelIcon: this.shoppingIcons[2],
              disabledProp: true,
              id: list.id
            });
          });
        } else {
          this.$store.dispatch(
            "showSnackbar",
            "Couldn't fetch shopping lists. Please try again later."
          );
        }
        this.loadingLists = false;
      } catch (error) {
        this.$store.dispatch(
          "showSnackbar",
          "Error during fetching shopping lists. Please try again later."
        );
        console.error(error);
        this.loadingLists = false;
      }
    },
    async createShoppingsList(list) {
      //icon hinzufügen
      try {
        let icon = list.icon;
        let name = list.name;
        const { data } = await this.$http.post("/_/createshoppinglist", {
          name,
          icon
        });
        if (!data.success) {
          console.error(data);
          this.$store.dispatch(
            "showSnackbar",
            "Couldn't create shopping list. Please try again later."
          );
        } else {
          this.$store.dispatch(
            "showSnackbar",
            "Successfully created your new shopping list."
          );
        }
        this.update();
      } catch (err) {
        console.error(err);
        this.$store.dispatch(
          "showSnackbar",
          "Error creating shopping list. Please try again later."
        );
      }
    },

    async editShoppingsList(list) {
      //icon hinzufügen
      try {
        let id = list.id;
        let icon = list.icon;
        let name = list.name;
        const { data } = await this.$http.post("/_/editshoppinglist", {
          id,
          name,
          icon
        });
        if (!data.success) {
          console.error(data);
          this.$store.dispatch(
            "showSnackbar",
            "Couldn't edit shopping list. Please try again later."
          );
        } else {
          this.$store.dispatch(
            "showSnackbar",
            "Successfully edited your shopping list."
          );
        }
        this.update();
      } catch (err) {
        console.error(err);
        this.$store.dispatch(
          "showSnackbar",
          "Error editing shopping list. Please try again later."
        );
      }
    },

    async deleteShoppingsList(list) {
      //icon hinzufügen
      try {
        this.loadingItems = true;
        this.loadingLists = true;
        if (
          this.shoppingLists.indexOf(list) == this.shoppingLists.length - 1 &&
          this.shoppingLists.length - 1 == this.selectedList
        ) {
          this.selectedList = 0;
        }
        let id = list.id;
        const { data } = await this.$http.post("/_/deleteshoppinglist", {
          id
        });
        if (!data.success) {
          console.error(data);
          this.$store.dispatch(
            "showSnackbar",
            "Couldn't edit shopping list. Please try again later."
          );
        } else {
          this.$store.dispatch("showSnackbar", data.message);
        }
        this.loadingItems = false;
        this.loadingLists = false;
        this.update();
      } catch (err) {
        this.loadingItems = false;
        this.loadingLists = false;
        console.error(err);
        this.$store.dispatch(
          "showSnackbar",
          "Error editing shopping list. Please try again later."
        );
      }
    },

    //Shopping items

    async fetchShoppingItems() {
      if (!this.isListSelected) {
        //Keine Liste ist ausgewählt
        this.itemlist = [];
        return;
      }
      this.loadingItems = true;
      try {
        var id = this.shoppingLists[this.selectedList].id;
      } catch (err) {
        return;
        //igonore
      }
      try {
        const { data } = await this.$http.get("/_/fetchshoppinglistitems", {
          params: { listid: id }
        });

        if (data.success) {
          this.itemlist = data.data
            .map(elem => ({
              id: elem.id,
              item: elem.item,
              checked: !!elem.checked,
              listid: this.shoppingLists[this.selectedList].id,
              disabledProp: true,
              icon: this.shoppingIcons[0],
              cancelIcon: this.shoppingIcons[2]
            }))
            .sort((a, b) => a.checked - b.checked);
        } else {
          this.$store.dispatch(
            "showSnackbar",
            "Couldn't fetch shopping items. Please try again later."
          );
        }
        this.loadingItems = false;
      } catch (error) {
        console.error(error);
        this.$store.dispatch(
          "showSnackbar",
          "Error during fetching shopping items. Please try again later."
        );
        this.loadingItems = false;
      }
    },

    async createItem(item) {
      try {
        let itemName = item.item;
        let listid = item.listid;
        const { data } = await this.$http.post("/_/createShoppingItem", {
          item: itemName,
          listid
        });
        if (!data.success) {
          console.error(data);
          this.$store.dispatch(
            "showSnackbar",
            "Couldn't create new shopping list item. Please try again later."
          );
        }
        this.fetchShoppingItems();
      } catch (err) {
        this.$store.dispatch(
          "showSnackbar",
          "Error creating shopping list item. Please try again later."
        );
      }
    },
    async editItem(newItemName, itemid, checked) {
      try {
        //icon hinzufügen
        var item = newItemName;
        var listid = this.shoppingLists[this.selectedList].id;
        const { data } = await this.$http.post("/_/editShoppingItem", {
          item,
          listid,
          itemid,
          checked
        });
        if (!data.success) {
          this.$store.dispatch(
            "showSnackbar",
            "Couldn't edit shopping item. Please try again later."
          );
        }
        this.fetchShoppingItems();
      } catch (err) {
        this.$store.dispatch(
          "showSnackbar",
          "Error editing shopping item. Please try again later."
        );
      }
    },

    async checkItem(item) {
      try {
        var id = item.id;
        var targetState = !item.checked;
        const { data } = await this.$http.post("/_/checkshoppingitem", {
          id,
          targetState
        });
        if (!data.success) {
          this.$store.dispatch(
            "showSnackbar",
            "Couldn't check shopping item. Please try again later."
          );
        }
        this.fetchShoppingItems();
      } catch (err) {
        this.$store.dispatch(
          "showSnackbar",
          "Error checking shopping item. Please try again later."
        );
      }
    },

    async deleteShoppingItem(item) {
      try {
        //icon hinzufügen
        var id = item.id;
        const { data } = await this.$http.post("/_/deleteshoppingitem", {
          id
        });
        if (!data.success) {
          this.$store.dispatch(
            "showSnackbar",
            "Couldn't delete shopping item. Please try again later."
          );
        }
        this.fetchShoppingItems();
      } catch (err) {
        this.$store.dispatch(
          "showSnackbar",
          "Error editing shopping item. Please try again later."
        );
      }
    },

    //Helpers
    getAutocompletionItems() {
      let locale = this.locale;
      if (!locale) locale = "en-US";
      if (locale.toString().substr(0, 2) == "de") {
        return de_autoItems;
      } else {
        return en_autoItems;
      }
    },

    getIcon(index) {
      return icons[index];
    },
    getSelectListName() {
      if (
        !this.isListSelected ||
        this.shoppingLists[this.selectedList] == undefined
      ) {
        return "No list selected";
      } else {
        return this.shoppingLists[this.selectedList].name;
      }
    },
    getSelectListIcon() {
      if (
        !this.isListSelected ||
        this.shoppingLists[this.selectedList] == undefined
      ) {
        return "";
      } else {
        return this.shoppingLists[this.selectedList].icon;
      }
    },

    selectNextItem(i) {
      this.$refs.combo[i].blur();
      if (this.remainingTasks > i + 1) {
        this.$refs.combo[i + 1].focus();
      } else {
        this.$refs.combo[0].focus();
      }
    },

    async update() {
      await this.fetchShoppinglists();
      this.loadingLists = false;
      await this.fetchShoppingItems();
      this.loadingItems = false;
    }
  }
};
</script>
<style>
.shopping-items-move {
  transition: transform 0.6s;
}
</style>
