/*  This module accepts requests to "/_/fetchfinances". The following arguments are passed to the function:
    req.body    ..      JSON request body sent by client
    req.user    ..      Information about the user sending the request (properties: email, uid, firstname, lastname, hid)
    res         ..      Result object, used to respond to the client
    mysql_conn  ..      MySQL connection (see mysql package)
    */
module.exports = (req, res) => {

    if(req.user.hid) {
        // Receive GET params
        const page = Math.max(parseInt(req.query.p) || 0, 0),
            pageSize = Math.max(Math.min(parseInt(req.query.ps) || 100, 100), 0) || 100,
            offset = pageSize * page,
            uid = parseInt(req.query.uid),
            validSorts = ["description", "amount", "date"];
        
        // Construct queries
        let displaySelect = `SELECT finances.id AS 'fid', description, amount, uid, UNIX_TIMESTAMP(created) as 'date'`,
            totalSelect = `SELECT COUNT(*) AS 'entries'`,
            mainQuery = ` FROM finances WHERE hid = ?`,
            mainSuffix = ``,
            queryParams = [req.user.hid];
        
        // Filter user
        if(uid) {
            mainQuery += ` AND uid = ?`;
            queryParams.push(uid);
        }

        // Search string
        if(req.query.q) {
            mainQuery += ` AND description LIKE ?`;
            queryParams.push("%" + req.query.q + "%");
        }

        //Sort
        if(req.query.s && validSorts.includes(req.query.s)) {
            let sortBy = req.query.s == "date" ? "created" : req.query.s;
            mainSuffix += ` ORDER BY ${sortBy} ` + (req.query.desc ? "DESC" : "ASC");
        }
        
        // Display query
        mysql_conn.query(displaySelect + mainQuery + mainSuffix + ` LIMIT ?, ?`, [...queryParams, offset, pageSize], (err, res2) => {
            if(err) {
                res.status(500).send({success: false, message: "Error while fetching finances from database."}).end();
                console.log(err);
            // Total count query (count without sort and limit)
            } else mysql_conn.query(totalSelect + mainQuery, queryParams, (err, res3) => {
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
        res.status(200).send({success: false, message: "Please join a household to use this feature."}).end();
    }

};