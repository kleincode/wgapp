/*  Handler for "/_/createshoppinglist". Purpose: Creating new shoppinglistitem */
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
      listid: {
        type: "int",
        required: true,
        message: "Please provide a (shopping-) listid."
      },
      checked: {
        type: "boolean",
        default: false
      }
    },
    handler: async ({ body, query, uid }, { success, fail, error }) => {
  
      // default values
      let { item,  listid, checked } = body;
     
  
      try {
        const requestHid = await Helpers.fetchHouseholdID(db, uid);
        
        await db.query(
          "INSERT INTO shoppingitems (item, checked, listid, hid) VALUES (?, ?, ?, ?)",
          [body.item, body.checked, body.listid, requestHid]
        );
        success("Shoppinglistitem added successfully.");
      } catch (err) {
        error("Error while fetching specified user from database.", err);
      }
    }
  });