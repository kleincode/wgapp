/*  Handler for "/_/login". Purpose: Logging in. */
const BCrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const JWT_SECRET = process.env.AUTH_TOKEN_SECRET || "[%N[ED0pGs&3QApB";

module.exports = ({ db }) => ({
  type: "POST",
  public: true,
  body: {
    email: {
      type: "string",
      required: true,
      message: "An email is required to log in."
    },
    password: {
      type: "string",
      required: true,
      message: "Please provide a password in order to log in."
    }
  },
  handler: async ({ body, query }, { success, fail, error }) => {
    const { email: providedEmail, password: providedPassword } = body;
    try {
      const { results } = await db.query("SELECT id AS uid, pass FROM users WHERE ?", { email: providedEmail });

      if (!results || results.length == 0) {
        fail("The given combination of email and password is incorrect.", 1);
      } else {
        const { uid, pass } = results[0];
        try {
          const bcryptResult = await BCrypt.compare(providedPassword, pass);
          if(bcryptResult) {
            const token = JWT.sign({ uid }, JWT_SECRET);
            success({ message: "You were successfully logged in.", uid, providedEmail, token });
          } else {
            fail("The given combination of email and password is incorrect.", 1);
          }
        } catch(err) {
          error("Error during encryption process.", 1, err);
        }
      }
    } catch (err) {
      error("Error while fetching user data.", 1, err);
    }
  }
});