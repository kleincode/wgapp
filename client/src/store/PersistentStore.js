import localforage from "localforage";

const verbose = false;

const localforageService = localforage.createInstance({
  name: "wgapp",
  version: 1.0,
  storeName: "global",
  description: "Stores global app data for offline use."
});

const writeToCache = (state, stateProperties) => {
  stateProperties.forEach(prop => {
    if (prop in state) {
      localforageService
        .setItem(prop, state[prop])
        .catch(err =>
          console.warn("Error while writing " + prop + " to cache", err)
        );
    }
  });
};

const logStateFromCache = async () => {
  await localforageService.iterate((val, key, i) => {
    console.log("#" + i, key + ":", val);
  });
  console.log("read");
};

const vuexPlugin = mutations => store => {
  store.subscribe((mutation, state) => {
    if (
      mutations &&
      Object.prototype.hasOwnProperty.call(mutations, mutation.type)
    ) {
      writeToCache(state, mutations[mutation.type]);
    }
    if (verbose) logStateFromCache();
  });
};

const initStore = async store => {
  let obj = {};
  await localforageService.iterate((val, key) => {
    obj[key] = val;
  });
  await store.commit("load_persistant", obj);
  if (verbose) console.log("store initialized");
};

export { vuexPlugin as PersistantStorePlugin, initStore };
