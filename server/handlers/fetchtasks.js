/*  Handler for "/_/fetchtasks". Purpose: Updating task in tasks table (used for 'edit task' view). */
const Helpers = require("../components/Helpers");

module.exports = ({ db }) => ({
  type: "GET",
  public: false,
  params: {
    id: {
      type: "int"
    }
  },
  handler: async ({ body, query, uid }, { success, fail, error }) => {
    const hid = await Helpers.fetchHouseholdID(db, uid);
    if (hid) {
      const { id } = query;
      let baseQuery = `SELECT id, mode, name, icon, iteratingMode, assignedMember, repetitionDays, repetitionEvery, repetitionUnit, reminder, UNIX_TIMESTAMP(startDate) as 'startDate', UNIX_TIMESTAMP(lastExecution) as 'lastExecution' FROM tasks WHERE hid = ?`,
        baseParams = [hid];
      if (id) {
        baseQuery += " AND id = ?";
        baseParams.push(id);
      } else {
        baseQuery += " AND (mode != 0 OR (mode = 0 AND lastExecution < '2001-00-1 00:00:00'))";
      }
      try {
        const { results: loggedTasks } = await db.query("SELECT assignedMember, workingMember, time, name, icon FROM tasklog WHERE hid = ?", [hid]);
        const { results } = await db.query(baseQuery, baseParams);
        results.forEach((elem) => {
          elem.repetitionDays = JSON.parse(elem.repetitionDays);
        });
        if (results.length == 0) {
          if (id) {
            fail({ message: "Task not found.", data: [] }, 4);
          } else {
            success({ message: "Empty.", data: [] });
          }
        } else success({ message: "Tasks received", data: results, loggedTasks: loggedTasks });
      } catch (err) {
        error("Error while fetching tasks from database.", 3, err);
      }
    } else {
      fail("Please join a household to use this feature.", 0);
    }
  }
});