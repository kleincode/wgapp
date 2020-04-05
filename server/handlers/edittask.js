/*  Handler for "/_/edittask". Purpose: Updating task in tasks table (used for 'edit task' view). */
const Helpers = require("../components/Helpers");

module.exports = ({ db }) => ({
  type: "POST",
  body: {
    // Expense id in finances table
    id: {
      type: "int",
      unsigned: true,
      required: true,
      message: "Please provide an expense id."
    },
    // Task name (not updated if not provided)
    name: {
      type: "string"
    },
    // Icon index (not updated if not provided)
    icon: {
      type: "int"
    },
    // Iterating mode (false...single member, true...iterating through household members) (not updated if not provided)
    iteratingMode: {
      type: "boolean"
    },
    // Assigned member (not updated if not provided)
    assignedMember: {
      type: "int"
    },
    // Days on which to repeat the task (not updated if not provided)
    repetitionDays: {
      type: "object"
    },
    // Repeat every x weeks/months (not updated if not provided)
    repetitionEvery: {
      type: "int"
    },
    // Repeat every unit (false...week, true...month) (not updated if not provided)
    repetitionUnit: {
      type: "boolean"
    },
    // Reminder activated (not updated if not provided)
    reminder: {
      type: "boolean"
    },
    // Time (not updated if not provided)
    time: {
      type: "string"
    },
    // Date (not updated if not provided)
    date: {
      type: "string"
    }
  },
  handler: async ({ body, query, user }, { success, fail, error }) => {
    try {
      const { results } = await db.query("SELECT COUNT(*) AS 'c' FROM users WHERE id = ? AND hid = ?", [user.uid, user.hid]);
      if (results[0].c < 1) {
        fail("You don't have permission to edit tasks for this household.");
        return;
      } else if (!!body.assignedMember && body.assignedMember != user.uid) try {
        const { results } = await db.query("SELECT COUNT(*) AS 'c' FROM users WHERE id = ? AND hid = ?", [body.assignedMember, user.hid]);

        if (results[0].c < 1) {
          fail("The assigned member id is invalid or does not belong to this household.");
          return;
        }
      } catch (err) {
        error("Error while fetching specified assigned member from database.", err);
        return;
      }

      //Permissions granted; perform update
      let updateVals = Helpers.copyKeysIfPresent(body,
        ["name", "icon", "iteratingMode", "assignedMember", "repetitionEvery", "repetitionUnit", "reminder", "time", "date"]
      );
      if (body.repetitionDays) updateVals.repetitionDays = JSON.stringify(body.repetitionDays);
      try {
        await db.query(
          "UPDATE tasks SET ? WHERE id = ?",
          [updateVals, body.id]
        );
        success("Task updated successfully.");
      } catch (err) {
        error("Error while updating task in database.", err);
      }

    } catch (err) {
      error("Error while fetching specified user from database.", err);
    }
  }
});