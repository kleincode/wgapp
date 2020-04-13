/*  Handler for "/_/editShoppingItem". Purpose: Creating new shoppinglist (used for 'edit task' view). */
module.exports = ({ db }) => ({
    type: "POST",
    public: false,
    body: {
      // list name
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
    },
    handler: async ({ body, query, user }, { success, fail, error }) => {
  
      // default values
      let { name, icon } = body;
     
  
      try {
        const { results } = await db.query("SELECT COUNT(*) AS 'c' FROM users WHERE id = ? AND hid = ?", [user.uid, user.hid]);
  
        if (results[0].c < 1) {
          fail("The specifed user does not exist or does not belong to this household.");
        } else try {
          await db.query(
            "INSERT INTO shoppinglists (hid, name, icon) VALUES (?, ?, ?)",
            [user.hid, name, icon]
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