/*  Handler for "/_/user". Purpose: Returning personal data about user to client. */
module.exports = ({ db }) => ({
  type: "GET",
  public: false,
  handler: async ({ body, query, uid }, { success, fail, error }) => {
    const { results } = await db.query("SELECT email, firstname, lastname FROM users WHERE ?", [{id: uid}]);
    if(results.length > 0) success({
      message: "Authorized",
      email: results[0].email,
      firstname: results[0].firstname,
      lastname: results[0].lastname
    });
    else error("Internal Server Error: User not found. This should never happen.");
  }
});