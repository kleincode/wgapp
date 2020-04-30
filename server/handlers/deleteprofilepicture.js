/*  Handler for "/_/deleteprofilepicture". Purpose: Delete profile picture in users table */
const Helpers = require("../components/Helpers");
const fs = require("fs");
const path = require("path");

const receiptFolder = path.join(__dirname, "..", "images", "profile");

module.exports = ({ db }) => ({
  type: "POST",
  public: false,
  handler: async ({ body, query, uid }, { success, fail, error }) => {
    const hid = await Helpers.fetchHouseholdID(db, uid);
    if(hid) {
      try {
        const { results: { affectedRows, changedRows } } = await db.query(
          "UPDATE users SET image = ? WHERE id = ? AND hid = ?",
          [false, uid, hid]
        );
        if(affectedRows == 0) {
          fail("You do not have permission to perform this operation.");
        } else if(changedRows == 0) {
          success("No changes made.");
        } else {
          fs.unlink(path.join(receiptFolder, `${uid}.jpg`), err => {
            if(err) console.warn(err);
          });
          success("Receipt deleted.");
        }
      } catch (err) {
        error("Error while deleting receipt in database.", err);
      }
    } else {
      fail("Please join a household to use this feature.");
    }
  }
});