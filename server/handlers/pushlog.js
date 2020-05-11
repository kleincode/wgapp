/*  Handler for "/_/pushlog". Purpose: Add log for unexpected client error */
const Helpers = require("../components/Helpers");

module.exports = ({ db }) => ({
  type: "POST",
  public: false,
  body: {
    msg: {
      type: "string",
      required: true,
      message: "A message is required."
    },
    stack: {
      type: "string"
    }
  },
  handler: async ({ body, query, uid }, { success, fail, error }) => {
      try {
        Helpers.pushLog({ db }, 0, 0, "Client error", body.msg, body.stack, {body, query, uid});
        success("Push log successfull.");
      } catch (err) {
        error("Error while pushing log to database.", 0, err);
      }
  }

});