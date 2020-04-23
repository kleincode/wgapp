/*  Handler for "/_/deletemonthlycharge". Purpose: Delete monthly charge in monthlycharge table */
const Helpers = require("../components/Helpers");
module.exports = ({ db }) => ({
    type: "POST",
    public: false,
    body: {
      id: {
        type: "int",
        unsigned: true,
        required: true,
        message: "Please provide a list id"
      }
    },
    handler: async ({ body, query, uid }, { success, fail, error }) => {
      try {
        const requestHid = await Helpers.fetchHouseholdID(db, uid);

        try {
          const { results: { affectedRows } } = await db.query(
            "DELETE FROM shoppinglists WHERE id = ? AND hid = ?",
            [body.id, requestHid]
          );
          const { results: { affectedRows2 } } = await db.query(
            "DELETE FROM shoppingitems WHERE listid = ? AND hid = ?",
            [body.id, requestHid]
          );
          if (affectedRows == 0) {
            fail("You do not have permission to perform this operation.");
          } else {
            if (isNaN(affectedRows2)) {
                success("Deleted shopping list with 0 entries successfully.");
            } else {
                success("Deleted shopping list with " + affectedRows2 + " entries successfully.");
            }
          }
        } catch (err) {
          error("Error while deleting shopping list in database.", err);
        }
      } catch (err) {
        error("Error while fetching hid from database.", err);
      }
    }
  });