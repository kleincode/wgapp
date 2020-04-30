/*  Handler for "/_/syncshopping". Purpose: Client sends shopping updates to server, server merges and sends merged changes to client (used in Shopping page). */
const Helpers = require("../components/Helpers");

module.exports = ({ db }) => ({
  type: "POST",
  public: false,
  body: {
    lastUpdate: {
      type: "int",
      required: true
    },
    items: {
      type: "object",
      required: true
    },
    lists: {
      type: "object",
      required: true
    }
  },
  handler: async ({ body: { lastUpdate, items, lists }, uid }, { success, fail, error }) => {
    if(!(lists instanceof Array)) {
      fail("Lists should be an array.");
      return;
    } else if(!(items instanceof Array)) {
      fail("Items should be an array.");
      return;
    }
    const now = Math.floor(Date.now() / 1000);
    try {
      const hid = await Helpers.fetchHouseholdID(db, uid);
      if(hid) {
        const ta = await db.beginTransaction();

        // 1. Merge all list updates
        for(let { id, updated, name, icon, deleted } of lists) {
          // Parse fields
          updated = parseInt(updated);
          icon = parseInt(icon);
          deleted = !!deleted;
          // Update may not be in the future!
          if(updated > now) updated = now;
          if(deleted) {
            // Delete if newer and permission granted
            await ta.query(
              "DELETE FROM shoppinglists WHERE ? AND ? AND `localupdate` <= FROM_UNIXTIME(?)",
              [{ id }, { hid }, updated]
            );
          } else {
            // Check if list exists on remote
            const { results: countRes } = await ta.query(
              "SELECT COUNT(*) AS 'exists' FROM shoppinglists WHERE ?",
              { id }
            );
            if(countRes.length > 0 && countRes[0].exists) {
              // Update if newer and permission granted
              await ta.query(
                "UPDATE shoppinglists SET ?, ?, `localupdate` = FROM_UNIXTIME(?), `remoteupdate` = FROM_UNIXTIME(?) WHERE ? AND ? AND `localupdate` <= FROM_UNIXTIME(?)",
                [{ name }, { icon }, updated, now, { id }, { hid }, updated ]
              );
            } else {
              // Insert new list
              await ta.query(
                "INSERT INTO shoppinglists (`id`, `hid`, `name`, `icon`, `localupdate`, `remoteupdate`) VALUES (?, ?, ?, ?, FROM_UNIXTIME(?), FROM_UNIXTIME(?))",
                [id, hid, name, icon, updated, now]
              );
            }
          }
        }

        // 2. Fetch all lists for household (always send all lists because some lists may have been deleted)
        let { results: fetchedLists } = await ta.query(
          "SELECT id, name, icon, synctime >= FROM_UNIXTIME(?) AS 'fullSync', UNIX_TIMESTAMP(localupdate) AS 'updated' FROM shoppinglists WHERE ?",
          [lastUpdate, { hid }]
        );
        if(!fetchedLists) fetchedLists = [];
        const listIds = fetchedLists.map(el => el.id);

        // 3. Merge all item updates
        for(let { id, updated, text, list, checked, deleted } of items) {
          // Check if list id is valid
          if(!listIds.includes(list)) continue;
          // Parse fields
          updated = parseInt(updated);
          checked = !!checked;
          deleted = !!deleted;
          // Update may not be in the future!
          if(updated > now) updated = now;
          if(deleted) {
            // Delete if newer and permission granted
            const { results: { affectedRows } } = await ta.query(
              "DELETE FROM shoppingitems WHERE ? AND `localupdate` <= FROM_UNIXTIME(?)",
              [{ id }, { hid }, updated]
            );
            // If delete failed or rejected, set current list to full sync
            if(!affectedRows) {
              const listEl = fetchedLists.find(el => el.id == id);
              if(listEl) listEl.fullSync = true;
            }
          } else {
            // Check if item exists on remote
            const { results: itemFetchRes } = await ta.query(
              "SELECT `list` FROM shoppingitems WHERE ?",
              { id }
            );
            if(itemFetchRes.length > 0) {
              // Check if item currently belongs to household (no permission otherwise)
              if(!listIds.includes(itemFetchRes[0].list)) continue;
              // Update if newer
              await ta.query(
                "UPDATE shoppingitems SET ?, ?, ?, `localupdate` = FROM_UNIXTIME(?), `remoteupdate` = FROM_UNIXTIME(?) WHERE ? AND `localupdate` <= FROM_UNIXTIME(?)",
                [{ text }, { checked }, { list }, updated, now, { id }, updated ]
              );
            } else {
              // Insert new list
              await ta.query(
                "INSERT INTO shoppingitems (`id`, `text`, `checked`, `list`, `localupdate`, `remoteupdate`) VALUES (?, ?, ?, ?, FROM_UNIXTIME(?), FROM_UNIXTIME(?))",
                [id, text, checked, list, updated, now]
              );
            }
          }
        }

        // 4. Fetch list items
        const fullSyncLists = fetchedLists.filter(el => el.fullSync).map(el => el.id);
        let itemResults;
        if(fullSyncLists.length) {
          itemResults = (await ta.query(
            "SELECT shoppingitems.`id`, shoppingitems.`text`, shoppingitems.`checked`, shoppingitems.`list`, UNIX_TIMESTAMP(shoppingitems.`localupdate`) AS 'updated' FROM shoppingitems JOIN shoppinglists ON shoppingitems.list = shoppinglists.id WHERE shoppinglists.id IN (?) OR shoppingitems.remoteupdate > FROM_UNIXTIME(?)",
            [fullSyncLists, lastUpdate]
          )).results;
        } else {
          itemResults = (await ta.query(
            "SELECT `id`, `text`, `checked`, `list`, UNIX_TIMESTAMP(`localupdate`) AS 'updated' FROM shoppingitems WHERE remoteupdate > FROM_UNIXTIME(?)",
            [lastUpdate]
          )).results;
        }

        await ta.commit();
        success({
          message: "Updated.",
          lists: fetchedLists,
          items: itemResults,
          now
        });
      } else {
        fail("Please join a household to use this feature.");
      }
    } catch(err) {
      error("Error while fetching household.", err);
    }
  }
});