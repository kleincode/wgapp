/*  Handler for "/_/toggleUserStatus". Purpose: Update user status for status widget */
module.exports = ({ db }) => ({
  type: "POST",
  public: false,
  body: {
    value: {
      type: "boolean"
    }
  },
  handler: async ({ body, query, uid }, { success, fail, error }) => {
    try {
      let { results } = await db.query("UPDATE users SET status = ? WHERE id = ?", [body.value, uid]);
      success({ message: "Updated user status.", results });
    } catch (err) {
      error("Error while update user status database", err);
    }
  }
});