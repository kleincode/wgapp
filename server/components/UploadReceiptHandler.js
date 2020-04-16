const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './receipts');
  },
  filename: (req, file, callback) => {
    console.log(req.body);
    callback(null, req.body.fid + path.extname(file.originalname).toLowerCase());
  }
});
const upload = multer({ storage: storage }).single('receiptPicture');

module.exports = {
  registerHandler: (app) => {
    app.post('/_/uploadreceipt', (req, res) => {
      upload(req, res, (err) => {
        if (err) {
          return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
      });
    });
  }
}