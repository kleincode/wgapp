/*  Handler for "/_/dellog". Purpose: Deleting logs manually*/
const Helpers = require("../components/Helpers");
module.exports = ({ db }) => ({
    type: "POST",
    public: true,
    body: {
      id: {
        type: "int",
        unsigned: true,
        required: true,
        message: "Please provide an id."
      }
    },
    handler: async ({ body }, { success, fail, error }) => {
      try {
          const { results: { affectedRows } } = await db.query(
            "DELETE FROM log WHERE id = ?",
            [body.id]
          );
          if (affectedRows == 0) {
            fail("Couldn't delete log", 4);
          } else {
            success("Deleted log successfully.");
          }
      } catch (err) {
        error("Error while deleting log in database.", 0, err);
      }
    }
  });