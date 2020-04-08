/*  Handler for "/_/fetchmonthlycharges". Purpose: Send monthlycharges to client. */

module.exports = ({ db }) => ({
    type: "GET",
    public: false,
    params: {
    },
    handler: async ({ body, query, user }, { success, fail, error }) => {
      if (user.hid) {
        let baseQuery = `SELECT id, payingUID, name, amount, icon FROM monthlycharges WHERE hid = ?`,
          baseParams = [user.hid];
        try {
          const { results } = await db.query(baseQuery, baseParams);
          if (results.length == 0) {
            if (id) {
              fail({ message: "Task not found.", data: {} });
            } else {
              success({ message: "Empty.", data: {} });
            }
          } else success({ message: "monthly charges received", data: results });
        } catch (err) {
          error("Error while fetching monthly charges from database.");
        }
      } else {
        fail("Please join a household to use this feature.");
      }
    }
  });