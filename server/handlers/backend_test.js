/*  Handler for "/_/user". Purpose: Returning personal data about user to client. */
module.exports = ({ db }) => ({
  type: "GET",
  public: true,
  handler: async ({ body, query, user }, { success, fail, error }) => success("Backend working.")
});