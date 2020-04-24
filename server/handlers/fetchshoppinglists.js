/*  Handler for "/_/fetchshoppingslists". Purpose: Fetching Shoppinglists */
const Helpers = require("../components/Helpers");

module.exports = ({ db }) => ({
    type: "GET",
    public: false,
    params: {
      
    },
    handler: async ({ body, query, uid }, { success, fail, error }) => {
      const requestHid = await Helpers.fetchHouseholdID(db, uid);

      let baseQuery = `SELECT id, name, icon FROM shoppinglists WHERE hid = ?`,
        baseParams = [requestHid];
      try {
        const { results } = await db.query(baseQuery, baseParams);
        if (results.length == 0) {

          success({ message: "Results.", data: [] });
          
        } else success({ message: "Shoppinglist received", data: results });
      } catch (err) {
        error("Error while fetching Shoppinglists from database.");
      }
      
    }
  });