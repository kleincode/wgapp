/*  Handler for "/_/checkshoppingitem". Purpose: Setting shopping item to checked. */
const Helpers = require("../components/Helpers");

module.exports = ({ db }) => ({
  type: "POST",
  public: false,
  body: {
    id: {
      type: "int",
      required: true,
      message: "Please provide a shopping item id."
    },
    targetState: {
      type: "boolean",
      message: "Please specify target check state"
    }
  },
  handler: async ({ body, query, uid }, { success, fail, error }) => {
    try {
      const hid = await Helpers.fetchHouseholdID(db, uid);
      try {
        await db.query("UPDATE shoppingitems SET checked = ? WHERE id = ? AND hid = ?", [body.targetState, body.id, hid]);
        success("Check successful.");
      } catch (err) {
        error("Error while checking shopping item in database.", err);
      }
    } catch (err) {
      error("Error while fetching specified hid from user.", err);
    }
  }
});