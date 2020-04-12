/*  Handler for "/_/addmonthlycharge". Purpose: Adding monthlycharges to database (used for 'finances' view). */
const Helpers = require("../components/Helpers");
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
        default: -1
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
    handler: async ({ body, query, uid }, { success, fail, error }) => {
      try {
        const requestHid = await Helpers.fetchHouseholdID(db, uid);
        if (body.uid > 0) {
          const assignedHid = await Helpers.fetchHouseholdID(db, body.uid);
          if (requestHid != assignedHid) {
            fail("The assigned member is not part of your household.");
            return;
          }
        }

        await db.query("INSERT INTO monthlycharges (hid, uid, name, amount, icon) VALUES (?, ?, ?, ?, ?)", [requestHid, body.uid, body.name, body.amount, body.icon]);
        success("Expense inserted successfully.");
      } catch (err) {
        error("Error while inserting monthly charge into database.", err);
      }
    }
  
  });