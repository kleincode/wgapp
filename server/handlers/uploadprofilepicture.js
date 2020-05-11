/*  Handler for "/_/uploadprofilepicture". Purpose: Uploading profile image file. */
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Helpers = require("../components/Helpers");

const profileFolder = path.join(__dirname, "..", "images", "profile");

fs.mkdir(profileFolder, { recursive: true }, err => {
  if(err) Helpers.pushLog(dbInstance, 0, 0, "Server", "Error creating profile folder.", err);
  else Helpers.pushLog(dbInstance, 2, 0, "Server", "Created profile folder.");
});

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './images/profile');
  },
  filename: (req, file, callback) => {
    callback(null, req.uid + ".jpg");
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
        "UPDATE users SET ? WHERE ? AND ?",
        [{image: true}, { id: req.uid }, { hid }]
      );
      if(affectedRows == 0) {
        cb(new Error("Invalid uid id."));
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

const upload = multer({ storage, limits, fileFilter }).single('profilePicture');

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