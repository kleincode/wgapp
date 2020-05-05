/*  Handler for "/_/fetchresetpassword". Purpose: Checking jwt token for validity and fetching corresponding email address (used on "reset password" page). */

const JWT = require("jsonwebtoken");
const JWT_SECRET = process.env.FORGOT_PASS_SECRET || "jIiTU_#=i9:S`Deh";

module.exports = ({ db }) => ({
  type: "GET",
  public: true,
  params: {
    token: {
      type: "string",
      required: true,
      message: "Please provide a security token."
    }
  },
  handler: async ({ body, query, uid }, { success, fail, error }) => {
    try {
      console.log(query.token);
      const { email, cpwtoken } = JWT.verify(query.token, JWT_SECRET);
      if(!email || !cpwtoken) {
        fail("Incomplete token.");
      } else {
        const { results } = await db.query(
          "SELECT COUNT(*) AS 'count' FROM users WHERE ? AND ?",
          [{ email }, { cpwtoken }]
        );
        if(results && results.length && results[0].count) {
          success({ message: "Valid.", email });
        } else {
          fail("Invalid token contents.");
        }
      }
    } catch(err) {
      fail("Invalid token.");
    }
  }
});