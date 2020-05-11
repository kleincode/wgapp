/*  Handler for "/_/checktask". Purpose: Setting task to checked (used for 'tasks' view). */
const Helpers = require("../components/Helpers");

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
    },
    due: {
      type: "string",
    }
  },
  handler: async ({ body, query, uid }, { success, fail, error }) => {
    try {
      const hid = await Helpers.fetchHouseholdID(db, uid);
      const { results } = await db.query("SELECT COUNT(*) AS 'c' FROM tasks WHERE id = ? AND hid = ?", [body.id, hid]);
      let date = new Date(body.lastExecution);
      if (results[0].c < 1) {
        fail("You do not have permission to perform this operation.", 3);
      } else try {
        await db.query("UPDATE tasks SET lastExecution = ?, assignedMember = ?, due = ? WHERE id = ?", [date, body.assignedMember, body.due, body.id]);
        success("Update successful.");
      } catch (err) {
        error("Error while updating task in database.", 3, err);
      }
    } catch (err) {
      error("Error while fetching specified task from database.", 0, err);
    }
  }
});