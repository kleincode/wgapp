/*  Handler for "/_/delexpense". Purpose: Deleting expense from finances table (used for 'finances' view). */
const Helpers = require("../components/Helpers");

module.exports = ({ db }) => ({
  type: "POST",
  public: false,
  body: {
    id: {
      type: "int",
      unsigned: true,
      required: true,
      message: "Please provide an expense id."
    }
  },
  handler: async ({ body, query, uid }, { success, fail, error }) => {
    try {
      const hid = await Helpers.fetchHouseholdID(db, uid);
      const { results: { affectedRows } } = await db.query("DELETE FROM finances WHERE id = ? AND hid = ?", [body.id, hid]);
      if (affectedRows < 1) {
        fail("You do not have permission to perform this operation.");
      } else {
        success("Entry deleted.");
      }
    } catch (err) {
      error("Error while deleting from database.", err);
    }
  }
});