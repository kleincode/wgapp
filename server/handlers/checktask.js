/*  Handler for "/_/checktask". Purpose: Setting task to checked (used for 'tasks' view). */
module.exports = ({ db }) => ({
  type: "POST",
  public: false,
  body: {
    id: {
      type: "int",
      required: true,
      message: "Please provide a task id."
    }
  },
  handler: async ({ body, query, user }, { success, fail, error }) => {
    try {
      const { results } = await db.query("SELECT COUNT(*) AS 'c' FROM tasks WHERE id = ? AND hid = ?", [body.id, user.hid]);

      if (results[0].c < 1) {
        fail("The specified task does not exist.");
      } else try {
        await db.query("UPDATE tasks SET lastExecution = ? WHERE id = ?", [new Date(), body.id]);
        success("Update successful.");
      } catch (err) {
        error("Error while updating task in database.", err);
      }
    } catch (err) {
      error("Error while fetching specified task from database.", err);
    }
  }
});