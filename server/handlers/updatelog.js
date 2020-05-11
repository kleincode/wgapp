/*  Handler for "/_/updatelog". Purpose: Updating log (mark as reviewed) */

module.exports = ({ db }) => ({
  type: "POST",
  public: true,
  body: {
    id: {
      type: "int",
      required: true,
      message: "Please specify an log id"
    },
    reviewed: {
      type: "boolean",
      default: false
    }
  },
  handler: async ({ body }, { success, fail, error }) => {
    try {
      const { results } = await db.query("UPDATE log SET reviewed = ? WHERE id = ?", [body.reviewed, body.id]);
      if (results.changedRows != 1) {
        error("Couldn't update log", 1);
      } else {
        success("Updated log");
      }
    } catch (err) {
      error("Error while updating log.", 0, err);
    }
  }
});