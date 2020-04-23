/*  Handler for "/_/fetchshoppinglistitems". Purpose: Fetching Shoppinglistitems */
const Helpers = require("../components/Helpers");

module.exports = ({ db }) => ({
    type: "GET",
    public: false,
    params: {
      listid: {
        type: "int",
        required: true,
        message: "Please provide a listid."
      }
    },
    handler: async ({ body, query, uid }, { success, fail, error }) => {

      const { listid } = query;
      //Default wert zuweisen
      const requestHid = await Helpers.fetchHouseholdID(db, uid);

      let baseQuery = `SELECT item, id, checked FROM shoppingitems WHERE hid = ? AND listid = ?`,
      baseParams = [requestHid, listid];

      try {
        const { results } = await db.query(baseQuery, baseParams);
        if (results.length == 0) {

          success({ message: "Results.", data: [] });
          
        } else success({ message: "Shoppinglistitems received", data: results });
      } catch (err) {
        error("Error while fetching Shoppinglistitems from database.");
      }
    }
  });