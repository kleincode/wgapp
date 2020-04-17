
module.exports = {
  registerHandler: (app) => {
    app.post('/_/fetchreceipt', async (req, res) => {
      const { results } = await db.query(
        "SELECT receipt FROM finances WHERE id = ? AND hid = ?",
        [body.fid, hid]
      );
      if (results[0].receipt = "") {
        return res.end("No receipt in database");
      }
      res.sendFile("./images/receipts/" + results[0].receipt);
      if (err) {
        return res.end("Error fetching file.");
      }
      res.end("File fetched");
    });
  }
}