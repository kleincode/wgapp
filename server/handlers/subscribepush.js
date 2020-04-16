/*  Handler for "/_/subscribepush". Purpose: Subscribing user to push notifications. */
const Helpers = require("../components/Helpers");

module.exports = ({ db }) => ({
  type: "POST",
  public: false,
  body: {
    endpoint: {
      type: "string",
      required: true,
      maxlength: 512
    },
    p256dh: {
      type: "string",
      required: true,
      maxlength: 128
    },
    auth: {
      type: "string",
      required: true,
      maxlength: 128
    }
  },
  handler: async ({ body, query, uid }, { success, fail, error }) => {
    try {
      const { results } = await db.query("SELECT firstname, lastname FROM users WHERE ?", { id: uid });
      if(results.length == 0) {
        error("Error: User not found.");
      } else {
        const { endpoint, p256dh, auth } = body;
        const subscription = {
          endpoint,
          keys: {
            p256dh,
            auth
          }
        };
        const payload = `Push notifications enabled for ${results[0].firstname} ${results[0].lastname}.`;
        try {
          await Helpers.sendNotification(subscription, payload);
          try {
            await db.query(
              "INSERT INTO pushclients (`uid`, `endpoint`, `p256dh`, `auth`) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE ?",
              [uid, endpoint, p256dh, auth, { p256dh, auth }]
            );
            success("Push notifications setup.");
          } catch(err) {
            fail("Failed.");
          }
        } catch(err) {
          if(err.statusCode == 410) fail("Subscription expired.");
          else error("Error while sending test notification.", err);
        }
      }
    } catch(err) {
      error("Error while fetching user data from database.", err);
    }
  }
});