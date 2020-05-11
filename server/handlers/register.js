/*  Handler for "/_/register". Purpose: Adding new user to database. */
const BCrypt = require("bcryptjs");
const AUTH_SALT_ROUNDS = parseInt(process.env.AUTH_SALT_ROUNDS) || 10;

module.exports = ({ db }) => ({
  type: "POST",
  public: true,
  body: {
    email: {
      type: "string",
      required: true,
      message: "An email is required to register."
    },
    password: {
      type: "string",
      required: true,
      message: "Please provide a password in order to register."
    },
    firstname: {
      type: "string",
      required: true,
      message: "Please tell us your first name so we can call you by it."
    },
    lastname: {
      type: "string",
      default: ""
    }
  },
  handler: async ({ body, query }, { success, fail, error }) => {
    const { email, firstname, lastname, password } = body;
    if(email.match(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)) {
      try {
        const { results: userResults } = await db.query(`SELECT COUNT(*) AS c FROM users WHERE ?`, {email: email});

        if(userResults[0].c > 0) {
          fail("This email address is already registered.", 1);
        } else try {
          //Actual register process begins here
          const hash = await BCrypt.hash(password, AUTH_SALT_ROUNDS);

          try {
            await db.query(
              "INSERT INTO `users` (`email`, `firstname`, `lastname`, `pass`) VALUES (?, ?, ?, ?)",
              [email, firstname, lastname, hash]
            );
            success(`You were successfully registered, ${firstname}.`);
          } catch(err) {
            error("The registration process failed.", 1, err);
          }
        } catch(err) {
          error("Error during encryption process.", 1, err);
        }
      } catch(err) {
        error("Error while fetching users from database.", 1, err);
      }
    } else {
      fail("The given email address is invalid.", 1);
    }
  }
});