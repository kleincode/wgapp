import { db, shoppingLists } from "./LocalAppStore";

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
    }
  },
  actions: {
    // ({ state, commit, dispatch, getters, rootState, rootGetters })
    async sync({ state, commit }) {
      if (state._initialized) return;
      commit("set_lists", await shoppingLists.orderBy("order").toArray());
      commit("set_initialized", true);
    },
    async pushList({ commit }, list) {
      await db.transaction("rw", shoppingLists, async () => {
        const highestOrder = (await shoppingLists.orderBy("order").last()) || 0;
        const listObject = { ...list, order: highestOrder + 1 };
        await shoppingLists.add(listObject);
        commit("push_list", listObject);
      });
    },
    async editList({ commit }, list) {
      await db.transaction("rw", shoppingLists, async () => {
        const updatedRows = await shoppingLists.update(list.id, list);
        if (updatedRows) commit("edit_list", list);
      });
    }
  },
  getters: {
    // (state, getters, rootState, rootGetters)
  }
};

export default vuexModule;
