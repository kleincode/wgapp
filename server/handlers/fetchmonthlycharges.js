/*  Handler for "/_/fetchmonthlycharges". Purpose: Send monthlycharges to client. */
const Helpers = require("../components/Helpers");
module.exports = ({ db }) => ({
    type: "GET",
    public: false,
    handler: async ({ body, query, uid }, { success, fail, error }) => {
      const requestHid = await Helpers.fetchHouseholdID(db, uid);
      if (requestHid) {
        let baseQuery = `SELECT id, uid, name, amount, icon FROM monthlycharges WHERE hid = ?`,
          baseParams = [requestHid];
        try {
          const { results } = await db.query(baseQuery, baseParams);
          if (results.length == 0) {
            success({ message: "Empty.", data: [] });
          } else success({ message: "monthly charges received", data: results });
        } catch (err) {
          error("Error while fetching monthly charges from database.", 4, err);
        }
      } else {
        fail("Please join a household to use this feature.");
      }
    }
  });