/*  Handler for "/_/deletemonthlycharge". Purpose: Delete monthly charge in monthlycharge table */
module.exports = ({ db }) => ({
    type: "POST",
    public: false,
    body: {
      // monthly charge id in monthly charge table
      id: {
        type: "int",
        unsigned: true,
        required: true,
        message: "Please provide an monthly charge id."
      }
    },
    handler: async ({ body, query, user }, { success, fail, error }) => {
      try {
        const { results } = await db.query("SELECT COUNT(*) AS 'c' FROM users WHERE id = ? AND hid = ?", [user.uid, user.hid]);
        if (results[0].c < 1) {
          fail("You don't have permission to delete monthly charges for this household.");
          return;
        }
  
        //Permissions granted; perform update
        try {
          await db.query(
            "DELETE FROM monthlycharges WHERE id = ?",
            [body.id]
          );
          success("Monthly charge updated successfully.");
        } catch (err) {
          error("Error while deleting monthly charge in database.", err);
        }
  
      } catch (err) {
        error("Error while fetching specified user from database.", err);
      }
    }
  });