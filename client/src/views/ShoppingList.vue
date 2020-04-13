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
            <v-list-item-group v-model="selectedList" color="primary">
              <v-list-item
                @click="selectList(list)"
                v-for="(list, i) in shoppingLists"
                :key="i"
                ><v-list-item-icon>
                  <v-icon v-text="list.icon"></v-icon> </v-list-item-icon
                ><v-list-item-content
                  ><v-list-item-title
                    v-text="list.name"
                  ></v-list-item-title></v-list-item-content
              ></v-list-item>
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

          <v-data-table
            :headers="headers"
            :items="itemlist"
            item-key="item"
            show-select
          >
            <template v-slot:top> </template>
          </v-data-table>
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

    <v-dialog v-model="addItem" max-width="550px" overlay-opacity="1">
      <v-card>
        <v-card-title>
          Add Item to Shoppinglist
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="textFieldNewItemName"
            required
            class="my-3 mx-3"
            hint="What do you want to buy?"
            placeholder="Beer & other Drugs"
            clearable
          >
          </v-text-field>
          <v-text-field
            v-model="textFieldNewItemAmount"
            required
            class="my-3 mx-3"
            hint="How much?"
            placeholder="Beer & other Drugs"
            clearable
          >
          </v-text-field>
        </v-card-text>

        <v-card-actions>
          <!--spacer sorgt dafür dass buttons rechts sind-->
          <v-spacer></v-spacer>
          <v-btn outlined @click="clickSaveItem">Save</v-btn>
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
    addList: false,
    addItem: false,
    textFieldNewList: "",
    textFieldNewItemName: "",
    textFieldNewItemAmount: 0,
    selected: [],
    headers: [
      {
        text: "Item",
        align: "start",
        sortable: false,
        value: "item"
      },
      { text: "Amount", value: "amount" }
    ],
    itemlist: [
      { item: "Milch", amount: "6L" },
      { item: "Brot", amount: "ne Scheibe" },
      { item: "was anderes", amount: "kein plan" }
    ],
    shoppingLists: [{ name: "", icon: "", id: -1 }],
    selectedList: 0
  }),
  mounted() {
    this.fetchShoppinglists();
    this.fetchShoppingItems();
  },

  methods: {
    clickCreateList() {
      //Methodencode
      this.addList = true;
    },
    clickCreateItem() {
      //Methodencode
      this.createItem();
      this.addItem = true;
    },
    clickSaveList() {
      //Speichern über MySQL interface
      this.createShoppingslist();
      this.addList = false;
    },
    clickSaveItem() {
      this.createItem();
      this.addList = false;
    },
    clickCancel() {
      this.addList = false;
      this.addItem = false;
    },
    selectList(list) {
      //Methode fetchShoppingList aufrufen um daten abzurufen aus mysql
      this.fetchShoppinglists();
      this.fetchShoppingItems();
      list;
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
              id: list.id
            });
          });
        }
      } catch (error) {
        console.error(error);
      }
    },
    async fetchShoppingItems() {
      var listid = this.shoppingLists[this.selectedList].id;
      if (!listid >= 0) {
        //Keine Liste ist ausgewählt
        this.itemlist = [];
        return;
      }

      try {
        console.log("ID: " + listid);
        const { data } = await this.$http.get("/_/fetchshoppinglistitems", {
          //TODO Listid
          listid
        });
        console.log(data);

        if (data.success) {
          this.itemlist = [];

          data.data.forEach(list => {
            this.itemlist.push({
              itemName: list.item,
              amount: list.amount,
              checked: list.checked,
              listid: this.shoppingLists[this.selectedList].id
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
      var amount = this.textFieldNewItemAmount;
      var item = this.textFieldNewItemName;
      var listid = this.shoppingLists[this.selectedList].id;
      const { data } = await this.$http.post("/_/createShoppingItem", {
        item,
        amount,
        listid
      });
      console.log(data);
      this.fetchShoppingItems();
    }
  }
};
</script>
