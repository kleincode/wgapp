import Dexie from "dexie";

let db = new Dexie("LocalAppStore");

db.version(1).stores({
  userSettings: "key"
});
db.version(2).stores({
  userSettings: "key",
  shoppingLists: "&id,order,updated",
  shoppingItems: "&id,order,list,updated"
});
db.version(3).stores({
  userSettings: "key",
  shoppingLists: "&id,order,updated",
  shoppingItems: "&id,order,list,updated",
  appSettings: "key"
});

const timestamp = () => Math.floor(Date.now() / 1000);

const { userSettings, shoppingLists, shoppingItems, appSettings } = db;

export {
  db,
  userSettings,
  shoppingLists,
  shoppingItems,
  appSettings,
  timestamp
};
