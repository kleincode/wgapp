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
        type: "boolean",
        default: true
    }
  },
  handler: async ({ body, query, uid }, { success, fail, error }) => {
    try {
      const hid = await Helpers.fetchHouseholdID(db, uid);
      if (body.done) {
        await db.query("INSERT INTO tasklog (id, time, assignedMember, name, icon, hid) VALUES (?, ?, ?, ?, ?, ?)", [body.id, new Date(body.time), body.assignedMember, body.name, body.icon, hid]);
        await db.query('DELETE FROM tasklog WHERE id IN (SELECT id FROM tasklog WHERE hid = ? ORDER BY date DESC LIMIT 10, 100)', [hid])
      } else {
        await db.query('DELETE FROM tasklog WHERE id = ? AND hid = ?', [body.id, hid]);
      }
      success({ message: "Task log added"});
    } catch (err) {
      error("Error while inserting new task in tasklog.", err);
    }
  }
});