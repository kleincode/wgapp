/*  Handler for "/_/edithousehold". Purpose: Updating household information */
const Helpers = require("../components/Helpers");

module.exports = ({ db }) => ({
  type: "POST",
  public: false,
  body: {
    name: {
      type: "string"
    },
    type: {
      unsigned: true,
      type: "int"
    }
  },
  handler: async ({ body, query, uid }, { success, fail, error }) => {
    let updateVals = Helpers.copyKeysIfPresent(body, ["name", "type"]);

    if (Helpers.isObjectEmpty(updateVals)) {
      success("No changes made.");
    } else try {
      const hid = await Helpers.fetchHouseholdID(db, uid);
      if (!!hid) {
        const { results: { affectedRows, changedRows } } = await db.query(
          "UPDATE households SET ? WHERE id = ?",
          [updateVals, hid]
        );
        if (affectedRows < 1) {
          fail("You don't have permissions to change this entry.", 5);
        } else if (changedRows < 1) {
          success("No changes made.");
        } else {
          success("Updated household");
        }
      } else {
        error("You are in no household or your household was deleted. HID couldn't be fetched", 5);
      }
    } catch (err) {
      error("Error while editing household in database.", 5, err);
    }
  }
});