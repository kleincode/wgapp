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
  handler: async ({ body, query, user }, { success, fail, error }) => {
    const { email: providedEmail, password: providedPassword } = body;
    try {
      const { results } = await db.query("SELECT id AS uid, email, firstname, lastname, pass, hid FROM users WHERE ?", { email: providedEmail });

      if (!results || results.length == 0) {
        fail("The given combination of email and password is incorrect.");
      } else {
        const { uid, email, firstname, lastname, pass, hid } = results[0];
        try {
          const bcryptResult = await BCrypt.compare(providedPassword, pass);
          if(bcryptResult) {
            const token = JWT.sign({ uid, email, firstname, lastname, hid }, JWT_SECRET);
            success({ message: "You were successfully logged in.", email, token });
          } else {
            fail("The given combination of email and password is incorrect.");
          }
        } catch(err) {
          error("Error during encryption process.", err);
        }
      }
    } catch (err) {
      error("Error while fetching user data.", err);
    }
  }
});