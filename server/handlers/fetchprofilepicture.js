/*  Handler for "/_/fetchprofilepicture". Purpose: Fetching profile picture for avatars. */
const path = require("path");
const Helpers = require("../components/Helpers");

const picturesFolder = path.join(__dirname, "..", "images", "profile");

module.exports = ({ db }) => ({
  type: "GET",
  public: false,
  handler: async ({ query, uid }, { success, fail, error, res }) => {
    const hid = await Helpers.fetchHouseholdID(db, uid);
    const { results } = await db.query(
      "SELECT image FROM users WHERE id = ? AND hid = ?",
      [uid, hid]
    );
    console.log(results);
    if(results.length == 0) {
      error("No user found.");
    } else if(!results[0].image) {
      success("No profile picture.");
    } else {
      res.sendFile(path.join(picturesFolder, `${uid}.jpg`));
    }
  }
});