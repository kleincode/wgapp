/*  Handler for "/_/fetchfinances". Purpose: Fetching expenses and member totals from finances table (used for 'finances' view). */
const Helpers = require("../components/Helpers");

module.exports = ({ db }) => ({
  type: "POST",
  public: false,
  body: {
    min: {
      type: "int",
      required: true,
      message: "A minimum timestamp must be given."
    },
    max: {
      type: "int",
      required: true,
      message: "A maximum timestamp must be given."
    },
    data: {
      type: "object",
      required: true,
      message: "JSON data must be given."
    }
  },
  handler: async ({ body, query, uid }, { success, fail, error }) => {
    const hid = await Helpers.fetchHouseholdID(db, uid);
    if (hid) {
      try {
        await db.query("INSERT INTO billhistory (hid, min, max, data) VALUES (?, ?, ?, ?)", [hid, new Date(body.min).toISOString(), new Date(body.max).toISOString(), JSON.stringify(body.data)]);
        const { results:results2 } = await db.query("SELECT COUNT(lastBill) as 'c' FROM lastbill WHERE hid = ?", [hid]);
        if (results2[0].c == 0) {
          await db.query("INSERT INTO lastbill (hid, lastBill) VALUES (?, CURRENT_TIMESTAMP)", [hid]);
        } else {
          await db.query("UPDATE lastbill SET lastBill = CURRENT_TIMESTAMP WHERE hid = ?", [hid]);
        }
        success("Successfully updated last bill.");
      } catch(err) {
        error("Error while updating bill history in database", err);
      }
    } else {
      fail("Please join a household to use this feature.");
    }
  }
});