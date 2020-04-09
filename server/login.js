/*  This module accepts requests to "/_/login". The following arguments are passed to the function:
    req.body    ..      JSON request body sent by client
    req.user    ..      Information about the user sending the request (properties: email, uid, firstname, lastname)
    res         ..      Result object, used to respond to the client
    */
module.exports = (req, res) => {
    if(!req.body) {
        res.status(400).send({success: false, message: "Bad Request: Please provide a request body with a valid email and password."}).end();
    } else if(!req.body.email) {
        res.status(400).send({success: false, message: "An email is required to log in."}).end();
    } else if(!req.body.password) {
        res.status(400).send({success: false, message: "Please provide a password in order to log in."}).end();
    } else {
        const { email, password } = req.body;
        mysql_conn.query("SELECT id AS uid, email, firstname, lastname, pass, hid FROM users WHERE ?", {email: email}, (err, res2) => {
            if(err) {
                res.status(500).send({success: false, message: `Error while fetching user data: ${err.code}`, fatal: err.fatal}).end();
                console.log(err);
            } else if(!res2 || res2.length == 0) {
                res.status(400).send({success: false, message: "The given combination of email and password is incorrect."}).end();
            } else {
                const { uid, email, firstname, lastname, pass, hid } = res2[0];
                bcrypt.compare(password, pass, (err, res3) => {
                    if(err) {
                        res.status(500).send({success: false, message: "Error during encryption process."}).end();
                        console.log(err);
                    } else if(!res3) {
                        res.status(401).json({success: false, message: "The given combination of email and password is incorrect."}).end();
                    } else {
                        const token = jwt.sign({ uid, email, firstname, lastname, hid }, jwt_secret);
                        res.status(200).send({success: true, message: "You were successfully logged in.", email, token}).end();
                    }
                });
            }
        });
    }
};