/*  Handler for "/_/user". Purpose: Returning personal data about user to client. */
module.exports = ({ db }) => ({
  type: "GET",
  public: false,
  handler: async ({ body, query, uid }, { success, fail, error }) => success("Authorized.")
});