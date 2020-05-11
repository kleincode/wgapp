/*  Handler for "/_/fetchlog". Purpose: Send log to admin panel. */
const Helpers = require("../components/Helpers");
module.exports = ({ db }) => ({
  type: "GET",
  public: true,
  handler: async ({ d }, { success, fail, error }) => {
    try {
      const { results } = await db.query("SELECT * FROM log ");
      results.map(res => ({ ...res, req: JSON.parse(res.req) }));
      success({ message: "log received", data: results });
    } catch (err) {
      error("Error while fetching logs from database.", 4, err);
    }
  }
});