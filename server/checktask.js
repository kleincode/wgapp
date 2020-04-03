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
    } else if (!req.body.id) {
        res.status(200).send({ success: false, message: "Bad Request: A task id needs to be specified." }).end();
    } else {
        let id = parseInt(req.body.id);
        if (isNaN(id)) res.status(200).send({ success: false, message: "Invalid task id." }).end();
        else {
            mysql_conn.query("SELECT COUNT(*) AS 'c' FROM tasks WHERE id = ? AND hid = ?", [id, req.user.hid], (err, res2) => {
                if (err) {
                    res.status(500).send({ success: false, message: "Error while fetching specified user from database." }).end();
                } else if (res2[0].c < 1) {
                    res.status(200).send({ success: false, message: "The specifed task does not exist or does not belong to this household." }).end();
                } else {
                    mysql_conn.query("UPDATE tasks SET lastExecution = ? WHERE id = ?", [new Date(), id], (err, res3 => {
                        if (err) {
                            res.status(200).send({ success: false, message: "Error while inserting task into database." }).end();
                        } else {
                            res.status(200).send({ success: true, message: "Task updated successfully at id " + id + "." }).end();
                        }
                    }));
                }
            });
        }
    }

};