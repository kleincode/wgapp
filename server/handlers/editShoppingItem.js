/*  Handler for "/_/editShoppingItem". Purpose: Edit shoppinglistitem */
const Helpers = require("../components/Helpers");

module.exports = ({ db }) => ({
    type: "POST",
    public: false,
    body: {
      // item name
      item: {
        type: "string",
        required: true,
        message: "Please name your item."
      },
      //associated shoppinglist
      itemid: {
        type: "int",
        required: true
      },
      checked: {
        type: "boolean",
        default: false
      }
    },
    handler: async ({ body, query, uid }, { success, fail, error }) => {

      try {
        const requestHid = await Helpers.fetchHouseholdID(db, uid);
        await db.query(
          "UPDATE shoppingitems SET item = ?, checked = ? WHERE hid = ? AND id = ?",
          [body.item, body.checked, requestHid, body.itemid]
        );
        success("Shoppinglistitem added successfully.");
      } catch (err) {
        error("Error while editing shopping item.", err);
      }
    }
  });