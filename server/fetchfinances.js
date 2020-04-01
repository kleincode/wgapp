/*  This module accepts requests to "/_/fetchfinances". The following arguments are passed to the function:
    req.body    ..      JSON request body sent by client
    req.user    ..      Information about the user sending the request (properties: email, uid, firstname, lastname, hid)
    res         ..      Result object, used to respond to the client
    mysql_conn  ..      MySQL connection (see mysql package)
    */
module.exports = (req, res) => {

    if(req.user.hid) {
        const page = Math.max(parseInt(req.query.p) || 0, 0),
            pageSize = Math.max(Math.min(parseInt(req.query.ps) || 100, 100), 0) || 100,
            offset = pageSize * page;
        
        const mainQuery = ` FROM finances WHERE hid = ?` + (req.query.q ? ` AND description LIKE ?` : ""),
            queryParams = req.query.q ? [req.user.hid, "%" + req.query.q + "%"] : [req.user.hid];
        
        mysql_conn.query(`SELECT finances.id AS 'fid', description, amount, uid` + mainQuery + ` LIMIT ?, ?`, [...queryParams, offset, pageSize], (err, res2) => {
            if(err) {
                res.status(500).send({success: false, message: "Error while fetching finances from database."}).end();
                console.log(err);
            } else mysql_conn.query("SELECT COUNT(*) AS 'entries'" + mainQuery, queryParams, (err, res3) => {
                if(err) {
                    res.status(500).send({success: false, message: "Error while fetching finances from database."}).end();
                    console.log(err);
                } else mysql_conn.query("SELECT uid, SUM(amount) AS 'amount' FROM finances WHERE hid = ? GROUP BY uid", [req.user.hid], (err, res4) => {
                    if(err) {
                        res.status(500).send({success: false, message: "Error while fetching total amounts from database."}).end();
                        console.log(err);
                    } else {
                        let memberobj = {};
                        res4.forEach(el => memberobj[el.uid] = el.amount);
                        res.status(200).send({success: true, message: "Finances received.", page: page, entries: res3[0].entries, pages: Math.ceil(res3[0].entries / pageSize), data: res2, totals: memberobj}).end();
                    }
                })
            });
        });
    } else {
        res.status(400).send({success: false, message: "Please join a household to use this feature."}).end();
    }

};