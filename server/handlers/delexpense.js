/*  Handler for "/_/delexpense". Purpose: Deleting expense from finances table (used for 'finances' view). */
module.exports = ({ db }) => ({
  type: "POST",
  public: false,
  body: {
    id: {
      type: "int",
      unsigned: true,
      required: true,
      message: "Please provide an expense id."
    }
  },
  handler: async ({ body, query, user }, { success, fail, error }) => {
    try {
      const { results: { affectedRows } } = await db.query("DELETE FROM finances WHERE id = ? AND hid = ?", [body.id, user.hid]);
      if (affectedRows < 1) {
        fail("You don't have permission to change this entry.");
      } else {
        success("Entry deleted.");
      }
    } catch (err) {
      error("Error while deleting from database.", err);
    }
  }
});