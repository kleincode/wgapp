/*  Handler for "/_/fetchfinances". Purpose: Fetching expenses and member totals from finances table (used for 'finances' view). */
const Helpers = require("../components/Helpers");

module.exports = ({ db }) => ({
  type: "GET",
  public: false,
  params: {
    // Page
    p: {
      type: "int",
      unsigned: true,
      default: 0
    },
    // Number of entries per page
    ps: {
      type: "int",
      default: 0
    },
    // Optional user id to filter for
    uid: {
      type: "int"
    },
    // Optional search query
    q: {
      type: "string"
    },
    // Optional sort (accepted values: "description", "amount", "date")
    s: {
      type: "string"
    },
    // Optional sort in descending order
    desc: {
      type: "boolean"
    },
    minTimestamp: {
      type: "int",
      default: 0
    }
  },
  handler: async ({ body, query, uid }, { success, fail, error }) => {
    const hid = await Helpers.fetchHouseholdID(db, uid);
    if (hid) {
      // Receive GET params
      let { p: page, ps: pageSize, uid: filterUid, q, s, desc, minTimestamp } = query;
      if (pageSize > 100 || pageSize < 1) pageSize = 100; // limit page size to 100
      const offset = pageSize * page,
        validSorts = ["description", "amount", "date"];
      // Construct queries
      let displaySelect = `SELECT finances.id AS 'fid', description, amount, uid, UNIX_TIMESTAMP(created) as 'date'`,
        totalSelect = `SELECT COUNT(*) AS 'c'`,
        mainQuery = ` FROM finances WHERE hid = ? AND UNIX_TIMESTAMP(created) > ?`,
        mainSuffix = ``,
        queryParams = [hid, minTimestamp];

      // Filter user
      if (filterUid) {
        mainQuery += ` AND uid = ?`;
        queryParams.push(filterUid);
      }

      // Search string
      if (q) {
        mainQuery += ` AND description LIKE ?`;
        queryParams.push("%" + q + "%");
      }

      // Sort
      if (s && validSorts.includes(s)) {
        let sortBy = s == "date" ? "created" : s;
        mainSuffix += ` ORDER BY ${sortBy} ` + (desc ? "DESC" : "ASC");
      }

      try {
        // Count all entries (without sort and limit) to return total number of pages
        const { results } = await db.query(totalSelect + mainQuery, queryParams);
        const totalEntries = results[0].c;

        // Accumulate entries for all users (independently from single entries)
        const { results: memberTotals } = await db.query("SELECT uid, SUM(amount) AS 'amount' FROM finances WHERE hid = ? AND UNIX_TIMESTAMP(created) > ? GROUP BY uid", [hid, minTimestamp]);
        let memberobj = {};
        memberTotals.forEach(el => memberobj[el.uid] = el.amount);

        const { results: trendcurve } = await db.query("SELECT amount FROM finances WHERE hid = ? AND UNIX_TIMESTAMP(created) > ?", [hid, minTimestamp]);

        if(totalEntries == 0) {
          // The page is empty, no need to fetch entries.
          success({message: "Empty.", page: page, entries: 0, pages: 0, data: [], totals: memberobj, trend: [] });
        } else {
          // Now fetch entries with sort and limit to return them as data
          const { results: expenseRows } = await db.query(displaySelect + mainQuery + mainSuffix + ` LIMIT ?, ?`, [...queryParams, offset, pageSize]);
          success({message: "Finances received.", page: page, entries: totalEntries, pages: Math.ceil(totalEntries / pageSize), data: expenseRows, totals: memberobj , trend: trendcurve});
        }
      } catch(err) {
        error("Error while fetching finances from database", err);
      }
    } else {
      fail("Please join a household to use this feature.");
    }
  }
});