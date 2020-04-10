module.exports = {
  copyKeysIfPresent: (from, keys) => {
    let filteredKeys = keys.filter((key) => key in from),
      obj = {};
    filteredKeys.forEach(key => obj[key] = from[key]);
    return obj;
  },
  isObjectEmpty: (arr) => Object.keys(arr).length === 0,
  fetchHouseholdID: async (db, uid) => {
    const { results } = await db.query("SELECT hid FROM users WHERE ?", [{id: uid}]);
    if(results.length == 0) return null;
    else return results[0].hid;
  }
};