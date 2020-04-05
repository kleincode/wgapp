module.exports = {
  copyKeysIfPresent: (from, keys) => {
    let filteredKeys = keys.filter((key) => key in from),
      obj = {};
    filteredKeys.forEach(key => obj[key] = from[key]);
    return obj;
  },
  isObjectEmpty: (arr) => Object.keys(arr).length === 0
};