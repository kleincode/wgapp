/*  This module accepts requests to "/_/createhousehold". The following arguments are passed to the function:
    req.body    ..      JSON request body sent by client
    req.user    ..      Information about the user sending the request (properties: email, uid, firstname, lastname)
    res         ..      Result object, used to respond to the client
    */
module.exports = (req, res) => {
    if(!req.body) {
        res.status(400).send({success: false, message: "Bad Request: Please provide a request body with valid household data."}).end();
    } else if(!req.body.name) {
        res.status(400).send({success: false, message: "A household name is required."}).end();
    } else {
        const { name } = req.body;
        const key = Math.floor(100000 + Math.random() * 900000);
        mysql_conn.query("INSERT INTO households (name, passphrase, type) VALUES (?, ?, ?)", [name, key, req.body.type || 0], (err, res2) => {
            if(err) {
                res.status(500).send({success: false, message: `Error while creating household in database: ${err.code}`, fatal: err.fatal}).end();
                console.log(err);
            } else {
                const hId = res2.insertId;
                mysql_conn.query("UPDATE users SET ? WHERE ?", [{hid: hId}, {id: req.user.uid}], (err, res3) => {
                    if(err) {
                        res.status(500).send({success: false, message: `Error while assigning user to household: ${err.code}`, fatal: err.fatal}).end();
                        console.log(err);
                    } else {
                        mysql_conn.query("SELECT HEX(AES_ENCRYPT(?, ?)) AS hid", [hId, process.env.AES_HOUSEHOLD_PASSPHRASE || "9;|`eUk|$Lzo]*9J"], (err, res4) => {
                            if(err) {
                                res.status(500).send({success: false, message: `Error while fetching household security token: ${err.code}`, fatal: err.fatal}).end();
                                console.log(err);
                            } else {
                                res.status(200).send({success: true, message: "Your household has been created successfully. Please proceed by inviting members.", hid: res4[0].hid, sec: key});
                            }
                        });
                    }
                });
            }
        });
    }
};