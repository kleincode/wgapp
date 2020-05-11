/*  Handler for "/_/leavehousehold". Purpose: Resetting household for user to 0 (used for 'manage household' view). */
module.exports = ({ db }) => ({
  type: "POST",
  public: false,
  handler: async ({ body, query, uid }, { success, fail, error }) => {
    try {
      const { results } = await db.query("UPDATE users SET ? WHERE ?", [{ hid: 0 }, { id: uid }]);
      if(results.changedRows == 0) {
        success("No changes made.");
      } else {
        success("Household reset.");
      }
    } catch(err) {
      error("Error while updating database.", 5, err);
    }
  }
});