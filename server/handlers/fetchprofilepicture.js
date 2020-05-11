/*  Handler for "/_/fetchprofilepicture". Purpose: Fetching profile picture for avatars. */
const path = require("path");
const Helpers = require("../components/Helpers");

const picturesFolder = path.join(__dirname, "..", "images", "profile");

module.exports = ({ db }) => ({
  type: "GET",
  public: false,
  params: {
    selUid: {
      type: "int",
      unsigned: true,
      default: -1
    }
  },
  handler: async ({ body, query, uid }, { success, fail, error, res }) => {
    try {
      const hid = await Helpers.fetchHouseholdID(db, uid);
      const { selUid } = query;
      let id = 0;
      if (selUid == -1) {
        id = uid;
      } else {
        id = selUid;
      }
      const { results } = await db.query(
        "SELECT image FROM users WHERE id = ? AND hid = ?",
        [id, hid]
      );
      if (results.length == 0) {
        fail("No user found with id " + id + ".", 1);
      } else if (!results[0].image) {
        success("No profile picture.");
      } else {
        res.sendFile(path.join(picturesFolder, `${id}.jpg`), {}, (err) => {
          Helpers.pushLog({db}, 0, 0, "fetchprofilepicture", "Error fetching profile picture for " + uid + " in " + hid + " for selUid " + selUid, err);
        }).end();
      }
    } catch (err) {
      error("Error fetching profile picture", 1);
    }
  }
});