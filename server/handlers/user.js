/*  Handler for "/_/user". Purpose: Returning personal data about user to client. */
module.exports = ({ db }) => ({
  type: "GET",
  public: false,
  handler: async ({ body, query, user }, { success, fail, error }) => {
    if(user.email) success({
      message: "Authorized",
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname
    });
    else error("Internal Server Error: No email given, even though authorization was successful.");
  }
});