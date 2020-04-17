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
    const hid = await Helpers.fetchHouseholdID(db, uid);
    if (hid) {
      const { results } = await db.query(
        "SELECT receipt FROM finances WHERE id = ? AND hid = ?",
        [query.fid, hid]
      );
      if(results.length == 0) {
        fail("You don't have permission to view this image.");
      } else if(!results[0].receipt) {
        success("No receipt.");
      } else {
        res.sendFile(path.join(receiptFolder, `${query.fid}.jpg`));
      }
    } else {
      fail("Please join a household to use this feature.");
    }
  }
});