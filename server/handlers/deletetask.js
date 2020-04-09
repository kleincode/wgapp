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
      const hid = Helpers.fetchHouseholdID(db, uid);
      const { results } = await db.query("SELECT COUNT(*) AS 'c' FROM users WHERE id = ? AND hid = ?", [uid, hid]);
      if (results[0].c < 1) {
        fail("You do not have permission to perform this operation.");
        return;
      }

      //Permissions granted; perform update
      try {
        await db.query(
          "DELETE FROM tasks WHERE id = ?",
          [body.id]
        );
        success("Task updated successfully.");
      } catch (err) {
        error("Error while deleting task in database.", err);
      }

    } catch (err) {
      error("Error while fetching specified user from database.", err);
    }
  }
});