/*  Handler for "/_/uploadreceipt". Purpose: Uploading receipt image file. */
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const receiptFolder = path.join(__dirname, "..", "images", "receipts");

fs.mkdir(receiptFolder, { recursive: true }, err => {
  if(err) console.error(err);
  else console.log("Created receipt folder");
});

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './images/receipts');
  },
  filename: (req, file, callback) => {
    console.log(req.body);
    console.log(file);
    callback(null, req.body.fid + ".jpg");
  }
});

const limits = {
  fileSize: 5368709120 // maximum file size: 5 MB
};

const fileFilter = (req, file, cb) => {
  if(file.mimetype == "image/jpeg") {
    cb(null, true); // accept file
  } else {
    cb(new Error("Only jpeg files are accepted."));
  }
};

const upload = multer({ storage, limits, fileFilter }).single('receiptPicture');

module.exports = ({ db }) => ({
  type: "POST",
  public: false,
  handler: async (req, { success, fail, error, res }) => {
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