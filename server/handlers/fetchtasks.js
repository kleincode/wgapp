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
      let baseQuery = `SELECT id, mode, name, icon, iteratingMode, assignedMember, repetitionDays, repetitionEvery, repetitionUnit, reminder, time, startDate, lastExecution FROM tasks WHERE hid = ?`,
        baseParams = [hid];
      if (id) {
        baseQuery += " AND id = ?";
        baseParams.push(id);
      } else {
        baseQuery += " AND (mode != 0 OR (mode = 0 AND lastExecution < '2001-00-1 00:00:00'))";
      }
      try {
        const { results } = await db.query(baseQuery, baseParams);
        const { results: oldTasks } = await db.query("SELECT id, icon, name, startDate, assignedMember FROM tasks WHERE hid = 27 AND mode = 0 AND lastExecution > '2001-08-12 04:20:00' ORDER BY lastExecution DESC LIMIT 0,5", [hid]);
        results.forEach((elem) => {
          elem.repetitionDays = JSON.parse(elem.repetitionDays);
        });
        if (results.length == 0) {
          if (id) {
            fail({ message: "Task not found.", data: {} });
          } else {
            success({ message: "Empty.", data: {} });
          }
        } else success({ message: "Tasks received", data: results, oldTasks: oldTasks });
      } catch (err) {
        error("Error while fetching tasks from database.");
      }
    } else {
      fail("Please join a household to use this feature.");
    }
  }
});