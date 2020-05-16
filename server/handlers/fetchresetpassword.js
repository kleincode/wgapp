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
      const { email, cpwtoken } = JWT.verify(query.token, JWT_SECRET);
      if(!email || !cpwtoken) {
        fail("Incomplete token.", 1);
      } else {
        const { results } = await db.query(
          "SELECT COUNT(*) AS 'count' FROM users JOIN usertokens ON usertokens.uid = users.id WHERE users.email = ? AND usertokens.type = ? AND usertokens.token = ?",
          [email, "resetpassword", cpwtoken]
        );
        if(results && results.length && results[0].count) {
          success({ message: "Valid.", email });
        } else {
          fail("Invalid token contents." ,1);
        }
      }
    } catch(err) {
      fail("Invalid token." ,1);
    }
  }
});