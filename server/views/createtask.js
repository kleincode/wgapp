/*  Handler for "/_/createtask". Purpose: Creating new task (used for 'edit task' view). */
module.exports = (db) => ({
    type: "POST",
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
      // Time
      time: {
        type: "string"
      },
      // Date
      date: {
        type: "string"
      }
    },
    handler: async ({ body, query, user }, { success, fail, error }) => {

      // default values
      let genDate = new Date();
      const { name, icon, iteratingMode, assignedMember, repetitionDays, repetitionEvery, repetitionUnit, reminder, time, date } = body;
      assignedMember = assignedMember || user.uid; // assign to sending user by default
      time = time || genDate.getHours() + ":" + genDate.getMinutes() + ":" + genDate.getSeconds();genDate.getFullYear() + "." + genDate.getMonth() + "." + genDate.getDay();
      date = date || genDate.getFullYear() + "." + genDate.getMonth() + "." + genDate.getDay();

      try {
        const { userRows } = await db.query("SELECT COUNT(*) AS 'c' FROM users WHERE id = ? AND hid = ?", [req.user.uid, req.user.hid]);

        if(userRows[0].c < 1) {
          fail("The specifed user does not exist or does not belong to this household.");
        } else try {
          await db.query(
            "INSERT INTO tasks (hid, name, icon, iteratingMode, assignedMember, repetitionDays, repetitionEvery, repetitionUnit, reminder, time, startDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [req.user.hid, name, icon, iteratingMode, assignedMember, JSON.stringify(repetitionDays), repetitionEvery, repetitionUnit, reminder, time, date]
          );
          success("Task inserted successfully.");
        } catch(err) {
          error("Error while inserting task into database.");
        }
      } catch(err) {
        error("Error while fetching specified user from database.");
      }
    }
});