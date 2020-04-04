/*  This module accepts requests to "/_/addexpense". The following arguments are passed to the function:
    req.body    ..      JSON request body sent by client OR
    req.query   ..      HTTP params sent by client
    req.user    ..      Information about the user sending the request (properties: email, uid, firstname, lastname, hid)
    res         ..      Result object, used to respond to the client
    mysql_conn  ..      MySQL connection (see mysql package)
    */
module.exports = (req, res) => {

    if (!req.body) {
        res.status(200).send({ success: false, message: "Bad Request: Please provide a request body with valid household data." }).end();
    } else if (!req.body.name) {
        res.status(200).send({ success: false, message: "Bad Request: A task name needs to be specified." }).end();
    } else {
        let genDate = new Date();
        let name = req.body.name,
            icon = parseInt(req.body.icon) || 0,
            iteratingMode = parseInt(req.body.iterating) || 1,
            assignedMember = parseInt(req.body.assignedMember) || req.user.uid,
            repetitionDays = req.body.chosenDays || ["monday"],
            repetitionEvery = parseInt(req.body.repetitionEvery) || 1,
            repetitionUnit = parseInt(req.body.repetition_unit) || 0, //0=week, 1=month
            reminder = req.body.reminder || true, //1=activated
            time = req.body.time || genDate.getHours() + ":" + genDate.getMinutes() + ":" + genDate.getSeconds(),
            date = req.body.date || genDate.getFullYear() + "." + genDate.getMonth() + "." + genDate.getDay();

        if (isNaN(uid) || uid < 0) res.status(200).send({ success: false, message: "Invalid user id." }).end();
        else if (isNaN(icon)) res.status(200).send({ success: false, message: "Invalid icon." }).end();
        else if (isNaN(iteratingMode)) res.status(200).send({ success: false, message: "Invalid iterating mode." }).end();
        else if (isNaN(repetitionEvery)) res.status(200).send({ success: false, message: "Invalid definition of repetition every." }).end();
        else {
            mysql_conn.query("SELECT COUNT(*) AS 'c' FROM users WHERE id = ? AND hid = ?", [req.user.uid, req.user.hid], (err, res2) => {
                if (err) {
                    res.status(500).send({ success: false, message: "Error while fetching specified user from database." }).end();
                } else if (res2[0].c < 1) {
                    res.status(200).send({ success: false, message: "The specifed user does not exist or does not belong to this household." }).end();
                } else {
                    mysql_conn.query("INSERT INTO tasks (hid, name, icon, iteratingMode, assignedMember, repetitionDays, repetitionEvery, repetitionUnit, reminder, time, startDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [req.user.hid, name, icon, iteratingMode, assignedMember, JSON.stringify(repetitionDays), repetitionEvery, repetitionUnit, reminder, time, date], (err, res3 => {
                        if (err) {
                            res.status(200).send({ success: false, message: "Error while inserting task into database." }).end();
                        } else {
                            res.status(200).send({ success: true, message: "Task inserted successfully." }).end();
                        }
                    }));
                }
            });
        }
    }

};