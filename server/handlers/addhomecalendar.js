/*  Handler for "/_/addhomecalendar". Purpose: Adding home calendar name to db. */
const Helpers = require("../components/Helpers");
module.exports = ({ db }) => ({
  type: "POST",
  public: false,
  body: {
    id: {
      type: "string",
      required: true,
      message: "Please provide an id."
    },
  },
  handler: async ({ body, query, uid }, { success, fail, error }) => {
    try {
      const hid = await Helpers.fetchHouseholdID(db, uid);
      await db.query("UPDATE households SET calendar = ? WHERE id = ?", [body.id, hid]);
      success("Home calendar inserted successfully.");
    } catch (err) {
      error("Error while inserting home calendar into database.", 4, err);
    }
  }

});