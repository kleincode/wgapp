<template>
  <v-container fluid>
    <h1 class="display-2 pb-6">Shopping List</h1>
    <v-row class="ml-4" cols="12">
      <v-col>
        <v-card>
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
        <v-card>
          <v-card-title
            >{{ shoppingLists[selectedList].name }} <v-spacer></v-spacer
            ><v-btn color="primary" text @click="clickCreateItem"
              >New Item</v-btn
            ></v-card-title
          >

          <v-card-text>
            <v-list dense
              ><v-list-item v-for="(item, i) in itemlist" :key="i">
                <v-list-item-content>
                  <v-list-item-title
                    ><v-text-field
                      v-model="itemlist[i].item"
                      :single-line="true"
                      :disabled="itemlist[i].disabledProp"
                      @blur="onClickDeleteCancel(i)"
                    ></v-text-field
                  ></v-list-item-title>
                </v-list-item-content>

                <v-list-item-action style="display: block" class="pt-3">
                  <v-btn icon>
                    <v-icon
                      color="grey lighten-1"
                      @click="onClickEditSave(i)"
                      >{{ itemlist[i].icon }}</v-icon
                    >
                  </v-btn>
                  <v-btn icon>
                    <v-icon
                      color="grey lighten-1"
                      @click="onClickDeleteCancel(i)"
                      >{{ itemlist[i].cancelIcon }}</v-icon
                    >
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
    selectedItem: 0
  }),
  async mounted() {
    await this.fetchShoppinglists();
    this.fetchShoppingItems();
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
    clickSaveItem() {
      this.createItem();
      this.addItem = false;
    },
    clickCancel() {
      this.addList = false;
      this.addItem = false;
    },
    onClickDeleteCancel(i) {
      //Alten content des textfeldes speichern und bei cancel restore
      //handeln was passiert wenn deleted / cancelled wird
      if (this.selectedItem != i) {
        this.setDefaultIcons(this.selectedItem);
        if (i < 0) {
          //kein neues Item gefocused sondern durch blur event getriggert
          this.selectedItem = i;
        } else {
          this.selectedItem = i;
        }
      }

      if (this.itemlist[i].disabledProp == true) {
        //item löschen
        //Methode zum löschen eines Items aufrufen
      } else {
        //cancel methode
        this.setDefaultIcons(i);
      }
    },
    onClickEditSave(i) {
      //Alten content des textfeldes speichern und bei cancel restore
      //überprüfen ob schon ein anderes Textfeld im Bearbeitungsmodus ist
      if (this.selectedItem != i) {
        this.setDefaultIcons(this.selectedItem);
        this.selectedItem = i;
        //TODO: Save methode ausführen für altes item
      }

      if (this.itemlist[i].disabledProp == true) {
        //edit Mode
        this.setEditIcons(i);
      } else {
        //save
        this.setDefaultIcons(i);
        this.editItem(
          this.itemlist[i].item,
          this.itemlist[i].id,
          this.itemlist[i].checked
        );
      }
    },
    setEditIcons(index) {
      //setzt nur icons
      this.itemlist[index].disabledProp = false;
      this.itemlist[index].icon = this.shoppingIcons[1];
      this.itemlist[index].cancelIcon = this.shoppingIcons[3];
    },
    setDefaultIcons(index) {
      //setzt nur icons
      this.itemlist[index].disabledProp = true;
      this.itemlist[index].icon = this.shoppingIcons[0];
      this.itemlist[index].cancelIcon = this.shoppingIcons[2];
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
        const { data } = await this.$http.get("/_/fetchshoppinglists");
        console.log(data);

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
        }
      } catch (error) {
        console.error(error);
      }
    },
    async fetchShoppingItems() {
      console.log("Shoppinglists: " + this.shoppingLists);

      if (this.shoppingLists[this.selectedList].id == -1) {
        //Keine Liste ist ausgewählt
        this.itemlist = [];
        return;
      }
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
        }
      } catch (error) {
        console.error(error);
      }
    },
    async createShoppingslist() {
      //icon hinzufügen
      var icon = 120;
      var name = this.textFieldNewList;
      const { data } = await this.$http.post("/_/createshoppinglist", {
        name,
        icon
      });
      console.log(data);
      this.fetchShoppinglists();
    },

    async createItem() {
      //icon hinzufügen
      var item = "";
      var listid = this.shoppingLists[this.selectedList].id;
      const { data } = await this.$http.post("/_/createShoppingItem", {
        item,
        listid
      });
      console.log(data);
      this.fetchShoppingItems();
    },
    async editItem(newItemName, itemid, checked) {
      //icon hinzufügen
      var item = this.textFieldNewItemName;
      var listid = this.shoppingLists[this.selectedList].id;
      const { data } = await this.$http.post("/_/editShoppingItem", {
        item,
        listid,
        itemid,
        checked
      });
      console.log(data);
      this.fetchShoppingItems();
    }
  }
};
</script>
