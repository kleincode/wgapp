const mysql = require("mysql");

// Currently dummy wrapper for mysql package, might extend later
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
    return new Promise((resolve, reject) => {
      this.pool.query(query, data, (err, results, fields) => {
        if(err) reject(err);
        else resolve({err, results, fields});
      });
    });
  }

  beginTransaction() {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, connection) => {
        if(err) reject(err);
        else connection.beginTransaction(err => {
          if(err) reject(err);
          else resolve(new TransactionHelper(connection, { debug: true }));
        });
      });
    });
  }

};

var TransactionHelper = class TransactionHelper {

  constructor(connection, options) {
    this.connection = connection;
    this.released = false;
    this.options = options;
  }

  debug(msg) {
    if(this.options.debug) console.log(msg);
  }

  getConnection() {
    return this.connection;
  }

  query(query, data) {
    if(this.options.debug) {
      console.log("ta query", mysql.format(query, data));
    }
    return new Promise((resolve, reject) => {
      if(this.released) reject("Transaction is closed. Please create a new transaction.");
      else this.connection.query(query, data, (err, results, fields) => {
        if(err) reject(err);
        else {
          if(this.options.debug) {
            console.log("ta results", results);
          }
          resolve({err, results, fields});
        }
      });
    });
  }

  commit() {
    return new Promise((resolve, reject) => {
      if(this.options.debug) {
        console.log("ta commit");
      }
      if(this.released) reject("Transaction is closed. Please create a new transaction.");
      else this.connection.commit(err => {
        if(err) reject(err);
        else {
          this.connection.release();
          resolve();
        }
      });
    });
  }

  rollback() {
    return new Promise((resolve, reject) => {
      if(this.options.debug) {
        console.log("ta rollback");
      }
      if(this.released) reject("Transaction is closed. Please create a new transaction.");
      else this.connection.rollback(err => {
        if(err) reject(err);
        else {
          this.connection.release();
          resolve();
        }
      });
    });
  }

};

module.exports = DatabaseHelper;