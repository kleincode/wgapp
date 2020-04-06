/*  Handler for "/_/deletetask". Purpose: Delete task in tasks table (used in 'edit task' view). */
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
  handler: async ({ body, query, user }, { success, fail, error }) => {
    try {
      const { results } = await db.query("SELECT COUNT(*) AS 'c' FROM users WHERE id = ? AND hid = ?", [user.uid, user.hid]);
      if (results[0].c < 1) {
        fail("You don't have permission to delete tasks for this household.");
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