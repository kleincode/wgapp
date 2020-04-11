/*  Handler for "/_/fetchfinances". Purpose: Fetching expenses and member totals from finances table (used for 'finances' view). */
const Helpers = require("../components/Helpers");

module.exports = ({ db }) => ({
  type: "POST",
  public: false,
  handler: async ({ body, query, uid }, { success, fail, error }) => {
    const hid = await Helpers.fetchHouseholdID(db, uid);
    if (hid) {
      try {
        const { results } = await db.query("SELECT COUNT(lastBill) as 'c' FROM compensationpayments WHERE hid = ?", [hid]);
        if (results[0].c == 0) {
          await db.query("INSERT INTO compensationpayments (hid, lastBill) VALUES (?, CURRENT_TIMESTAMP)", [hid]);
        } else {
          await db.query("UPDATE compensationpayments SET lastBill = CURRENT_TIMESTAMP WHERE hid = ?", [hid]);
        }
        success("Successfully updated last bill.");
      } catch(err) {
        error("Error while fetching finances from database", err);
      }
    } else {
      fail("Please join a household to use this feature.");
    }
  }
});