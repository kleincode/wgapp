/*  Handler for "/_/createhousehold". Purpose: Inserting new household and assigning user to it (used for 'create household' view). */
module.exports = ({ db }) => ({
  type: "POST",
  public: false,
  body: {
    name: {
      type: "string",
      required: true,
      message: "Please provide a household id."
    },
    type: {
      type: "int",
      default: 0
    }
  },
  handler: async ({ body, query, uid }, { success, fail, error }) => {
    const key = Math.floor(100000 + Math.random() * 900000);
    try {
      const { results: { insertId: actualHID } } = await db.query(
        "INSERT INTO households (name, passphrase, type) VALUES (?, ?, ?)",
        [body.name, key, body.type]
      );
      try {
        await db.query("UPDATE users SET ? WHERE ?", [{ hid: actualHID }, { id: uid }]);
        try {
          const { results } = await db.query(
            "SELECT HEX(AES_ENCRYPT(?, ?)) AS hid",
            [actualHID, process.env.AES_HOUSEHOLD_PASSPHRASE]
          );
          success({
            message: "Your household has been created successfully. Please proceed by inviting members.",
            hid: results[0].hid, // encrypted household id (public)
            sec: key // security code (random number, needed for other members joining household)
          });
        } catch (err) {
          error(`Error while fetching household security token: ${err.code}`, 5, err);
        }
      } catch (err) {
        error(`Error while assigning user to household: ${err.code}`, 1, err);
      }
    } catch (err) {
      error(`Error while creating household in database: ${err.code}`, 5, err);
    }
  }
});