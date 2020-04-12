/*  Handler for "/_/fetchfinances". Purpose: Fetching expenses and member totals from finances table (used for 'finances' view). */
const Helpers = require("../components/Helpers");

module.exports = ({ db }) => ({
  type: "GET",
  public: false,
  handler: async ({ body, query, uid }, { success, fail, error }) => {
    const hid = await Helpers.fetchHouseholdID(db, uid);
    if (hid) {
      try {
        const { results } = await db.query("SELECT lastBill FROM compensationpayments WHERE hid = ?", [hid]);
        success({message: "Received last result.", results});
      } catch(err) {
        error("Error while fetching finances from database", err);
      }
    } else {
      fail("Please join a household to use this feature.");
    }
  }
});