/*  Handler for "/_/fetchusers". Purpose: Updating user names for all household members. */
const Helpers = require("../components/Helpers");

module.exports = ({ db }) => ({
  type: "GET",
  public: false,
  handler: async ({ body, query, uid }, { success, fail, error }) => {
    const hid = await Helpers.fetchHouseholdID(db, uid);
    if (hid) {
      try {
        const { results } = await db.query(`SELECT id, firstname, lastname FROM users WHERE ?`, [{hid}]);
        let userdata = {};
        results.forEach(u => userdata[u.id] = { firstname: u.firstname, lastname: u.lastname });
        success({ message: "User data fetched.", data: userdata });
      } catch (err) {
      }
    } else {
      fail("Please join a household to use this feature.");
    }
  }
});