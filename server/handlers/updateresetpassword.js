/*  Handler for "/_/updateresetpassword". Purpose: Updating password on 'Reset password' page using token. */
const BCrypt = require("bcryptjs");
const AUTH_SALT_ROUNDS = parseInt(process.env.AUTH_SALT_ROUNDS) || 10;
const JWT = require("jsonwebtoken");
const JWT_SECRET = process.env.FORGOT_PASS_SECRET || "jIiTU_#=i9:S`Deh";

module.exports = ({ db }) => ({
  type: "POST",
  public: true,
  body: {
    token: {
      type: "string",
      required: true,
      message: "No token provided."
    },
    password: {
      type: "string",
      required: true,
      message: "No new password provided."
    }
  },
  handler: async ({ body: { token, password }, query, uid }, { success, fail, error }) => {
    try {
      const { email, cpwtoken } = JWT.verify(token, JWT_SECRET);
      if(!email || !cpwtoken) {
        fail("Incomplete token.");
      } else {
        const ta = await db.beginTransaction();
        const { results } = await ta.query(
          "SELECT COUNT(*) AS 'count' FROM users WHERE ? AND ?",
          [{ email }, { cpwtoken }]
        );
        if(results && results.length && results[0].count) {
          // Valid, update password
          const pass = await BCrypt.hash(password, AUTH_SALT_ROUNDS);
          try {
            await ta.query("UPDATE users SET ? WHERE ?", [{ pass, cpwtoken: null }, { email }]);
            await ta.commit();
            success("Password updated.");
          } catch(err) {
            await ta.rollback();
            fail("Updating password failed.");
          }
        } else {
          await ta.rollback();
          fail("Invalid token contents.");
        }
      }
    } catch(err) {
      fail("Invalid token.");
    }
  }
});