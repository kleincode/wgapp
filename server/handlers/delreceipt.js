/*  Handler for "/_/deletereceipt". Purpose: Delete receipt in finances table */
const Helpers = require("../components/Helpers");
const fs = require("fs");
const path = require("path");

const receiptFolder = path.join(__dirname, "..", "images", "receipts");

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
    const hid = await Helpers.fetchHouseholdID(db, uid);
    if(hid) {
      try {
        const { results: { affectedRows, changedRows } } = await db.query(
          "UPDATE finances SET receipt = ? WHERE id = ? AND hid = ?",
          [false, body.fid, hid]
        );
        if(affectedRows == 0) {
          fail("You do not have permission to perform this operation.", 4);
        } else if(changedRows == 0) {
          success("No changes made.");
        } else {
          fs.unlink(path.join(receiptFolder, `${body.fid}.jpg`), err => {
            if(err) {
              Helpers.pushLog({db}, 0, 4, "delreceipt", "Error deleting receipt.", { body, query, uid });
            }
          });
          success("Receipt deleted.");
        }
      } catch (err) {
        error("Error while deleting receipt in database.", 4, err);
      }
    } else {
      fail("Please join a household to use this feature.", 0);
    }
  }
});