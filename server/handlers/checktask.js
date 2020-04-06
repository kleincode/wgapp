/*  Handler for "/_/checktask". Purpose: Setting task to checked (used for 'tasks' view). */
module.exports = ({ db }) => ({
  type: "POST",
  public: false,
  body: {
    id: {
      type: "int",
      required: true,
      message: "Please provide a task id."
    },
    lastExecution: {
      type: "string",
      required: true,
      message: "Please specify the lastExecution"
    },
    assignedMember: {
      type: "int",
      required: true,
      message: "Please specify the new assigned Member"
    }
  },
  handler: async ({ body, query, user }, { success, fail, error }) => {
    try {
      const { results } = await db.query("SELECT COUNT(*) AS 'c' FROM tasks WHERE id = ? AND hid = ?", [body.id, user.hid]);
      let date = new Date(body.lastExecution);
      if (results[0].c < 1) {
        fail("The specified task does not exist.");
      } else try {
        await db.query("UPDATE tasks SET lastExecution = ?, assignedMember = ? WHERE id = ?", [date, body.assignedMember, body.id]);
        success("Update successful.");
      } catch (err) {
        error("Error while updating task in database.", err);
      }
    } catch (err) {
      error("Error while fetching specified task from database.", err);
    }
  }
});