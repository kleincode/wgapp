/*  Handler for "/_/fetchhousehold". Purpose: Getting household metadata (used on "household" page). */
const Helpers = require("../components/Helpers");

module.exports = ({ db }) => ({
  type: "GET",
  public: false,
  handler: async ({ body, query, uid }, { success, fail, error }) => {
    const hid = await Helpers.fetchHouseholdID(db, uid);
    if (hid) {
      try {
        const { results: userResults } = await db.query(`SELECT id FROM users WHERE ?`, [{hid}]);
        let members = userResults.map(res => res.id);
        const { results: householdResults } = await db.query(`SELECT name, type, registered FROM households WHERE ?`, [{id: hid}]);
        
        success({
          message: "Household data fetched.",
          exists: true,
          name: householdResults[0].name,
          type: householdResults[0].type,
          registered: householdResults[0].registered,
          members
        });
      } catch (err) {
        error("Error while fetching household data.", err);
      }
    } else {
      fail({message: "Please join a household to use this feature.", exists: false});
    }
  }
});