/*  Handler for "/_/edittask". Purpose: Updating task in tasks table (used for 'edit task' view). */
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
    },
    // Task name (not updated if not provided)
    name: {
      type: "string"
    },
    // Icon index (not updated if not provided)
    icon: {
      type: "int"
    },
    mode: {
      type: "int",
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
    // Date (not updated if not provided)
    startDate: {
      type: "int"
    },
    due: {
      type: "string",
      required: true,
      message: "Please specify the new due date"
    }
  },
  handler: async ({ body, query, uid }, { success, fail, error }) => {
    try {
      const assignedUid = body.assignedMember || uid, // assign to sending user by default
        requestHid = await Helpers.fetchHouseholdID(db, uid),
        assignedHid = (uid == assignedUid) ? requestHid : await Helpers.fetchHouseholdID(db, assignedUid);
      if(assignedHid != requestHid) {
        fail("The assigned member does not belong to your household", 0);
        return;
      }

      //Permissions granted; perform update
      let updateVals = Helpers.copyKeysIfPresent(body,
        ["name", "icon", "mode", "iteratingMode", "assignedMember", "repetitionEvery", "repetitionUnit", "reminder", "due"]
      );
      let updateSuffix = "";
      if (body.startDate) {
        updateSuffix = ", startDate = FROM_UNIXTIME(" + body.startDate + ")";
      }
      if (body.repetitionDays) updateVals.repetitionDays = JSON.stringify(body.repetitionDays);
      try {
        const { results: { affectedRows, changedRows } } = await db.query(
          `UPDATE tasks SET ?${updateSuffix} WHERE id = ? AND hid = ?`,
          [updateVals, body.id, requestHid]
        );
        if(affectedRows == 0) {
          fail("You do not have permission to perform this operation.", 3);
        } else if(changedRows == 0) {
          success("No changes made.");
        } else {
          success("Task updated successfully.");
        }
      } catch (err) {
        error("Error while updating task in database.", 3, err);
      }
    } catch (err) {
      error("Error while fetching specified user from database.", 0, err);
    }
  }
});