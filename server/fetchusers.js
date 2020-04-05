/*  This module accepts requests to "/_/fetchusers". The following arguments are passed to the function:
    req.body    ..      JSON request body sent by client (for POST requests) OR
    req.query   ..      HTTP params sent by client (for GET requests)
    req.user    ..      Information about the user sending the request (properties: email, uid, firstname, lastname, hid)
    res         ..      Result object, used to respond to the client
    db          ..      Helper for database calls (see MySQLDatabase.js)
    */
module.exports = (db) => async (req, res) => {

  if (req.user.hid) {
    try {
      const { results } = await db.query(`SELECT id, firstname, lastname FROM users WHERE hid = ?`, [req.user.hid]);
      let userdata = {};
      results.forEach(u => userdata[u.id] = { firstname: u.firstname, lastname: u.lastname });
      res.status(200).send({ success: true, message: "User data fetched.", data: userdata }).end();
    } catch (err) {
      res.status(500).send({ success: false, message: "Error while fetching users from database." }).end();
      console.log(err);
    }
  } else {
    res.status(200).send({ success: false, message: "Please join a household to use this feature." }).end();
  }

};