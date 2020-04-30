const Schedule = require('node-schedule');
const Helpers = require("./Helpers");


module.exports = {
  registerJobs(db) {
    //Helpers.sendNotificationToUser(db, 7, "It works!!!");
    console.log("Registering push jobs");

    let tasksPushJob = Schedule.scheduleJob("* * * * *", async () => {
      try {
        let curTime = new Date();
        let max = new Date(curTime);
        max.setMinutes(max.getMinutes() + 1);
        const { results } = await db.query("SELECT assignedMember, name FROM tasks WHERE due BETWEEN ? AND ?", [curTime.toISOString().replace("T", " ").substr(0, 19), max.toISOString().replace("T", " ").substr(0, 19)]);
        results.forEach(result => {
          if (result.reminder == 1) {
            Helpers.sendNotificationToUser(db, parseInt(result.assignedMember), "Upcoming Task: " + result.name);
          }
        });
      } catch (err) {
        console.error("Error during push job setup", err);
      }
    });
  }
};