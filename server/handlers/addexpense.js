/*  Handler for "/_/addexpense". Purpose: Adding expenses to database (used for 'finances' view). */
module.exports = ({ db }) => ({
  type: "POST",
  public: false,
  body: {
    amount: {
      type: "int",
      required: true,
      message: "An expense amount is required."
    },
    uid: {
      type: "int"
    },
    description: {
      type: "string",
      default: ""
    }
  },
  handler: async ({ body, query, user }, { success, fail, error }) => {
    try {
      const { results } = await db.query("SELECT COUNT(*) AS 'c' FROM users WHERE id = ? AND hid = ?", [body.uid || user.uid, user.hid]);
      if (results[0].c < 1) {
        fail("The specifed user does not exist or does not belong to this household.");
      } else try {
        await db.query("INSERT INTO finances (hid, uid, description, amount) VALUES (?, ?, ?, ?)", [user.hid, body.uid || user.uid, body.description, body.amount]);
        success("Expense inserted successfully.");
      } catch (err) {
        error("Error while inserting expense into database.", err);
      }
    } catch (err) {
      error("Error while fetching specified user from database.", err);
    }
  }

});