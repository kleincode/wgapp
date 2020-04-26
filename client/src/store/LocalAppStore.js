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

const timestamp = () => Math.floor(Date.now() / 1000);

const { userSettings, shoppingLists, shoppingItems } = db;

export { db, userSettings, shoppingLists, shoppingItems, timestamp };
