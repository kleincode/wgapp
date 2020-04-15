/*  Handler for "/_/subscribepush". Purpose: Subscribing user to push notifications. */
const webpush = require('web-push');

webpush.setVapidDetails('mailto:dev@kleinco.de', process.env.PUSH_PUBLIC_KEY, process.env.PUSH_PRIVATE_KEY);

module.exports = ({ db }) => ({
  type: "POST",
  public: false,
  handler: async ({ body, query, uid }, { success, fail, error }) => {
    try {
      const { results } = await db.query("SELECT firstname FROM users WHERE ?", { id: uid });
      if(results.length == 0) {
        error("Error: User not found.");
      } else {
        const subscription = body, firstname = results[0].firstname;
        const payload = `Hello, ${firstname}!`;
        try {
          await webpush.sendNotification(subscription, payload);
          success("Push message sent");
        } catch(err) {
          error("Could not send push message.", err);
        }
      }
    } catch(err) {
      error("Error while fetching user data from database.", err);
    }
  }
});