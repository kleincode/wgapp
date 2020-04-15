/*  Handler for "/_/unsubscribepush". Purpose: Unsubscribing from push notifications (i.e. removing references to subscription from database). */

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
      const { endpoint, p256dh, auth } = body;
      const { results: { affectedRows } } = await db.query(
        "DELETE FROM pushclients WHERE ? AND ? AND ? AND ?",
        [{ uid }, { endpoint }, { p256dh }, { auth }]
      );
      if(affectedRows < 1) {
        fail("Invalid subscription credentials.");
      } else {
        success("Unsubscribed.");
      }
    } catch(err) {
      error("Error while removing entry from database.", err);
    }
  }
});