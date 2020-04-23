/*  Handler for "/_/deleteshoppingitem". Purpose: Delete monthly charge in monthlycharge table */
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
          "DELETE FROM shoppingitems WHERE id = ? AND hid = ?",
          [body.id, requestHid]
        );
        if (affectedRows == 0) {
          fail("You do not have permission to perform this operation.");
        } else {
          success("Deleted shopping item successfully.");
        }
      } catch (err) {
        error("Error while deleting shopping item in database.", err);
      }
    } catch (err) {
      error("Error while fetching hid from database.", err);
    }
  }
});