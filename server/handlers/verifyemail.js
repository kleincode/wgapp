/*  Handler for "/_/verifyemail". Purpose: Checking jwt token for validity and marking user email as verified. */

const JWT = require("jsonwebtoken");
const JWT_SECRET = process.env.FORGOT_PASS_SECRET || "jIiTU_#=i9:S`Deh";

module.exports = ({ db }) => ({
  type: "POST",
  public: true,
  body: {
    token: {
      type: "string",
      required: true,
      message: "Please provide a security token."
    }
  },
  handler: async ({ body, query, uid }, { success, fail, error }) => {
    try {
      const { email, cpwtoken } = JWT.verify(body.token, JWT_SECRET);
      if(!email || !cpwtoken) {
        fail("Incomplete token.");
      } else {
        const ta = await db.beginTransaction();
        const { results: { affectedRows, changedRows } } = await ta.query(
          "UPDATE users JOIN usertokens ON users.`id` = usertokens.`uid` SET users.`verified` = 1 WHERE `usertokens`.`token` = ? AND `usertokens`.`type` = ? AND `users`.`email` = ?",
          [cpwtoken, "verify", email]
        );
        if(!affectedRows) {
          await ta.rollback();
          fail("Invalid or expired token content.");
        } else {
          await ta.query("DELETE FROM `usertokens` WHERE ?", [{ token: cpwtoken }])
          await ta.commit();
          if(changedRows) success("Email verified");
          else success("Email already verified");
        }
      }
    } catch(err) {
      fail("Invalid or expired token.");
    }
  }
});