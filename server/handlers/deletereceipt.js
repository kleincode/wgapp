/*  Handler for "/_/deletereceipt". Purpose: Delete receipt in finances table */
const Helpers = require("../components/Helpers");
const fs = require('fs')

module.exports = ({ db }) => ({
  type: "POST",
  public: false,
  body: {
    // expense id in finances table
    fid: {
      type: "int",
      unsigned: true,
      required: true,
      message: "Please provide an expense id."
    }
  },
  handler: async ({ body, query, uid }, { success, fail, error }) => {
    try {
      const hid = await Helpers.fetchHouseholdID(db, uid);
      try {
        const { results } = await db.query(
          "SELECT receipt FROM finances WHERE id = ? AND hid = ?",
          [body.fid, hid]
        );
        if (results.length == 0) {
          fail("You have no permission to edit this expense or the expense doesn't exist.");
        } else if (results[0].receipt == '') {
          success("No receipt uploaded. Nothing to do.");
        } else {
          try {
            try {
              await db.query(
                "UPDATE finances SET receipt = ? WHERE id = ?",
                ["", body.fid]
              );
            } catch (err) {
              error("Error while deleting receipt in database.", err);
            }
            fs.unlinkSync("./images/receipts/" + results[0].receipt);
            success("Successfully deleted receipt.");
          } catch(err) {
            error("Error while deleting receipt in folder.", err);
            console.error(err);
          }
        }
      } catch (err) {
        error("Error while deleting receipt in database.", err);
      }

    } catch (err) {
      error("Error while fetching specified user from database.", err);
    }
  }
});