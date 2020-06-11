<template>
  <v-container>
    <v-row class="pb-12">
      <!-- Lists col (desktop only) -->
      <v-col
        v-if="$vuetify.breakpoint.mdAndUp"
        cols="12"
        md="5"
        lg="4"
        offset-lg="1"
        xl="3"
        offset-xl="2"
      >
        <v-card style="height: 100%" :elevation="6">
          <v-card-title>
            {{ $t("shopping.lists") }}
            <v-spacer></v-spacer>
            <edit-shopping-list-dialog
              ref="editDialog"
              v-model="editList"
              @committed="updateRemoteFunction()"
            />
            <v-btn
              icon
              :loading="loading"
              :aria-label="$t('shopping.sync')"
              @click="updateRemoteFunction(true)"
            >
              <v-icon>refresh</v-icon>
            </v-btn>
          </v-card-title>
          <v-list v-if="lists.length > 0">
            <v-list-item-group
              v-model="selectedListId"
              color="primary"
              @change="fetchShoppingItems"
            >
              <v-list-item
                v-for="list in lists"
                :key="list.id"
                :value="list.id"
              >
                <v-list-item-icon>
                  <v-icon>{{ getIcon(list.icon) }}</v-icon> </v-list-item-icon
                ><v-list-item-content
                  ><v-list-item-title v-text="list.name"></v-list-item-title
                ></v-list-item-content>

                <v-list-item-action style="display: block" class="">
                  <v-btn
                    icon
                    dense
                    @click.stop="$refs.editDialog.startEdit(list)"
                  >
                    <v-icon dense>
                      {{ shoppingIcons[0] }}
                    </v-icon>
                  </v-btn>
                  <v-btn icon @click.stop="deleteList(list)">
                    <v-icon dense>
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
            <br />{{ $t("shopping.emptyList") }}
          </div>
        </v-card>
      </v-col>
      <!-- Items col -->
      <v-col
        cols="12"
        md="7"
        lg="6"
        xl="5"
        :class="{ 'pt-0': $vuetify.breakpoint.smAndDown }"
      >
        <v-card
          style="height: 100%"
          :elevation="$vuetify.breakpoint.mdAndUp ? 6 : 0"
        >
          <v-card-title v-if="$vuetify.breakpoint.mdAndUp">
            <v-icon class="mr-2">
              {{ getIcon(selectedListIcon) }}
            </v-icon>
            {{ selectedListName }}
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              :disabled="!selectedList"
              @click="pushItem"
            >
              {{ $t("shopping.newItem") }}
            </v-btn>
          </v-card-title>

          <v-card-text>
            <v-row class="my-1 mr-4" align="center">
              <strong class="mx-4 success--text text--darken-2">
                {{ $t("shopping.completed") }}: {{ completedTasks }}
              </strong>
              <v-divider vertical></v-divider>
              <strong class="mx-4 info--text text--darken-2">
                {{ $t("shopping.remaining") }}: {{ remainingTasks }}
              </strong>
              <v-spacer></v-spacer>
              <v-expand-transition>
                <v-progress-circular
                  v-if="progress > 0"
                  :value="progress"
                  class="mr-2"
                ></v-progress-circular>
              </v-expand-transition>
            </v-row>
            <v-list v-if="displayedItems.length > 0" dense>
              <transition-group name="shopping-items" tag="ul" class="pl-0">
                <v-list-item
                  v-for="(item, i) in displayedItems"
                  :key="item.id || 'sep'"
                >
                  <div
                    v-if="item.insertNewMarker"
                    class="mb-3 pb-3"
                    style="border-bottom: 1px solid rgba(100,100,100,.4); width: 100%;"
                  >
                    <v-list-item-content
                      style="display: contents;"
                      @click="pushItem"
                    >
                      <v-icon
                        left
                        style="flex: none !important; margin: 7px 7px 7px 0;"
                        >add</v-icon
                      >
                      <span
                        class="body-2 grey--text"
                        style="font-size: 16px !important; padding: 12px;"
                        >{{ $t("shopping.newItem") }}</span
                      > </v-list-item-content
                    ><br />
                  </div>
                  <v-list-item-content v-else style="display: contents;">
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
                      :placeholder="$t('shopping.emptyItem')"
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
              <br />{{ $t("shopping.emptyShopping") }}
            </div></v-card-text
          >
          <div class="ma-4">
            <FinishShoppingDialog
              v-model="selectedList"
              :completed-tasks="completedTasks"
              :remaining-tasks="remainingTasks"
            ></FinishShoppingDialog>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <ConfirmDialog
      v-model="confirmDeleteListDialogShown"
      invert-colors
      :title="
        $t('shopping.confirmDeleteListTitle', {
          name: listToBeDeleted && listToBeDeleted.name
        })
      "
      @positive="confirmDeleteList"
      @negative="confirmDeleteListDialogShown = false"
    >
      {{ $t("shopping.confirmDeleteListText") }}
    </ConfirmDialog>
    <v-footer v-if="!$vuetify.breakpoint.mdAndUp" fixed padless>
      <v-toolbar :elevation="6">
        <v-bottom-sheet v-model="mobileSheetOpen">
          <template v-slot:activator="{ on }">
            <v-app-bar-nav-icon color="primary" v-on="on"></v-app-bar-nav-icon>
          </template>
          <v-list style="position: relative;">
            <edit-shopping-list-dialog
              ref="editDialog"
              v-model="editList"
              @committed="updateRemoteFunction()"
            >
              <template #activator="{ on }">
                <v-btn absolute fab top right color="accent" v-on="on">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>
            </edit-shopping-list-dialog>
            <v-subheader>{{ $t("shopping.chooseShoppingList") }}</v-subheader>
            <v-list-item-group
              v-model="selectedListId"
              color="primary"
              mandatory
              @change="fetchShoppingItems"
            >
              <v-list-item
                v-for="list in lists"
                :key="list.id"
                :value="list.id"
              >
                <v-list-item-icon>
                  <v-icon>{{ getIcon(list.icon) }}</v-icon> </v-list-item-icon
                ><v-list-item-content
                  ><v-list-item-title v-text="list.name"></v-list-item-title
                ></v-list-item-content>

                <v-list-item-action style="display: block" class="">
                  <v-btn
                    icon
                    dense
                    @click.stop="$refs.editDialog.startEdit(list)"
                  >
                    <v-icon dense>
                      {{ shoppingIcons[0] }}
                    </v-icon>
                  </v-btn>
                  <v-btn icon @click.stop="deleteList(list)">
                    <v-icon dense>
                      {{ shoppingIcons[2] }}
                    </v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-bottom-sheet>
        <v-toolbar-title>{{ selectedListName }}</v-toolbar-title>
      </v-toolbar>
    </v-footer>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import FinishShoppingDialog from "@/components/dialogs/FinishShoppingDialog.vue";
