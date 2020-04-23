/*  Handler for "/_/fetchexpenses". Purpose: Solely fetching expense in a defined time frame (used in 'Finances' widget). */
const Helpers = require("../components/Helpers");

module.exports = ({ db }) => ({
  type: "GET",
  public: false,
  params: {
    mintime: {
      type: "int",
      default: 0
    },
    maxentries: {
      type: "int",
      unsigned: true,
      default: 6
    }
  },
  handler: async ({ body, query, uid }, { success, fail, error }) => {
    const hid = await Helpers.fetchHouseholdID(db, uid);
    if (hid) {
      try {
        const { results } = await db.query(
          `SELECT id AS 'fid', description, amount, uid, UNIX_TIMESTAMP(created) as 'date', receipt FROM finances WHERE hid = ? AND UNIX_TIMESTAMP(created) > ? ORDER BY created DESC LIMIT 0,6`,
          [hid, query.mintime]
        );
        if(results.length == 0) {
          success({message: "Empty.", data: []});
        } else {
          success({message: "Entries received.", data: results});
        }
      } catch(err) {
        error("Error while fetching from database.", err);
      }
    } else {
      fail("Please join a household to use this feature.");
    }
  }
});