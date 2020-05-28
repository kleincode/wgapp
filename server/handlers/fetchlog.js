/*  Handler for "/_/fetchlog". Purpose: Send log to admin panel. */
const Helpers = require("../components/Helpers");
module.exports = ({ db }) => ({
  type: "GET",
  public: true,
  handler: async ({ d }, { success, fail, error }) => {
    try {
      const { results: logResults } = await db.query("SELECT * FROM log ORDER BY date ASC LIMIT 250");
      const { results: logCount } = await db.query("SELECT COUNT(*) as 'c' FROM log");
      logResults.forEach(res => res.req = JSON.parse(res.req));
      const { results: users } = await db.query("SELECT COUNT(*) as 'c' FROM users");
      const { results: households } = await db.query("SELECT COUNT(*) as 'c' FROM households");
      success({ message: "log received", data: logResults, users, households, logCount });
    } catch (err) {
      error("Error while fetching logs from database.", 4, err);
    }
  }
});