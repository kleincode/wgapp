/*  Handler for "/_/fetchinvitelink". Purpose: Getting encrypted household id and security code (used on "household" page). */
const Helpers = require("../components/Helpers");

module.exports = ({ db }) => ({
  type: "GET",
  public: false,
  handler: async ({ body, query, uid }, { success, fail, error }) => {
    const hid = await Helpers.fetchHouseholdID(db, uid);
    if (hid) {
      try {
        const { results } = await db.query(`SELECT HEX(AES_ENCRYPT(\`id\`, ?)) AS hid, passphrase FROM households WHERE ?`, [process.env.AES_HOUSEHOLD_PASSPHRASE, {id: hid}]);
        
        success({
          message: "Household data fetched.",
          hid: results[0].hid,
          sec: results[0].passphrase
        });
      } catch (err) {
        error("Error while fetching invite link.", 5, err);
      }
    } else {
      fail("Please join a household to use this feature.",0);
    }
  }
});