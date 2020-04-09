/*  Handler for "/_/editexpense". Purpose: Updating expense in finances table (used for 'finances' view). */
const Helpers = require("../components/Helpers");

module.exports = ({ db }) => ({
  type: "POST",
  public: false,
  body: {
    // Expense id in finances table
    id: {
      type: "int",
      unsigned: true,
      required: true,
      message: "Please provide an expense id."
    },
    // New expense description (not updated if not provided)
    description: {
      type: "string"
    },
    // New amount (not updated if not provided)
    amount: {
      type: "int"
    }
  },
  handler: async ({ body, query, uid }, { success, fail, error }) => {
    let updateVals = Helpers.copyKeysIfPresent(body, ["description", "amount"]);

    if (Helpers.isObjectEmpty(updateVals)) {
      success("No changes made.");
    } else try {
      const hid = await Helpers.fetchHouseholdID(db, uid);
      const { results: { affectedRows, changedRows } } = await db.query(
        "UPDATE finances SET ? WHERE id = ? AND hid = ?",
        [updateVals, body.id, hid]
      );

      if (affectedRows < 1) {
        fail("You don't have permission to change this entry.");
      } else if (changedRows < 1) {
        success("No changes made.");
      } else {
        success("Entry deleted.");
      }
    } catch (err) {
      error("Error while deleting from database.", err);
    }
  }
});