/*  Handler for "/_/addhousehold". Purpose: Setting household for user (used for 'add household' view). */
module.exports = ({ db }) => ({
  type: "POST",
  body: {
    hid: {
      type: "string",
      required: true,
      message: "Please provide a household id."
    },
    // Security code
    sec: {
      type: "int",
      required: true,
      message: "Missing security code."
    },
    // Confirm (check if false, update if true)
    confirm: {
      type: "boolean",
      default: false
    }
  },
  handler: async ({ body, query, user }, { success, fail, error }) => {
    //Check household
    try {
      const { results: householdRows } = await db.query(
        "SELECT id, name, type, registered FROM households WHERE id = AES_DECRYPT(UNHEX(?), ?) AND passphrase = ?",
        [body.hid, process.env.AES_HOUSEHOLD_PASSPHRASE || "9;|`eUk|$Lzo]*9J", body.sec]
      );
      if (householdRows.length == 0) {
        // Household/security code combination does not exist
        fail("The given combination of household identifier and security code is invalid. Please check your inputs.");
      } else if (body.confirm) {
        // User confirmed -> update household
        try {
          await db.query("UPDATE users SET ? WHERE ?", [{ hid: householdRows.id }, { id: req.user.uid }]);
          success("The given household was successfully assigned to you.");
        } catch (err) {
          error(`Error while assigning user to household: ${err.code}`, err);
        }
      } else {
        // Fetch old household if any and request confirmation
        try {
          const { results: oldHouseholdRows } = await db.query(
            "SELECT households.id, households.name, households.type, households.registered FROM households JOIN users ON households.id = users.hid WHERE users.id = ?",
            [req.user.uid]
          );
          if (oldHouseholdRows.length == 0) {
            // User is not assigned to any household
            success({
              message: "Please confirm.",
              household: {
                name: householdRows[0].name,
                type: householdRows[0].type,
                registered: householdRows[0].registered
              }
            });
          } else {
            // User currently in household
            success({
              success: true,
              message: "Please confirm overwriting your currently active household.",
              household: {
                name: householdRows[0].name,
                type: householdRows[0].type,
                registered: householdRows[0].registered
              },
              oldHousehold: {
                name: oldHouseholdRows[0].name,
                type: oldHouseholdRows[0].type,
                registered: oldHouseholdRows[0].registered
              },
              same: oldHouseholdRows[0].id == householdRows[0].id
            });
          }
        } catch (err) {
          error(`Error while trying to fetch current household from database: ${err.code}`, err);
        }
      }
    } catch (err) {
      error(`Error while looking up household in database: ${err.code}`, err);
    }
  }
});