/*  Handler for "/_/fetchfinancestarget". Purpose: Fetching targeted monthly total. */
const Helpers = require("../components/Helpers");

module.exports = ({ db }) => ({
  type: "GET",
  public: false,
  handler: async ({ body, query, uid }, { success, fail, error }) => {
    const hid = await Helpers.fetchHouseholdID(db, uid);
    if (hid) {
      try {
        let { results } = await db.query("SELECT amount FROM financestarget WHERE hid = ?", [hid]);
        if (results[0] == undefined) {
          await db.query("INSERT INTO financestarget (hid, amount) VALUES (?, ?)", [hid, 50000]);
          results = [{amount: 50000}];
          success({message: "Received financestarget.", results});
        } else {
          success({message: "Received financestarget.", results});
        }
      } catch(err) {
        error("Error while fetching finances target from database", 4, err);
      }
    } else {
      fail("Please join a household to use this feature.", 0);
    }
  }
});