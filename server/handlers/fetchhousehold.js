/*  Handler for "/_/fetchhousehold". Purpose: Getting household metadata (used on "household" page). */
const Helpers = require("../components/Helpers");

module.exports = ({ db }) => ({
  type: "GET",
  public: false,
  handler: async ({ body, query, uid }, { success, fail, error }) => {
    const hid = await Helpers.fetchHouseholdID(db, uid);
    if (hid) {
      try {
        const { results: userResults } = await db.query(`SELECT id, status, gmail FROM users WHERE ?`, [{hid}]);
        let members = userResults;
        const { results: householdResults } = await db.query(`SELECT name, type, registered, calendar FROM households WHERE ?`, [{id: hid}]);
        success({
          message: "Household data fetched.",
          exists: true,
          name: householdResults[0].name,
          type: householdResults[0].type,
          registered: householdResults[0].registered,
          calendar: householdResults[0].calendar,
          members
        });
      } catch (err) {
        error("Error while fetching household data.", 5, err);
      }
    } else {
      fail({message: "Please join a household to use this feature.", exists: false}, 0);
    }
  }
});