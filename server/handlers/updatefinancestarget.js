/*  Handler for "/_/fetchfinancestarget". Purpose: Fetching targeted monthly total. */
const Helpers = require("../components/Helpers");
module.exports = ({ db }) => ({
  type: "POST",
  public: false, 
  body: {
    amount: {
      type: "int",
      required: true
    }
  },
  handler: async ({ body, query, uid }, { success, fail, error }) => {
    const hid = await Helpers.fetchHouseholdID(db, uid);
    if (hid) {
      try {
        let { results } = await db.query("UPDATE financestarget SET amount = ? WHERE hid = ?", [body.amount, hid]);
        success({message: "Updated financestarget.", results});
      } catch(err) {
        error("Error while updating finances target from database", 4, err);
      }
    } else {
      fail("Please join a household to use this feature.");
    }
  }
});