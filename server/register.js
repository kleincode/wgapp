/*  This module accepts requests to "/_/register". The following arguments are passed to the function:
    req.body    ..      JSON request body sent by client
    req.user    ..      Information about the user sending the request (properties: email, uid, firstname, lastname)
    res         ..      Result object, used to respond to the client
    */
module.exports = (req, res) => {
    if(!req.body) {
        res.status(400).send({success: false, message: "Bad Request: Please provide a request body with valid email, first name, last name, and password fields."}).end();
    } else if(!req.body.email) {
        res.status(400).send({success: false, message: "An email is required to register."}).end();
    } else if(!req.body.firstname) {
        res.status(400).send({success: false, message: "Please tell us your first name so we can call you by it."}).end();
    } else if(!req.body.password) {
        res.status(400).send({success: false, message: "Please provide a password in order to register."}).end();
    } else {
        const { email, firstname, password } = req.body;
        if(!email.match(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)) {
            res.status(400).send({success: false, message: "The given email address is invalid."}).end();
        } else {
            const lastname = req.body.lastname || "";
            mysql_conn.query(`SELECT COUNT(*) AS uc FROM users WHERE ?`, {email: email}, (err, res2) => {
                if(err) {
                    res.status(500).send({success: false, message: `Database connection failed: ${err.code}`, fatal: err.fatal}).end();
                    console.log(err);
                } else {
                    if(res2[0].uc > 0) {
                        res.status(400).send({success: false, message: "The given email address is already registered."}).end();
                    } else {
                        //Actual register process begins here
                        bcrypt.hash(password, auth_salt_rounds, (err, hash) => {
                            if(err) {
                                res.status(500).send({success: false, message: "Error during encryption process."}).end();
                                console.log(err);
                            } else {
                                mysql_conn.query("INSERT INTO `users` (`email`, `firstname`, `lastname`, `pass`) VALUES (?, ?, ?, ?)", [email, firstname, lastname, hash], (err, res3) => {
                                    if(err) {
                                        res.status(500).send({success: false, message: `The registration process failed: ${err.code}`, fatal: err.fatal}).end();
                                        console.log(err);
                                    } else {
                                        res.status(200).send({success: true, message: `You were successfully registered, ${firstname}.`});
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }
    }
};