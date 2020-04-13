/*  Handler for "/_/createshoppinglist". Purpose: Creating new shoppinglistitem */
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
      amount: {
        type: "int",
        required: true,
        message: "Please enter the amount."
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
    handler: async ({ body, query, user }, { success, fail, error }) => {
  
      // default values
      let { item, amount, listid, checked } = body;
     
  
      try {
        const { results } = await db.query("SELECT COUNT(*) AS 'c' FROM users WHERE id = ? AND hid = ? AND listid = ?", [user.uid, user.hid, body.listid]);
  
        if (results[0].c < 1) {
          fail("The specifed user does not exist or does not belong to this household.");
        } else try {
          await db.query(
            "INSERT INTO shoppinglists (item, amount, checked, listid, hid) VALUES (?, ?, ?, ?, ?)",
            [body.item, body.amount, body.checked, body.listid, user.hid]
          );
          success("Shoppinglist added successfully.");
        } catch (err) {
          error("Error while adding Shoppinglist into database.", err);
        }
      } catch (err) {
        error("Error while fetching specified user from database.", err);
      }
    }
  });