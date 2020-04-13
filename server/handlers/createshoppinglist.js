/*  Handler for "/_/createshoppinglist". Purpose: Creating new shoppinglist (used for 'edit task' view). */
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
        required: true,
      }
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