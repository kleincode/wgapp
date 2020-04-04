/*  This module accepts requests to "/_/addexpense". The following arguments are passed to the function:
    req.body    ..      JSON request body sent by client (for POST requests) OR
    req.query   ..      HTTP params sent by client (for GET requests)
    req.user    ..      Information about the user sending the request (properties: email, uid, firstname, lastname, hid)
    res         ..      Result object, used to respond to the client
    db          ..      Helper for database calls (see MySQLDatabase.js)
    */
module.exports = (db) => ({
  type: "POST",
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
      const { rows } = await db.query("SELECT COUNT(*) AS 'c' FROM users WHERE id = ? AND hid = ?", [body.uid || user.uid, user.hid]);
      if (rows[0].c < 1) {
        fail("The specifed user does not exist or does not belong to this household.");
      } else try {
        await db.query("INSERT INTO finances (hid, uid, description, amount) VALUES (?, ?, ?, ?)", [user.hid, body.uid || user.uid, body.description, body.amount]);
        success("Expense inserted successfully.");
      } catch (err) {
        error("Error while inserting expense into database.");
      }
    } catch (err) {
      error("Error while fetching specified user from database.");
    }
  }

});