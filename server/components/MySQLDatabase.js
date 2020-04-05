const mysql = require("mysql");

var DatabaseHelper = class DatabaseHelper {

  constructor(options) {
    this.options = {};
    this.pool = null;
    this.config(options);
  }

  config(options) {
    let validKeys = ["logSql", "logErrors"];
    validKeys.forEach((key) => {
      if (key in options)
        this.options[key] = !!options[key];
    });
    return this;
  }

  connect(poolSettings) {
    this.pool = mysql.createPool(poolSettings);
    return this;
  }

  disconnect() {
    const pool = this.pool;
    return new Promise((resolve, reject) => {
      pool.end((err) => {
        pool = null;
        if (err) reject(err);
        else resolve();
      });
    });
  }

  getPool() {
    return this.pool;
  }

  query(query, data) {
    const pool = this.pool;
    return new Promise((resolve, reject) => {
      pool.query(query, data, (err, results, fields) => {
        if(err) reject(err);
        else resolve({err, results, fields});
      });
    });
  }

};

module.exports = DatabaseHelper;