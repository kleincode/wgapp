<template>
  <v-container fluid>
    <h1 class="display-2 pb-6">Shopping List</h1>
    <v-row class="ml-4" cols="12">
      <v-col>
        <v-list>
          <v-subheader>Einkaufslisten</v-subheader>
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
      </v-col>

      <v-col>
        <v-card>
          <v-card-title
            >{{ shoppingLists[selectedList].name }} <v-spacer></v-spacer
            ><v-btn color="primary" text @click="clickCreate"
              >Neue Einkaufsliste</v-btn
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
      <v-card-title>
        Create a new Shoppinglist
      </v-card-title>

      <v-dialog-text>
        <v-text-field
          required
          class="my-3 mx-3"
          hint="Enter a name"
          placeholder="Beer & other Drugs"
          clearable="true"
        >
        </v-text-field>
      </v-dialog-text>

      <v-card-actions>
        <!--spacer sorgt dafür dass buttons rechts sind-->
        <v-spacer></v-spacer>
        <v-btn outlined @click="clickSave">Save</v-btn>
        <v-btn outlined @click="clickCancel">Cancel</v-btn>
      </v-card-actions>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: "Shopping List",
  data: () => ({
    //Variablen einfügen
    addList: false,
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
    shoppingLists: [
      { name: "Hamstern", icon: "build" },
      { name: "OmaEinkauf", icon: "search" },
      { name: "Pantoffeln", icon: "shopping_cart" }
    ],
    selectedList: 0
  }),
  methods: {
    clickCreate() {
      //Methodencode
      this.addList = true;
    },
    clickSave() {
      //Speichern über MySQL interface
      this.addList = false;
    },
    clickCancel() {
      this.addList = false;
    },
    selectList(list) {
      //Methode fetchShoppingList aufrufen um daten abzurufen aus mysql
      list;
    }
  }
};
</script>
