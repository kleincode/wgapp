/*  Handler for "/_/pushtaskaction". Purpose: Add new task action to db and delete oldest. */
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
    time: {
      type: "string",
      required: true,
      message: "Please provide a time."
    },
    name: {
      type: "string",
      required: true,
      message: "Please specify a task name"
    },
    assignedMember: {
      type: "int",
      required: true,
      message: "Please specify the new assigned Member"
    },
    icon: {
      type: "int",
      default: 0
    },
    done: {
      type: "boolean"
    }
  },
  handler: async ({ body, query, uid }, { success, fail, error }) => {
    try {
      const hid = await Helpers.fetchHouseholdID(db, uid);
      if (body.done) {
        const { results } = await db.query("SELECT id FROM tasklog WHERE hid = ? ORDER BY time DESC LIMIT 9, 1", [hid]);
        if (results.length > 0) {
          await db.query("UPDATE tasklog SET taskid = ?, time = ?, assignedMember = ?, name = ?, icon = ?, hid = ? WHERE id = ?", 
          [body.id, new Date(body.time), body.assignedMember, body.name, body.icon, hid, results[0].id]);
        } else {
          await db.query("INSERT INTO tasklog (taskid, time, assignedMember, name, icon, hid) VALUES (?, ?, ?, ?, ?, ?)", 
          [body.id, new Date(body.time), body.assignedMember, body.name, body.icon, hid]);
        }
        success({ message: "Task log added"});
      } else {
        try {
        const { results } = await db.query("SELECT id FROM tasklog WHERE hid = ? AND taskid = ? ORDER BY time DESC", [hid, body.id]);
        if (results.length == 0) {
          fail({message: "Unexpected state. Can't undo task bc it is not in db."});
        } else {
          await db.query('DELETE FROM tasklog WHERE id = ? AND hid = ?', [results[0].id, hid]);
          success({ message: "Task log removed"});
        }
        } catch (err) {
          error("Error while deleting task in tasklog.", err);
        }
      }
    } catch (err) {
      error("Error while inserting new task in tasklog.", err);
    }
  }
});