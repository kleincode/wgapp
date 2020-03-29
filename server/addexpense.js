/*  This module accepts requests to "/_/addexpense". The following arguments are passed to the function:
    req.body    ..      JSON request body sent by client OR
    req.query   ..      HTTP params sent by client
    req.user    ..      Information about the user sending the request (properties: email, uid, firstname, lastname, hid)
    res         ..      Result object, used to respond to the client
    mysql_conn  ..      MySQL connection (see mysql package)
    */
module.exports = (req, res) => {

    if(!req.body) {
        res.status(400).send({success: false, message: "Bad Request: Please provide a request body with valid household data."}).end();
    } else if(!req.body.uid) {
        res.status(400).send({success: false, message: "A household member who made the expense needs to be specified."}).end();
    } else if(!req.body.amount) {
        res.status(400).send({success: false, message: "An expense amount is required."}).end();
    } else {
        let uid = parseInt(req.body.uid), amount = parseInt(req.body.amount), description = req.body.description || "";
        if(isNaN(uid) || uid < 0) res.status(400).send({success: false, message: "Invalid user id."}).end();
        else if(isNaN(amount)) res.status(400).send({success: false, message: "Invalid expense amount."}).end();
        else {
            mysql_conn.query("SELECT COUNT(*) AS 'c' FROM users WHERE id = ? AND hid = ?", [uid, req.user.hid], (err, res2) => {
                if(err) {
                    res.status(500).send({success: false, message: "Error while fetching specified user from database."}).end();
                } else if(res2[0].c < 1) {
                    res.status(400).send({success: false, message: "The specifed user does not exist or does not belong to this household."}).end();
                } else {
                    mysql_conn.query("INSERT INTO finances (hid, uid, description, amount) VALUES (?, ?, ?, ?)", [req.user.hid, uid, description, amount], (err, res3 => {
                        if(err) {
                            res.status(500).send({success: false, message: "Error while inserting expense into database."}).end();
                        } else {
                            res.status(200).send({success: true, message: "Expense inserted successfully."}).end();
                        }
                    }));
                }
            });
        }
    }

};