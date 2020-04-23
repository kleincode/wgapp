<template>
  <v-container fluid>
    <h1 class="display-2 pb-6">Shopping List</h1>
    <v-row class="ml-4" cols="12">
      <v-col>
        <v-card :loading="loadingLists">
          <v-card-title
            >Shoppinglists
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="clickCreateList"
              >New Shoppinglist</v-btn
            >
          </v-card-title>
          <v-list>
            <v-list-item-group
              v-model="selectedList"
              color="primary"
              @change="selectList"
            >
              <v-list-item v-for="(list, i) in shoppingLists" :key="i"
                ><v-list-item-icon>
                  <v-icon v-text="list.icon"></v-icon> </v-list-item-icon
                ><v-list-item-content
                  ><v-list-item-title v-text="list.name"></v-list-item-title
                ></v-list-item-content>

                <v-list-item-action style="display: block" class="pt-3">
                  <v-btn icon>
                    <v-icon
                      color="grey lighten-1"
                      @click="onClickEditSaveList(i)"
                      >{{ shoppingLists[i].editIcon }}</v-icon
                    >
                  </v-btn>
                  <v-btn icon>
                    <v-icon
                      color="grey lighten-1"
                      @click="onClickDeleteCancelList(i)"
                      >{{ shoppingLists[i].cancelIcon }}</v-icon
                    >
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>

      <v-col>
        <v-card :loading="loadingItems">
          <v-card-title
            >{{ shoppingLists[selectedList].name }} <v-spacer></v-spacer
            ><v-btn color="primary" text @click="clickCreateItem"
              >New Item</v-btn
            ></v-card-title
          >

          <v-card-text>
            <v-list dense
              ><v-list-item
                v-for="(item, i) in itemlist"
                :key="i"
                @blur="onSave(item)"
              >
                <v-list-item-content>
                  <v-list-item-title
                    ><v-combobox
                      v-model="item.item"
                      :single-line="true"
                      :items="getAutocompletionItems()"
                      :disabled="item.disabledProp"
                      auto-select-first
                      @blur="onSave(item)"
                    ></v-combobox
                  ></v-list-item-title>
                </v-list-item-content>

                <v-list-item-action style="display: block" class="pt-3">
                  <v-btn v-if="item.disabledProp" icon @click="onEdit(item)">
                    <v-icon color="grey lighten-1">{{ item.icon }}</v-icon>
                  </v-btn>
                  <v-btn v-else icon @click="onSave(item)">
                    <v-icon color="grey lighten-1">{{ item.icon }}</v-icon>
                  </v-btn>
                  <v-btn icon @click="onClickDeleteCancel(item)">
                    <v-icon color="grey lighten-1">{{
                      item.cancelIcon
                    }}</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list></v-card-text
          >
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="addList" max-width="550px" overlay-opacity="1">
      <v-card>
        <v-card-title>
          Create a new Shoppinglist
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="textFieldNewList"
            required
            class="my-3 mx-3"
            hint="Enter a name"
            placeholder="Beer & other Drugs"
            clearable
          >
          </v-text-field>
        </v-card-text>

        <v-card-actions>
          <!--spacer sorgt dafür dass buttons rechts sind-->
          <v-spacer></v-spacer>
          <v-btn outlined @click="clickSaveList">Save</v-btn>
          <v-btn outlined @click="clickCancel">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import en_autoItems from "@/assets/en_shoppingitems.js";
import de_autoItems from "@/assets/de_shoppingitems.js";

