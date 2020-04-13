/*  Handler for "/_/fetchshoppinglistitems". Purpose: Fetching Shoppinglistitems */

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
    handler: async ({ body, query, user }, { success, fail, error }) => {

      //Default wert zuweisen
      let {listid} = params;

      if (user.hid) {
        const { id } = query;
        let baseQuery = `SELECT item, amount, checked FROM shoppingitems WHERE hid = ? AND listid = ?`,
          baseParams = [user.hid, params.listid];
        try {
          const { results } = await db.query(baseQuery, baseParams);
          if (results.length == 0) {
            if (id) {
              fail({ message: "Shoppinglist empty or non-existent.", data: {} });
            } else {
              success({ message: "Empty.", data: {} });
            }
          } else success({ message: "Shoppinglistitem(s) received", data: results });
        } catch (err) {
          error("Error while fetching Shoppinglistitems from database.");
        }
      } else {
        fail("Please join a household to use this feature.");
      }
    }
  });