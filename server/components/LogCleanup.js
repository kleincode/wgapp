const Schedule = require('node-schedule');
const Helpers = require("./Helpers");


module.exports = {
  initTimer(db) {
    Helpers.pushLog(db, 2, 0, "Server", "Initizalizing log cleanup");
    let cleanupLog = Schedule.scheduleJob("* * *", async () => {
      try {
        await db.query("DELETE FROM log WHERE date < NOW() - INTERVAL 2 DAY");
        Helpers.pushLog(db, 2, 0, "Server", "Successfully cleaned log up");
      } catch (err) {
        Helpers.pushLog(db, 0, 0, "Server", "Error cleaning up the log", err);
      }
    });
  }
};