/*  Handler for "/_/fetchtasks". Purpose: Updating task in tasks table (used for 'edit task' view). */

module.exports = ({ db }) => ({
  type: "GET",
  public: false,
  params: {
    // Expense id in finances table
    id: {
      type: "int"
    }
  },
  handler: async ({ body, query, user }, { success, fail, error }) => {
    if (user.hid) {
      const { id } = query;
      let baseQuery = `SELECT id, name, icon, iteratingMode, assignedMember, repetitionDays, repetitionEvery, repetitionUnit, reminder, time, startDate, lastExecution FROM tasks WHERE hid = ?`,
        baseParams = [user.hid];
      if (id) {
        baseQuery += " AND id = ?";
        baseParams.push(id);
      }
      try {
        const { results } = await db.query(baseQuery, baseParams);

        results.forEach((elem) => {
          elem.repetitionDays = JSON.parse(elem.repetitionDays);
        });
        if (results.length == 0) {
          if (id) {
            fail({ message: "Task not found.", data: {} });
          } else {
            success({ message: "Empty.", data: {} });
          }
        } else success({ message: "Tasks received", data: results });
      } catch (err) {
        error("Error while fetching tasks from database.");
      }
    } else {
      fail("Please join a household to use this feature.");
    }
  }
});