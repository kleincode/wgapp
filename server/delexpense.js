/*  This module accepts requests to "/_/delexpense". The following arguments are passed to the function:
    req.body    ..      JSON request body sent by client OR
    req.query   ..      HTTP params sent by client
    req.user    ..      Information about the user sending the request (properties: email, uid, firstname, lastname, hid)
    res         ..      Result object, used to respond to the client
    mysql_conn  ..      MySQL connection (see mysql package)
    */
module.exports = (req, res) => {

    if(!req.body) {
        res.status(400).send({success: false, message: "Bad Request: Please provide a request body with valid household data."}).end();
    } else if(!req.body.id) {
        res.status(400).send({success: false, message: "No expense id specified."}).end();
    } else {
        let id = parseInt(req.body.id);
        if(isNaN(id) || id < 0) {
            res.status(400).send({success: false, message: "Invalid id."}).end();
        } else mysql_conn.query("DELETE FROM finances WHERE id = ? AND hid = ?", [id, req.user.hid], (err, res2) => {
            if(err) {
                res.status(500).send({success: false, message: "Error while deleting from database."}).end();
            } else if(res2.affectedRows < 1) {
                res.status(401).send({success: false, message: "You don't have permission to change this entry."}).end();
            } else {
                res.status(200).send({success: true, message: "Entry deleted."}).end();
            }
        });
    }

};