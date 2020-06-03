const Schedule = require('node-schedule');
const Helpers = require("./Helpers");


module.exports = {
  initTimer(db) {
    Helpers.pushLog({db}, 2, 0, "Server", "Initizalizing log cleanup");
    let cleanupLog = Schedule.scheduleJob("*/10 * *", async () => {
      try {
        await db.query("DELETE FROM `log` WHERE CAST(`date` as date) < NOW() - INTERVAL 2 DAY");
        const {results} = await db.query("SELECT COUNT(*) as 'c' from log");
        console.log("Successfully cleaned up");
        if (results[0].c > 300) {
          console.log("Attention! Rising error count");
          Helpers.sendNotificationToUser(db, 7, "Attention! Rising error count");
          Helpers.sendNotificationToUser(db, 8, "Attention! Rising error count");
        }
        Helpers.pushLog({db}, 2, 0, "Server", "Successfully cleaned log up (I'm the real deal)");
      } catch (err) {
        Helpers.pushLog({db}, 0, 0, "Server", "Error cleaning up the log", err);
      }
    });
  }
};