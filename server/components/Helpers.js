const webpush = require('web-push');

const Helpers = {};

Helpers.copyKeysIfPresent = (from, keys) => {
  let filteredKeys = keys.filter((key) => key in from),
    obj = {};
  filteredKeys.forEach(key => obj[key] = from[key]);
  return obj;
};

Helpers.isObjectEmpty = (arr) => Object.keys(arr).length === 0;

Helpers.fetchHouseholdID = async (db, uid) => {
  const { results } = await db.query("SELECT hid FROM users WHERE ?", [{id: uid}]);
  if(results.length == 0) return null;
  else return results[0].hid;
};

Helpers.sendNotification = (subscription, payload) => {
  if(typeof payload === "string") payload = { text: payload };
  if(typeof payload === "object") payload = JSON.stringify(payload);
  return webpush.sendNotification(subscription, payload);
};

Helpers.sendNotificationToUser = async (db, uid, payload) => {
  if(typeof payload === "string") payload = { text: payload };
  if(typeof payload === "object") payload = JSON.stringify(payload);
  const { results } = await db.query("SELECT `endpoint`, `p256dh`, `auth` FROM pushclients WHERE ?", [{ uid }]);
  if(results && results.length) {
    for({ endpoint, p256dh, auth } of results) {
      try {
        await webpush.sendNotification({
          endpoint,
          keys: {
            p256dh,
            auth
          }
        }, payload);
      } catch(err) {
        if(err.statusCode == 410) {
          // Unsubscribed
          try {
            await db.query("DELETE FROM pushclients WHERE ?", [{ endpoint }]);
            Helpers.pushLog({db}, 3, 0, "Notification Server", "Subscription at", endpoint, "user", uid, "was deleted automatically because of inactivity.");
          } catch(err) {
            Helpers.pushLog({db}, 0, 0, "Notification Server", "Subscription at", endpoint, "is gone but could not be deleted in database.", err);
          }
        } else {
          Helpers.pushLog({db}, 0, 0, "Notification Server", "Subscription at", endpoint, "Endpoint at", endpoint, "rejected push.", err);
        }
      }
    }
  }
};


Helpers.pushLog = async ({ db }, level, category, handlerName, message, stacktrace, req) => {
  if (!message) {
    message = handlerName;
  }
  try {
    if (!stacktrace) {
      stacktrace = "";
    }
    if (!req) {
      req = {};
    }
    const {body, query} = req;
    const { results: { affectedRows } } = await db.query(
      "INSERT INTO log (level, category, handlername, message, stacktrace, req) VALUES (?, ?, ?, ?, ?, ?)",
      [level, category, handlerName, message.toString(), stacktrace.toString(), JSON.stringify({body, query})]
    );
    if (affectedRows != 1) {
      console.warn("WARN in pushLog: Couldn't push log for " + message + " by " + handlerName + ": " + stacktrace);
    }
  } catch (err) {
    console.error("FATAL ERROR in pushLog: " + err);
  }
};

module.exports = Helpers;