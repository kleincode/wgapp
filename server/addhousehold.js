/*  This module accepts requests to "/_/addexpense". The following arguments are passed to the function:
    req.body    ..      JSON request body sent by client (for POST requests) OR
    req.query   ..      HTTP params sent by client (for GET requests)
    req.user    ..      Information about the user sending the request (properties: email, uid, firstname, lastname, hid)
    res         ..      Result object, used to respond to the client
    db          ..      Helper for database calls (see MySQLDatabase.js)
    */
module.exports = (db) => async (req, res) => {
    if(!req.body) {
        res.status(400).send({success: false, message: "Bad Request: Please provide a request body with valid household data."}).end();
    } else if(!req.body.hid) {
        res.status(400).send({success: false, message: "A household identifier is required."}).end();
    } else if(!req.body.sec) {
        res.status(400).send({success: false, message: "A security code."}).end();
    } else {
        const { hid, sec } = req.body;
        mysql_conn.query("SELECT id, name, type, registered FROM households WHERE id = AES_DECRYPT(UNHEX(?), ?) AND passphrase = ?", [hid, process.env.AES_HOUSEHOLD_PASSPHRASE || "9;|`eUk|$Lzo]*9J", sec], (err, res2) => {
            if(err) {
                res.status(500).send({success: false, message: `Error while looking up household in database: ${err.code}`, fatal: err.fatal}).end();
                console.log(err);
            } else if(res2.length == 0) {
                res.status(400).send({success: false, message: "The given combination of household identifier and security code is invalid. Please check your inputs."}).end();
            } else if(!req.body.confirm) {
                mysql_conn.query("SELECT households.name, households.type, households.registered FROM households JOIN users ON households.id = users.hid WHERE users.id = ?", [req.user.uid], (err, res3) => {
                    if(err) {
                        res.status(500).send({success: false, message: `Error while trying to fetch current household from database: ${err.code}`, fatal: err.fatal}).end();
                        console.log(err);
                    } else if(res3.length == 0) {
                        res.status(200).send({success: true, message: "Please confirm.", household: {name: res2[0].name, type: res2[0].type, registered: res2[0].registered}}).end();
                    } else {
                        res.status(200).send({success: true, message: "Please confirm overwriting your currently active household.", household: {name: res2[0].name, type: res2[0].type, registered: res2[0].registered}, oldHousehold: {name: res3[0].name, type: res3[0].type, registered: res3[0].registered}}).end();
                    }
                });
            } else {
                mysql_conn.query("UPDATE users SET ? WHERE ?", [{hid: res2[0].id}, {id: req.user.uid}], (err, res3) => {
                    if(err) {
                        res.status(500).send({success: false, message: `Error while assigning user to household: ${err.code}`, fatal: err.fatal}).end();
                        console.log(err);
                    } else {
                        res.status(200).send({success: true, message: "The given household was successfully assigned to you."});
                    }
                });
            }
        });
    }
};