/*  Handler for "/_/addmonthlycharge". Purpose: Adding monthlycharges to database (used for 'finances' view). */
module.exports = ({ db }) => ({
    type: "POST",
    public: false,
    body: {
      amount: {
        type: "int",
        required: true,
        message: "An expense amount is required."
      },
      uid: {
        type: "int",
        default: "-1"
      },
      name: {
        type: "string",
        default: "Empty charge"
      },
      icon: {
        type: "int",
        default: "0"
      }
    },
    handler: async ({ body, query, user }, { success, fail, error }) => {
      try {
        const { results } = await db.query("SELECT COUNT(*) AS 'c' FROM users WHERE id = ? AND hid = ?", [user.uid, user.hid]);
        if (results[0].c < 1) {
          fail("The specifed user does not exist or does not belong to this household.");
        } else try {
          await db.query("INSERT INTO monthlycharges (hid, uid, name, amount, icon) VALUES (?, ?, ?, ?, ?)", [user.hid, body.uid, body.name, body.amount, body.icon]);
          success("Expense inserted successfully.");
        } catch (err) {
          error("Error while inserting monthly charge into database.", err);
        }
      } catch (err) {
        error("Error while fetching specified user from database.", err);
      }
    }
  
  });