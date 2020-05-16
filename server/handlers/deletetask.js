/*  Handler for "/_/deletetask". Purpose: Delete task in tasks table (used in 'edit task' view). */
const Helpers = require("../components/Helpers");

module.exports = ({ db }) => ({
  type: "POST",
  public: false,
  body: {
    // task id in tasks table
    id: {
      type: "int",
      unsigned: true,
      required: true,
      message: "Please provide an task id."
    }
  },
  handler: async ({ body, query, uid }, { success, fail, error }) => {
    try {
      const hid = await Helpers.fetchHouseholdID(db, uid);
      try {
        await db.query(
          "DELETE FROM tasks WHERE id = ? AND hid = ?",
          [body.id, hid]
        );
        success("Task updated successfully.");
      } catch (err) {
        error("Error while deleting task in database.", 3, err);
      }

    } catch (err) {
      error("Error while fetching specified user from database.", 0, err);
    }
  }
});