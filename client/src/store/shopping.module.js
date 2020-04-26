import { db, shoppingLists, shoppingItems, timestamp } from "./LocalAppStore";

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
    }
  },
  actions: {
    // ({ state, commit, dispatch, getters, rootState, rootGetters })
    async sync({ state, commit }) {
      if (state._initialized) return;
      commit("set_lists", await shoppingLists.orderBy("order").toArray());
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
        const updatedRows = await shoppingLists.update(list.id, {
          list,
          updated: timestamp()
        });
        if (updatedRows) commit("edit_list", list);
      });
    },
    saveOrder({ state }) {
      return db.transaction("rw", shoppingLists, async () => {
        for (let i = 0; i < state.lists.length; i++) {
          const list = state.lists[i];
          await shoppingLists.update(list.id, { order: i + 1 });
          list.order = i + 1;
        }
      });
    },
    async deleteList({ commit, dispatch }, id) {
      return db.transaction("rw", shoppingLists, async () => {
        await shoppingLists.delete(id);
        commit("delete_list", id);
        await dispatch("saveOrder");
      });
    },
    async loadList({ commit }, listId) {
      commit(
        "set_items",
        listId
          ? await shoppingItems.where({ list: listId }).sortBy("order")
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
    }
  },
  getters: {
    // (state, getters, rootState, rootGetters)
  }
};

export default vuexModule;
