/*  Handler for "/_/createshoppinglist". Purpose: Creating new shoppinglist (used for 'edit task' view). */
const Helpers = require("../components/Helpers");
module.exports = ({ db }) => ({
    type: "POST",
    public: false,
    body: {
      // Task name
      name: {
        type: "string",
        required: true,
        message: "Please name your list."
      },
      // Icon index
      icon: {
        type: "int",
        default: 0
      }
    },
    handler: async ({ body, query, uid }, { success, fail, error }) => {
  
      // default values
      let { name, icon } = body;
     
      try {
        const requestHid = await Helpers.fetchHouseholdID(db, uid);

          await db.query(
            "INSERT INTO shoppinglists (hid, name, icon) VALUES (?, ?, ?)",
            [requestHid, name, icon]
          );
          success("Shoppinglist added successfully.");
        
      } catch (err) {
        error("Error while fetching specified user from database.", err);
      }
    }
  });