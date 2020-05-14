/*  Handler for "/_/fetchfinances". Purpose: Fetching expenses and member totals from finances table (used for 'finances' view). */
const Helpers = require("../components/Helpers");

module.exports = ({ db }) => ({
  type: "POST",
  public: false,
  body: {
    gmail: {
      type: "string",
      required: true,
      message: "A gmail address is required."
    }
  },
  handler: async ({ body, query, uid }, { success, fail, error }) => {
    try {
      await db.query("UPDATE users SET gmail = ? WHERE id = ?", [body.gmail, uid]);
      success("Successfully updated gmail.");
    } catch (err) {
      error("Error while updating gmail in database", 4, err);
    }
  }
});