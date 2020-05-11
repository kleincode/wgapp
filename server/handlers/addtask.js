/*  Handler for "/_/addtask". Purpose: Creating new task (used for 'edit task' view). */
const Helpers = require("../components/Helpers");

module.exports = ({ db }) => ({
  type: "POST",
  public: false,
  body: {
    // Task name
    name: {
      type: "string",
      required: true,
      message: "Please name your task."
    },
    // Icon index
    icon: {
      type: "int",
      default: 0
    },
    mode: {
      type: "int",
      default: 0
    },
    // Iterating mode (false...single member, true...iterating through household members)
    iteratingMode: {
      type: "boolean",
      default: true
    },
    // Assigned member
    assignedMember: {
      type: "int"
    },
    // Days on which to repeat the task
    repetitionDays: {
      type: "object",
      default: ["monday"]
    },
    // Repeat every x weeks/months
    repetitionEvery: {
      type: "int",
      default: 1
    },
    // Repeat every unit (false...week, true...month)
    repetitionUnit: {
      type: "boolean",
      default: false
    },
    // Reminder activated 
    reminder: {
      type: "boolean",
      default: true
    },
    // Date
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

    // default values
    let genDate = new Date();
    let { name, mode, icon, iteratingMode, repetitionDays, repetitionEvery, repetitionUnit, reminder, startDate, due } = body;
    startDate = startDate || Math.floor(genDate.getTime() / 1000);

    try {
      const assignedUid = body.assignedMember || uid, // assign to sending user by default
        requestHid = await Helpers.fetchHouseholdID(db, uid),
        assignedHid = uid == assignedUid ? requestHid : await Helpers.fetchHouseholdID(db, assignedUid);

      if (requestHid !== assignedHid) {
        fail("The specifed user does not exist or does not belong to this household.");
      } else try {
        await db.query(
          "INSERT INTO tasks (hid, name, mode, icon, iteratingMode, assignedMember, repetitionDays, repetitionEvery, repetitionUnit, reminder, startDate, due) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, FROM_UNIXTIME(?), ?)",
          [assignedHid, name, mode, icon, iteratingMode, assignedUid, JSON.stringify(repetitionDays), repetitionEvery, repetitionUnit, reminder, startDate, due]
        );
        success("Task inserted successfully.");
      } catch (err) {
        error("Error while inserting task into database.", 3, err);
      }
    } catch (err) {
      error("Error while fetching specified user from database.", 0, err);
    }
  }
});