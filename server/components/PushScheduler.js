const Schedule = require('node-schedule');
const Helpers = require("./Helpers");


module.exports = {
    registerJobs(db) {
        // demo:
        Helpers.sendNotificationToUser(db, 7, "It works!!!");
        console.log("Registering push jobs");

        let tasksPushJob = Schedule.scheduleJob("*/10 * * * * *", () => {
            //console.log("This is executed every 10 s", new Date());
        });
    }
};