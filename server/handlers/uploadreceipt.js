/*  Handler for "/_/uploadreceipt". Purpose: Uploading receipt image file. */
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Helpers = require("../components/Helpers");

const receiptFolder = path.join(__dirname, "..", "images", "receipts");

fs.mkdir(receiptFolder, { recursive: true }, err => {
  if(err) console.error("Error creating receipt folder.", err);
  else console.log("Created receipt folder.");
});

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './images/receipts');
  },
  filename: (req, file, callback) => {
    callback(null, req.body.fid + ".jpg");
  }
});

const limits = {
  fileSize: 5368709120 // maximum file size: 5 MB
};

let dbInstance;

const fileFilter = async (req, file, cb) => {
  if(file.mimetype == "image/jpeg") {
    const hid = await Helpers.fetchHouseholdID(dbInstance, req.uid);
    if(hid) {
      const { results: { affectedRows } } = await dbInstance.query(
        "UPDATE finances SET ? WHERE ? AND ?",
        [{receipt: true}, { id: parseInt(req.body.fid) }, { hid }]
      );
      if(affectedRows == 0) {
        cb(new Error("Invalid expense id."));
      } else {
        cb(null, true); //accept
      }
    } else {
      cb(new Error("Please join a household to use this feature."));
    }
  } else {
    // do not accept non-jpeg files
    cb(new Error("Only jpeg files are accepted."));
  }
};

const upload = multer({ storage, limits, fileFilter }).single('receiptPicture');

module.exports = ({ db }) => ({
  type: "POST",
  public: false,
  handler: async (req, { success, fail, error, res }) => {
    dbInstance = db;
    upload(req, res, (err) => {
      if(err) {
        fail(err.message);
        console.info(err);
      } else {
        success("File uploaded.");
      }
    });
  }
});