export default {
  name: "ShoppingList",
  data: () => ({
    //Variablen einfügen
    disabledTest: true,
    addList: false,
    addItem: false,
    textFieldNewList: "",
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
    shoppingLists: [{ name: "", icon: "", id: -1 }],
    selectedList: 0,
    selectedItem: 0,
    loadingItems: false,
    loadingLists: false
  }),
  async mounted() {
    await this.fetchShoppinglists();
    this.fetchShoppingItems();
  },

  computed: {
    ...mapState("userSettings", ["locale"])
  },

  methods: {
    clickCreateList() {
      //Methodencode
      this.addList = true;
    },
    clickCreateItem() {
      //Methodencode
      this.itemlist.push({
        item: "",
        checked: false,
        listid: this.shoppingLists[this.selectedList].id,
        disabledProp: false,
        icon: this.shoppingIcons[1],
        cancelIcon: this.shoppingIcons[2]
      });
    },
    clickSaveList() {
      this.createShoppingslist();
      this.addList = false;
    },
    clickCancel() {
      this.addList = false;
      this.addItem = false;
    },
    onClickDeleteCancel(item) {
      console.log("## cancelling");
      //Alten content des textfeldes speichern und bei cancel restore
      //handeln was passiert wenn deleted / cancelled wird
      if (this.selectedItem != item.id) {
        this.setDefaultIcons(this.itemlist[this.selectedItem]);
      }
      if (item.disabledProp == true) {
        //item löschen
        //Methode zum löschen eines Items aufrufen
      } else {
        //cancel methode
        this.setDefaultIcons(item);
      }
    },
    onSave(item) {
      console.log("### save", item);
      if (isNaN(item.id)) {
        this.createItem(item);
      } else {
        this.editItem(item.item, item.id, item.checked);
      }
      this.setDefaultIcons(item);
    },
    onEdit(item) {
      console.log("### edit", item);
      //Alten content des textfeldes speichern und bei cancel restore
      //überprüfen ob schon ein anderes Textfeld im Bearbeitungsmodus ist
      if (item.disabledProp == true) {
        //edit Mode
        this.setEditIcons(item);
      }
    },
    setEditIcons(item) {
      //setzt nur icons
      item.disabledProp = false;
      item.icon = this.shoppingIcons[1];
      item.cancelIcon = this.shoppingIcons[3];
    },
    setDefaultIcons(item) {
      //setzt nur icons
      try {
        item.disabledProp = true;
        item.icon = this.shoppingIcons[0];
        item.cancelIcon = this.shoppingIcons[2];
      } catch (err) {
        console.error(err);
      }
    },

    //Shoppinglist editieren
    onClickDeleteCancelList(i) {
      //handeln was passiert wenn deleted / cancelled wird
      if (this.selectedList != i) {
        this.setDefaultListIcons(this.selectedList);
        if (i < 0) {
          //kein neues Item gefocused sondern durch blur event getriggert
          this.selectedList = i;
        } else {
          this.selectedList = i;
        }
      }

      if (this.selectedList[i].disabledProp == true) {
        //item löschen
        //Methode zum löschen eines Items aufrufen
      } else {
        //cancel methode
        this.setDefaultIcons(i);
      }
    },
    onClickEditSaveList(i) {
      //überprüfen ob schon ein anderes Textfeld im Bearbeitungsmodus ist
      if (this.selectedList != i) {
        this.setDefaultIcons(this.selectedList);
        this.selectedList = i;
        //TODO: Save methode ausführen für altes item
      }

      if (this.shoppingLists[i].disabledProp == true) {
        //edit Mode
        this.setEditIcons(i);
      } else {
        //save
        this.setDefaultIcons(i);
      }
    },
    setEditListIcons(index) {
      //setzt nur icons
      this.shoppingLists[index].disabledProp = false;
      this.shoppingLists[index].editIcon = this.shoppingIcons[1];
      this.shoppingLists[index].cancelIcon = this.shoppingIcons[3];
    },
    setDefaultListIcons(index) {
      //setzt nur icons
      this.shoppingLists[index].disabledProp = true;
      this.shoppingLists[index].editIcon = this.shoppingIcons[0];
      this.shoppingLists[index].cancelIcon = this.shoppingIcons[2];
    },
    selectList() {
      //Methode fetchShoppingList aufrufen um daten abzurufen aus mysql
      this.fetchShoppinglists();
      this.fetchShoppingItems();
    },
    async fetchShoppinglists() {
      try {
        this.loadingLists = true;
        const { data } = await this.$http.get("/_/fetchshoppinglists");

        if (data.success) {
          this.shoppingLists = [];
          data.data.forEach(list => {
            this.shoppingLists.push({
              name: list.name,
              icon: "bathtub",
              editIcon: this.shoppingIcons[0],
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
    async fetchShoppingItems() {
      if (this.shoppingLists[this.selectedList].id == -1) {
        //Keine Liste ist ausgewählt
        this.itemlist = [];
        return;
      }
      this.loadingItems = true;
      var id = this.shoppingLists[this.selectedList].id;
      try {
        const { data } = await this.$http.get("/_/fetchshoppinglistitems", {
          params: { listid: id }
        });

        if (data.success) {
          this.itemlist = [];
          //TODO: Überprüfen ob liste leer ist
          data.data.forEach(list => {
            this.itemlist.push({
              id: list.id,
              item: list.item,
              checked: list.checked,
              listid: this.shoppingLists[this.selectedList].id,
              disabledProp: true,
              icon: this.shoppingIcons[0],
              cancelIcon: this.shoppingIcons[2]
            });
          });
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
    async createShoppingslist() {
      //icon hinzufügen
      try {
        var icon = 120;
        var name = this.textFieldNewList;
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
        this.fetchShoppinglists();
      } catch (err) {
        console.error(err);
        this.$store.dispatch(
          "showSnackbar",
          "Error creating shopping list. Please try again later."
        );
      }
    },

    async createItem(item) {
      try {
        console.log(item);
        let itemName = item.item;
        console.log(itemName);
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
            "Error editing shopping list item. Please try again later."
          );
        }
        this.fetchShoppingItems();
      } catch (err) {
        this.$store.dispatch(
          "showSnackbar",
          "Error editing shopping list item. Please try again later."
        );
      }
    },

    //Helpers
    getAutocompletionItems() {
      let locale = this.locale;
      if (locale) locale = [locale, "en-US"];
      if (locale.toString().substr(0, 2) == "de") {
        return de_autoItems;
      } else {
        return en_autoItems;
      }
    }
  }
};
</script>
