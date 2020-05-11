/*  Handler for "/_/deleteaccount". Purpose: Deleting user account with all related data. */
const Helpers = require("../components/Helpers");
const fs = require("fs");
const path = require("path");
const profileFolder = path.join(__dirname, "..", "images", "profile");

module.exports = ({ db }) => ({
    type: "POST",
    public: false,
    handler: async ({ uid }, { success, fail, error }) => {
      try {
        const requestHid = await Helpers.fetchHouseholdID(db, uid);
        fs.unlink(path.join(profileFolder, `${uid}.jpg`), () => {});
        try {
          const { results: { affectedRows } } = await db.query(
            "DELETE FROM users WHERE id = ? AND hid = ?",
            [uid, requestHid]
          );
          if (affectedRows == 0) {
            fail("Couldn't find user for delete.", 1);
          } else {
            success("Successfully delete account.");
          }
        } catch (err) {
          error("Error while deleting account in database.", 1, err);
        }
      } catch (err) {
        error("Error while fetching hid from database.", 0, err);
      }
    }
  });