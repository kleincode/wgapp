/*  Handler for "/_/fetchfinances". Purpose: Fetching expenses and member totals from finances table (used for 'finances' view). */
const Helpers = require("../components/Helpers");

module.exports = ({ db }) => ({
  type: "GET",
  public: false,
  handler: async ({ body, query, uid }, { success, fail, error }) => {
    const hid = await Helpers.fetchHouseholdID(db, uid);
    if (hid) {
      try {
        const { results } = await db.query("SELECT lastBill FROM lastbill WHERE hid = ?", [hid]);
        let mainQuery = "SELECT uid, SUM(amount) AS 'amount' FROM finances WHERE hid = ? AND UNIX_TIMESTAMP(created) > UNIX_TIMESTAMP(?) GROUP BY uid";
        const { results:monthlyResult } = await db.query("SELECT uid, amount FROM monthlycharges WHERE hid = ?", [hid]);
        if (results.length == 0) {
          //no bill made yet => select all
          const { results:mainResult } = await db.query(mainQuery, [hid, 0]);
          success({message: "Member totals all time.", mainResult, lastBill: 0, monthlyResult});
        } else {
          const { results:mainResult } = await db.query(mainQuery, [hid, results[0].lastBill]);
          success({message: "Member totals since last bill received.", mainResult, lastBill: results[0].lastBill, monthlyResult});
        }
      } catch(err) {
        error("Error while fetching new bill from database", 4, err);
      }
    } else {
      fail("Please join a household to use this feature.");
    }
  }
});