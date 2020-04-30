/*  Handler for "/_/updateprofile". Purpose: Updating profile and password. */
const BCrypt = require("bcryptjs");
const AUTH_SALT_ROUNDS = parseInt(process.env.AUTH_SALT_ROUNDS) || 10;

module.exports = ({ db }) => ({
  type: "POST",
  public: false,
  body: {
    firstName: {
      type: "string",
      default: ""
    },
    lastName: {
        type: "string",
        default: ""
    },
    nickname: {
      type: "string",
      default: ""
    },
    mail: {
      type: "string",
      default: ""
    },
    password: {
      type: "string",
      default: ""
    },
    newPassword: {
      type: "string",
      default: ""
    }
  },
  handler: async ({ body, query, uid }, { success, fail, error }) => {
      try {
        if (body.password != "") {
          //update password
          const { results } = await db.query("SELECT pass FROM users WHERE ?", { id: uid });
          if (results.length == 1) {
            const { pass } = results[0];
            const bcryptResult = await BCrypt.compare(body.password, pass);
            if(bcryptResult) {
              const hash = await BCrypt.hash(body.newPassword, AUTH_SALT_ROUNDS);
              const { results: passResults } = await db.query("UPDATE users SET pass = ? WHERE id = ?", [hash, uid]);
              if (passResults.changedRows != 1) {
                fail("Couldn't update password");
              }
            } else {
              fail("The entered old password is incorrect.");
            }
          } else {
            error("Couldn't find user.");
          }
        }
      } catch (err) {
        error("Error while updating password.", err);
      }
      try {
      let query = "UPDATE users SET ";
      let params = [];
      if (body.firstName != "") {
        query += "firstname = ?, ";
        params.push(body.firstName);
      }
      if (body.lastName != "") {
        query += "lastname = ?, ";
        params.push(body.lastName);
      }
      if (body.nickname != "") {
        query += "nickname = ?, ";
        params.push(body.nickname);
      }
      if (body.mail != "" && body.mail.match(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)) {
        query += "email = ?, ";
        params.push(body.mail);
      }
      if (params.length > 0) {
        query = query.substr(0,query.length - 2);
        query += "WHERE id = ?";
        params.push(uid);
        const { results: results2 } = await db.query(query, params);
        if (results2.affectedRows == 1) {
          success("Successfully updated profile");
        } else {
          fail("Couldn't find user in db");
        }
      } else {
        fail("Nothing updated bc nothing provided");
      }
    } catch (err) {
      error("Error while updating user profile.", err);
    }
  }
});