import EditShoppingListDialog from "@/components/dialogs/EditShoppingListDialog.vue";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog.vue";
import icons from "@/assets/icons.js";
import en_autoItems from "@/assets/en_shoppingitems.js";
import de_autoItems from "@/assets/de_shoppingitems.js";

export default {
  name: "ShoppingList",
  components: {
    FinishShoppingDialog,
    EditShoppingListDialog,
    ConfirmDialog
  },
  data: () => ({
    editList: {
      name: "",
      icon: 0
    },
    shoppingIcons: ["edit", "check", "delete", "cancel"],
    selectedListId: null,
    selectedItem: 0,
    loading: false,
    activeItemIndex: -1,
    updateRemoteFunction: null,
    confirmDeleteListDialogShown: false,
    listToBeDeleted: null,
    mobileSheetOpen: false
  }),

  computed: {
    ...mapState("userSettings", ["locale"]),
    ...mapState("shopping", ["lists", "items"]),
    selectedList() {
      return this.lists.find(el => el.id == this.selectedListId);
    },
    selectedListName() {
      return this.selectedList
        ? this.selectedList.name
        : this.$t("shopping.noListSelected");
    },
    selectedListIcon() {
      return this.selectedList ? this.selectedList.icon : "";
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
      let displayedItems = this.items
        .filter(el => !el.deleted)
        // unchecked items first, secondary sort by item order (ascending)
        .sort((a, b) => a.checked - b.checked || a.order - b.order);
      //Insert "add element" entry to list behind last unchecked entry
      let insertNewIndex = displayedItems.findIndex(el => el.checked);
      displayedItems.splice(
        insertNewIndex < 0 ? displayedItems.length : insertNewIndex,
        0,
        {
          insertNewMarker: true
        }
      );
      return displayedItems;
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
      this.$store.dispatch(
        "showSnackbar",
        this.$t("shopping.syncError", { message: err })
      );
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
        list: this.selectedListId,
        id: this.$uuid.v1()
      };
      await this.$store.dispatch("shopping/pushItem", newItem);
      let lastindex = this.items.length - 1;
      setTimeout(() => this.$refs.combo[lastindex].focus(), 100);
    },

    updateItem(item, index) {
      if (item.deleted) return;
      if (this.$refs.combo[index]) this.$refs.combo[index].blur();
      this.activeItemIndex = -1;
      // wait some time because combobox doesn't update its text value right away (vuetify bug)
      this.$nextTick(() => {
        setTimeout(async () => {
          if (await this.$store.dispatch("shopping/editItem", item)) {
            this.updateRemoteFunction();
          }
        }, 100);
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
      this.listToBeDeleted = list;
      this.confirmDeleteListDialogShown = true;
    },
    async confirmDeleteList() {
      this.confirmDeleteListDialogShown = false;
      this.listToBeDeleted.deleted = true;
      if (
        await this.$store.dispatch(
          "shopping/deleteList",
          this.listToBeDeleted.id
        )
      ) {
        this.listToBeDeleted = null;
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
      if (!this.$vuetify.breakpoint.mdAndUp && !this.selectedListId) {
        if (this.lists && this.lists.length && this.lists[0])
          this.selectedListId = this.lists[0].id;
        else {
          this.mobileSheetOpen = true;
          return;
        }
      }
      await this.$store.dispatch(
        "shopping/loadList",
        this.selectedListId || false
      );
      this.mobileSheetOpen = false;
      //console.log("fetching", this.selectedListId || false);
    },

    updateRemote() {
      const that = this;
      return async load => {
        if (navigator.onLine) {
          if (load) that.loading = true;
          await that.$store.dispatch("shopping/updateRemote");
          await that.fetchShoppingItems();
          if (load) that.loading = false;
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
  transition: transform 0.4s ease-out;
}
.shopping-items-leave-active {
  transition: all 0.2s ease-in;
}
.shopping-items-leave-to {
  opacity: 0;
  transform: translateX(100px);
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
