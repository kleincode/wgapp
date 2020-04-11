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
        let mainQuery = "SELECT uid, SUM(amount) AS 'amount' FROM finances WHERE hid = ? AND UNIX_TIMESTAMP(created) > UNIX_TIMESTAMP(?) GROUP BY uid";
        if (results.length == 0) {
          //no bill made yet => select all
          const { results:mainResult } = await db.query(mainQuery, [hid, 0]);
          success({message: "Member totals since last bill received.", mainResult, lastBill: 0});
        } else {
          const { results:mainResult } = await db.query(mainQuery, [hid, results[0].lastBill]);
          success({message: "Member totals since last bill received.", mainResult, lastBill: results[0].lastBill});
        }
      } catch(err) {
        error("Error while fetching finances from database", err);
      }
    } else {
      fail("Please join a household to use this feature.");
    }
  }
});