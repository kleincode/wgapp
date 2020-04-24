/*  Handler for "/_/editshoppinglist". Purpose: Edit shoppinglist */
const Helpers = require("../components/Helpers");

module.exports = ({ db }) => ({
  type: "POST",
  public: false,
  body: {
    // item name
    name: {
      type: "string",
      required: true,
      message: "Please name your list."
    },
    id: {
      type: "int",
      required: true
    },
    icon: {
      type: "int",
      default: 0
    }
  },
  handler: async ({ body, query, uid }, { success, fail, error }) => {

    try {
      const requestHid = await Helpers.fetchHouseholdID(db, uid);
      await db.query(
        "UPDATE shoppinglists SET name = ?, icon = ? WHERE id = ? AND hid = ?",
        [body.name, body.icon, body.id, requestHid]
      );
      success("Shoppinglistitem added successfully.");
    } catch (err) {
      error("Error while editing shopping item.", err);
    }
  }
});