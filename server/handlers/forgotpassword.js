/*  Handler for "/_/forgotpassword". Purpose: Send email with verification code to change password (used in Login). */

const { v4: uuidv4 } = require("uuid");
const JWT = require("jsonwebtoken");
const JWT_SECRET = process.env.FORGOT_PASS_SECRET || "jIiTU_#=i9:S`Deh";
const mailtext = require("../mails/forgotpassword");
const transporter = require("../components/Mailer");

module.exports = ({ db }) => ({
    type: "POST",
    public: true,
    body: {
      email: {
        type: "string",
        required: true,
        message: "Please provide an email."
      }
    },
    handler: async ({ body: { email }, query }, { success, fail, error }) => {
      try {
        const { results } = await db.query("SELECT `cpwtoken`, `firstname`, `lastname` FROM users WHERE ?", [{ email }]);
        if(results && results.length) {
          let { cpwtoken, firstname, lastname } = results[0];
          if(!cpwtoken) try {
            // Need to generate new token
            cpwtoken = uuidv4();
            await db.query("UPDATE users SET ? WHERE ?", [{ cpwtoken }, { email }]);
          } catch(err) {
            error("Error while creating unique token.", err);
            return;
          }
          // Create and send payload to e-mail address
          const token = JWT.sign({ email, cpwtoken }, JWT_SECRET, { expiresIn: "1h" });
          try {
            await transporter.sendMail({
              from: '"Jeff" <jeff@kleinco.de>', // sender address
              to: email, // list of receivers
              subject: "Reset your password", // Subject line
              html: mailtext({ firstname, lastname, email, token })
            });
            success("A password reset link was mailed to you.");
          } catch(err) {
            error("Sending e-mail failed.", err);
          }
        } else {
          fail("Unknown e-mail address.");
        }
      } catch(err) {
        error("Error while fetching e-mail from database.", err);
      }
    }
  });