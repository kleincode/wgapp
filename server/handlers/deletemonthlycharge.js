/*  Handler for "/_/deletemonthlycharge". Purpose: Delete monthly charge in monthlycharge table */
const Helpers = require("../components/Helpers");
module.exports = ({ db }) => ({
    type: "POST",
    public: false,
    body: {
      // monthly charge id in monthly charge table
      id: {
        type: "int",
        unsigned: true,
        required: true,
        message: "Please provide an monthly charge id."
      }
    },
    handler: async ({ body, query, uid }, { success, fail, error }) => {
      try {
        const requestHid = await Helpers.fetchHouseholdID(db, uid);

        try {
          const { results: { affectedRows } } = await db.query(
            "DELETE FROM monthlycharges WHERE id = ? AND hid = ?",
            [body.id, requestHid]
          );
          if (affectedRows == 0) {
            fail("You do not have permissions to perform this operation.", 4);
          } else {
            success("Monthly charge deleted successfully.");
          }
        } catch (err) {
          error("Error while deleting monthly charge in database.", 4, err);
        }
      } catch (err) {
        error("Error while fetching hid from database.", 0, err);
      }
    }
  });