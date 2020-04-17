/*  Handler for "/_/addexpense". Purpose: Adding expenses to database (used for 'finances' view). */
const Helpers = require("../components/Helpers");

module.exports = ({ db }) => ({
  type: "POST",
  public: false,
  body: {
    id: {
      type: "int",
      required: true,
      message: "An task id is required."
    }
  },
  handler: async ({ body, query, uid }, { success, fail, error }) => {
      try {
        const { results } = await db.query("SELECT assignedMember, name FROM tasks WHERE id = ?", [body.id]);
        Helpers.sendNotificationToUser(db, results[0].assignedMember, "Your roommates reminded you of " + results[0].name + ". Please don't forget it. If they're just trolling you I'm very sorry. If not: Shame on you!");
        success("Push reminder successfull.");
      } catch (err) {
        error("Error while fetching assigned member from database.", err);
      }
  }

});