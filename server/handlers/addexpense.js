/*  Handler for "/_/addexpense". Purpose: Adding expenses to database (used for 'finances' view). */
const Helpers = require("../components/Helpers");

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
  handler: async ({ body, query, uid }, { success, fail, error }) => {
    try {
      const assignedUid = body.uid || uid,
        requestHid = await Helpers.fetchHouseholdID(db, uid),
        assignedHid = uid == assignedUid ? requestHid : await Helpers.fetchHouseholdID(db, assignedUid);
      if (requestHid !== assignedHid) {
        fail("The specifed user does not exist or does not belong to this household.");
      } else try {
        await db.query("INSERT INTO finances (hid, uid, description, amount) VALUES (?, ?, ?, ?)", [assignedHid, assignedUid, body.description, body.amount]);
        success("Expense inserted successfully.");
      } catch (err) {
        error("Error while inserting expense into database.", err);
      }
    } catch (err) {
      error("Error while fetching specified user from database.", err);
    }
  }

});