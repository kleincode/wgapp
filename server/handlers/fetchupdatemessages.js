/*  Handler for "/_/fetchupdatemessage". Purpose: Showing a dialog with news */
module.exports = ({ db }) => ({
  type: "GET",
  public: false,
  handler: async ({ body, query, uid }, { success, fail, error }) => {
    try {
      const { results } = await db.query(`SELECT id, en, de FROM updatemessages ORDER BY id DESC LIMIT 1`);
      results.forEach((elem) => {
        elem.en = JSON.parse(elem.en);
        elem.de = JSON.parse(elem.de);
      });
      success({ message: "Update messages fetched.", data: results });
    } catch (err) {
      error("Error while fetching update messages.", 0, err);
    }
  }
});