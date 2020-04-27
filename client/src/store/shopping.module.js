import axios from "./axios";
import {
  db,
  shoppingLists,
  shoppingItems,
  timestamp,
  appSettings
} from "./LocalAppStore";

const vuexModule = {
  namespaced: true,
  state: () => ({
    _initialized: false,
    lists: [],
    items: []
  }),
  mutations: {
    // (state, arg)
    set_initialized(state, value) {
      state._initialized = value;
    },
    set_lists(state, lists) {
      state.lists = lists;
    },
    set_items(state, items) {
      state.items = items;
    },
    // Use pushList action!
    push_list(state, list) {
      state.lists.push(list);
    },
    // Use editList action!
    edit_list(state, list) {
      const index = state.lists.findIndex(el => el.id == list.id);
      if (index >= 0) state.lists[index] = list;
    },
    // Use deleteList action!
    delete_list(state, id) {
      const index = state.lists.findIndex(el => el.id == id);
      if (index >= 0) state.lists.splice(index, 1);
    },
    // Use pushItem action!
    push_item(state, list) {
      state.items.push(list);
    },
    // Use editItem action!
    edit_item(state, item) {
      const index = state.items.findIndex(el => el.id == item.id);
      if (index >= 0) state.items[index] = item;
    },
    // Use deleteItem action!
    delete_item(state, id) {
      const index = state.items.findIndex(el => el.id == id);
      if (index >= 0) state.items.splice(index, 1);
    }
  },
  actions: {
    // ({ state, commit, dispatch, getters, rootState, rootGetters })
    async sync({ state, commit }) {
      if (state._initialized) return;
      commit(
        "set_lists",
        await shoppingLists
          .orderBy("order")
          .filter(el => !el.deleted)
          .toArray()
      );
      commit("set_initialized", true);
    },
    pushList({ commit }, list) {
      return db.transaction("rw", shoppingLists, async () => {
        const lastElement = (await shoppingLists.orderBy("order").last()) || {};
        const highestOrder = lastElement.order || 0;
        const listObject = {
          ...list,
          order: highestOrder + 1,
          updated: timestamp()
        };
        await shoppingLists.add(listObject);
        commit("push_list", listObject);
      });
    },
    editList({ commit }, list) {
      return db.transaction("rw", shoppingLists, async () => {
        const updatedRows = await shoppingLists.update(list.id, list);
        if (updatedRows) {
          await shoppingLists.update(list.id, { updated: timestamp() });
          commit("edit_list", list);
        }
      });
    },
    saveListOrder({ state }) {
      return db.transaction("rw", shoppingLists, async () => {
        for (let i = 0; i < state.lists.length; i++) {
          const list = state.lists[i];
          await shoppingLists.update(list.id, { order: i + 1 });
          list.order = i + 1;
        }
      });
    },
    deleteList({ commit, dispatch }, id) {
      return db.transaction("rw", shoppingLists, async () => {
        const updatedRows = await shoppingLists.update(id, { deleted: true });
        if (updatedRows) {
          await shoppingLists.update(id, { updated: timestamp() });
        }
        commit("delete_list", id);
        await dispatch("saveListOrder");
      });
    },
    async loadList({ commit }, listId) {
      commit(
        "set_items",
        listId
          ? (
              await shoppingItems.where({ list: listId }).sortBy("order")
            ).filter(el => !el.deleted)
          : []
      );
    },
    pushItem({ commit }, item) {
      return db.transaction("rw", shoppingItems, async () => {
        const lastElement = (await shoppingItems.orderBy("order").last()) || {};
        const highestOrder = lastElement.order || 0;
        const itemObject = {
          text: item.text,
          checked: item.checked,
          list: item.list,
          id: item.id,
          order: highestOrder + 1,
          updated: timestamp()
        };
        await shoppingItems.add(itemObject);
        commit("push_item", itemObject);
      });
    },
    editItem({ commit }, item) {
      console.log("edit", item.text);
      return db.transaction("rw", shoppingItems, async () => {
        const updatedRows = await shoppingItems.update(item.id, item);
        if (updatedRows) {
          await shoppingItems.update(item.id, { updated: timestamp() });
          commit("edit_item", item);
        }
      });
    },
    saveItemOrder({ state }) {
      return db.transaction("rw", shoppingItems, async () => {
        for (let i = 0; i < state.items.length; i++) {
          const item = state.items[i];
          await shoppingItems.update(item.id, { order: i + 1 });
          item.order = i + 1;
        }
      });
    },
    deleteItem({ commit, dispatch }, id) {
      return db.transaction("rw", shoppingItems, async () => {
        const updatedRows = await shoppingItems.update(id, { deleted: true });
        if (updatedRows) {
          await shoppingItems.update(id, { updated: timestamp() });
        }
        commit("delete_item", id);
        await dispatch("saveItemOrder");
      });
    },
    collectLocalUpdates() {
      return db.transaction(
        "r",
        shoppingItems,
        shoppingLists,
        appSettings,
        async () => {
          // Fetch last update timestamp
          const shoppingSync = await appSettings.get("shoppingSync"),
            lastUpdate =
              shoppingSync && typeof shoppingSync.value === "number"
                ? shoppingSync.value
                : 0;
          // Fetch all lists locally updated since then
          const lists = (
            await shoppingLists
              .where("updated")
              .above(lastUpdate)
              .toArray()
          ).map(el => ({
            updated: el.updated,
            name: el.name,
            icon: el.icon,
            deleted: !!el.deleted
          }));
          // Fetch all items locally updated since then
          const items = (
            await shoppingItems
              .where("updated")
              .above(lastUpdate)
              .toArray()
          ).map(el => ({
            updated: el.updated,
            text: el.text,
            checked: !!el.checked,
            deleted: !!el.deleted
          }));
          return { lastUpdate, lists, items };
        }
      );
    },
    async updateRemote({ dispatch }) {
      const localUpdates = await dispatch("collectLocalUpdates");
      console.log(localUpdates);
      const { data } = await axios.post("/_/syncshopping", localUpdates);
      console.log(data);
    }
  },
  getters: {
    // (state, getters, rootState, rootGetters)
  }
};

export default vuexModule;
