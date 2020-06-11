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
    async sync({ state, commit }, forceResync) {
      if (!forceResync && state._initialized) return;
      console.log("syncing");
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
      return db.transaction("rw", shoppingLists, shoppingItems, async () => {
        //need to add shoppingItems to transaction bc of reactive item-fetching
        const lastElement = (await shoppingLists.orderBy("order").last()) || {};
        const lastOrder = lastElement.order || 0,
          // order of new element should be around 1/128 behind last element, but no more than 2^32-1 (32-bit int bounds)
          newOrder = Math.min(lastOrder + 33554431, 0xffffffff);
        if (newOrder <= lastOrder) console.warn("Need reordering!"); // TODO
        const listObject = {
          ...list,
          order: newOrder,
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
        return !!updatedRows;
      });
    },
    deleteList({ commit }, id) {
      return db.transaction("rw", shoppingLists, async () => {
        const updatedRows = await shoppingLists.update(id, { deleted: true });
        if (updatedRows) {
          await shoppingLists.update(id, { updated: timestamp() });
        }
        commit("delete_list", id);
        return !!updatedRows;
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
        const lastElement =
          (await shoppingItems
            .orderBy("order")
            .filter(el => el.list == item.list)
            .last()) || {};
        console.log(lastElement);
        const lastOrder = lastElement.order || 0,
          // order of new element should be around 1/128 behind last element, but no more than 2^32-1 (32-bit int bounds)
          newOrder = Math.min(lastOrder + 33554431, 0xffffffff);
        if (newOrder <= lastOrder) console.warn("Need reordering!"); // TODO
        const itemObject = {
          text: item.text,
          checked: item.checked,
          list: item.list,
          id: item.id,
          order: newOrder,
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
        return !!updatedRows;
      });
    },
    deleteItem({ commit }, id) {
      return db.transaction("rw", shoppingItems, async () => {
        const updatedRows = await shoppingItems.update(id, { deleted: true });
        if (updatedRows) {
          await shoppingItems.update(id, { updated: timestamp() });
        }
        commit("delete_item", id);
        return !!updatedRows;
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
            id: el.id,
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
            id: el.id,
            list: el.list,
            updated: el.updated,
            text: el.text,
            checked: !!el.checked,
            deleted: !!el.deleted,
            order: el.order
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
      if (data.success) {
        // Now merge updates locally
        const { lists, items, now } = data;
        await db.transaction(
          "rw",
          shoppingLists,
          shoppingItems,
          appSettings,
          async () => {
            // Delete lists
            let deletedLists = [];
            await shoppingLists.toCollection().modify((value, ref) => {
              if (!lists.find(el => el.id == value.id)) {
                deletedLists.push(value.id);
                delete ref.value;
              }
            });

            // Add and update lists (add order prop)
            await shoppingLists.bulkPut(lists.map(el => ({ ...el, order: 0 })));
            // if full sync, delete all items from this list
            deletedLists.push(lists.filter(el => el.fullSync).map(el => el.id));

            // Delete items from deleted lists
            for (let list of deletedLists) {
              await shoppingItems.where({ list }).delete();
            }

            // Finally, add/update all items
            await shoppingItems.bulkPut(items.map(el => ({ ...el })));

            // Save update time
            await appSettings.put({ key: "shoppingSync", value: now });
          }
        );
      } else throw data.message;
      await dispatch("sync", true);
    }
  },
  getters: {
    // (state, getters, rootState, rootGetters)
  }
};

export default vuexModule;
