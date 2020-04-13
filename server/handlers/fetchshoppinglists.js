/*  Handler for "/_/fetchshoppingslists". Purpose: Fetching Shoppinglists */

module.exports = ({ db }) => ({
    type: "GET",
    public: false,
    params: {
      
    },
    handler: async ({ body, query, user }, { success, fail, error }) => {
      if (user.hid) {
        const { id } = query;
        let baseQuery = `SELECT id, name FROM shoppinglists WHERE hid = ?`,
          baseParams = [user.hid];
        try {
          const { results } = await db.query(baseQuery, baseParams);
          if (results.length == 0) {
            if (id) {
              fail({ message: "Shoppinglist not found.", data: {} });
            } else {
              success({ message: "Empty.", data: {} });
            }
          } else success({ message: "Shoppinglist received", data: results });
        } catch (err) {
          error("Error while fetching Shoppinglists from database.");
        }
      } else {
        fail("Please join a household to use this feature.");
      }
    }
  });