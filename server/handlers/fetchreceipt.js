/*  Handler for "/_/fetchreceipt". Purpose: Uploading receipt image file. */
const multer = require("multer");
const path = require("path");
const Helpers = require("../components/Helpers");

const receiptFolder = path.join(__dirname, "..", "images", "receipts");

module.exports = ({ db }) => ({
  type: "GET",
  public: false,
  params: {
    fid: {
      required: true,
      type: "int",
      unsigned: true,
      message: "No expense id provided."
    }
  },
  handler: async ({ body, query, uid }, { success, fail, error, res }) => {
    try {
      const hid = await Helpers.fetchHouseholdID(db, uid);
      if (hid) {
        try {
          const { results } = await db.query(
            "SELECT receipt FROM finances WHERE id = ? AND hid = ?",
            [query.fid, hid]
          );
          if (results.length == 0) {
            fail("You don't have permissions to view this image.", 1);
          } else if (!results[0].receipt) {
            success("No receipt.");
          } else {
            res.sendFile(path.join(receiptFolder, `${query.fid}.jpg`), err =>{
              Helpers.pushLog({db}, 4, 0, "Server", "Error sending receipt. Image missing.");
              error("Error while fetching receipt.", 4, err);
            });
          }
        } catch (err) {
          error("Error while fetching receipt.", 4, err);
        }
      } else {
        fail("Please join a household to use this feature.", 0);
      }
    } catch (err) {
      error("Error while fetching hid from database.", 0, err);
    }
  }
});