/*  Handler for "/_/imhome". Purpose: For ImHomeWidget. Remind others that you're home. */
const Helpers = require("../components/Helpers");

module.exports = ({ db }) => ({
  type: "POST",
  public: false,
  handler: async ({ body, query, uid }, { success, fail, error }) => {
    try {
      const hid = await Helpers.fetchHouseholdID(db, uid);
      const { results: results2 } = await db.query("SELECT firstname, lastname, nickname FROM users WHERE id = ? AND hid = ?", [uid, hid]);
      let name;
      if (results2[0].nickname != "") {
        name = results2[0].nickname;
      } else {
        name = results2[0].firstname + " " + results2[0].lastname;
      }
      const { results } = await db.query("SELECT id FROM users WHERE hid = ?", [hid]);
      results.forEach(res => {
        if (res.id != uid) {
          Helpers.sendNotificationToUser(db, res.id, name + " is home!");
        }
      });
      success("Push reminder successfull.");
    } catch (err) {
      error("Error while fetching assigned member from database.", 2, err);
    }
  }

});