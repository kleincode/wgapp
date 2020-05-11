/*  Handler for "/_/fetchfinances". Purpose: Fetching expenses and member totals from finances table (used for 'finances' view). */
const Helpers = require("../components/Helpers");

module.exports = ({ db }) => ({
  type: "GET",
  public: false,
  handler: async ({ body, query, uid }, { success, fail, error }) => {
    const hid = await Helpers.fetchHouseholdID(db, uid);
    if (hid) {
      try {
        const { results } = await db.query("SELECT id, min, max, data FROM billhistory WHERE hid = ?", [hid]);
        results.forEach((elem) => {
          elem.data = JSON.parse(elem.data);
        });
        success({message: "Received bill history.", results});
      } catch(err) {
        error("Error while fetching bill history from database", 4, err);
      }
    } else {
      fail("Please join a household to use this feature.",0);
    }
  }
});