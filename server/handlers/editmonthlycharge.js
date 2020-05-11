/*  Handler for "/_/editmonthlycharge". Purpose: Updating monthly charge in finances. */
const Helpers = require("../components/Helpers");
module.exports = ({ db }) => ({
  type: "POST",
  public: false,
  body: {
    id: {
      type: "int",
      unsigned: true,
      required: true,
      message: "Please provide an monthly charge id."
    },
    uid: {
      type: "int"
    },
    name: {
      type: "string"
    },
    amount: {
      type: "int"
    },
    icon: {
      type: "int"
    }
  },
  handler: async ({ body, query, uid }, { success, fail, error }) => {
    let updateVals = Helpers.copyKeysIfPresent(body, ["name", "uid", "amount", "icon"]);
    const hid = await Helpers.fetchHouseholdID(db, uid);
    if (Helpers.isObjectEmpty(updateVals)) {
      success("No changes made.");
    } else try {
      const { results: { affectedRows, changedRows } } = await db.query(
        "UPDATE monthlycharges SET ? WHERE id = ? AND hid = ?",
        [updateVals, body.id, hid]
      );

      if (affectedRows < 1) {
        fail("You don't have permission to change this entry.");
      } else if (changedRows < 1) {
        success("No changes made.");
      } else {
        success("Entry edited.");
      }
    } catch (err) {
      error("Error while deleting monthly charge from database.", 4, err);
    }
  }
});