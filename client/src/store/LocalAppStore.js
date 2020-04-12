import Dexie from "dexie";

let db = new Dexie("LocalAppStore");

db.version(1).stores({
  userSettings: "key"
});

let userSettings = db.userSettings;

export { userSettings };
