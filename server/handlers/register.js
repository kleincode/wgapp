/*  Handler for "/_/register". Purpose: Adding new user to database and sending an verification email. */
const BCrypt = require("bcryptjs");
const AUTH_SALT_ROUNDS = parseInt(process.env.AUTH_SALT_ROUNDS) || 10;
const { v4: uuidv4 } = require("uuid");
const JWT = require("jsonwebtoken");
const JWT_SECRET = process.env.FORGOT_PASS_SECRET || "jIiTU_#=i9:S`Deh";
const mailtext = require("../mails/verifyemail");
const transporter = require("../components/Mailer");

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
      const ta = await db.beginTransaction();
      try {
        const { results: userResults } = await ta.query(`SELECT COUNT(*) AS c FROM users WHERE ?`, {email: email});

        if(userResults[0].c > 0) {
          await ta.rollback();
          fail("This email address is already registered.");
        } else try {
          //Actual register process begins here
          const hash = await BCrypt.hash(password, AUTH_SALT_ROUNDS);

          try {
            const { results: { insertId: uid } } = await ta.query(
              "INSERT INTO `users` (`email`, `firstname`, `lastname`, `pass`) VALUES (?, ?, ?, ?)",
              [email, firstname, lastname, hash]
            );
            if(!uid) throw `UID of inserted user is falsy (${uid})`;
            // Email verification
            try {
              // Generate and insert verification token
              const cpwtoken = uuidv4();
              await ta.query("INSERT INTO usertokens (`uid`, `type`, `token`) VALUES (?, ?, ?)", [ uid, "verify", cpwtoken]);
              // Create and send payload to e-mail address
              const token = JWT.sign({ email, cpwtoken }, JWT_SECRET, { expiresIn: "3d" });
              try {
                await transporter.sendMail({
                  from: '"Jeff" <jeff@kleinco.de>', // sender address
                  to: "f.kleinst10810@gmail.com" || email, // list of receivers
                  subject: "Verify your email", // Subject line
                  html: mailtext({ firstname, lastname, email, token })
                });
                await ta.commit();
                success(`You were successfully registered, ${firstname}. Please check your mail box.`);
              } catch(err) {
                await ta.rollback();
                error("Could not send verification email. Please check your email address.", err);
              }
            } catch(err) {
              await ta.rollback();
              error("Error while creating verification token. Registration process cancelled.", err);
            }
          } catch(err) {
            await ta.rollback();
            error("The registration process failed.", err);
          }
        } catch(err) {
          await ta.rollback();
          error("Error during encryption process.", err);
        }
      } catch(err) {
        await ta.rollback();
        error("Error while fetching users from database.", err);
      }
    } else {
      fail("The given email address is invalid.");
    }
  }
});