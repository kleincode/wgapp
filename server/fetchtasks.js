/*  This module accepts requests to "/_/fetchfinances". The following arguments are passed to the function:
    req.body    ..      JSON request body sent by client
    req.user    ..      Information about the user sending the request (properties: email, uid, firstname, lastname, hid)
    res         ..      Result object, used to respond to the client
    mysql_conn  ..      MySQL connection (see mysql package)
    */
module.exports = (req, res) => {

    if (req.user.hid) {

        mysql_conn.query(`SELECT 
            id,
            name,
            icon,
            iteratingMode,
            assignedMember, 
            repetitionDays, 
            repetitionEvery,
            repetitionUnit,
            reminder, 
            time, 
            startDate,
            lastExecution
            FROM tasks WHERE hid = ?`, [req.user.hid], (err, res2) => {
            if (err) {
                res.status(500).send({ success: false, message: "Error while fetching tasks from database." }).end();
                console.log(err);
            } else {
                res2.forEach((elem) => {
                    elem.repetitionDays = JSON.parse(elem.repetitionDays);
                });
                res.status(200).send({success:true, message: "Tasks received", data: res2}).end();
            }
        });
    } else {
        res.status(200).send({ success: false, message: "Please join a household to use this feature." }).end();
    }

};