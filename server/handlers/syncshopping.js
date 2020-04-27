/*  Handler for "/_/syncshopping". Purpose: Client sends shopping updates to server, server merges and sends merged changes to client (used in Shopping page). */
const Helpers = require("../components/Helpers");

module.exports = ({ db }) => ({
  type: "POST",
  public: false,
  body: {
    lastUpdate: {
      type: "int",
      required: true
    },
    items: {
      type: "object",
      required: true
    },
    lists: {
      type: "object",
      required: true
    }
  },
  handler: async ({ body: { lastUpdate, items, lists }, uid }, { success, fail, error }) => {
    try {
      const hid = await Helpers.fetchHouseholdID(db, uid);
      if(hid) {
        const ta = await db.beginTransaction();
        // const { results } = await db.query("SELECT ")
        await ta.commit();
        success("TODO.");
      } else {
        fail("Please join a household to use this feature.");
      }
    } catch(err) {
      error("Error while fetching household.", err);
    }
  }
});