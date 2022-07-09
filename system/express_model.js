/*
    @Author: Lance Parantar
    EXPRESS_MODEL is a required parent class for models that will be used in Express and have the following methods:
    - fetchALl()
    - fetchById()
    - runQuery()
    
*/
const expressProfiler = require("./libraries/profiler");
const connectDB = require("../config");
const { resolve } = require("path");
class EXPRESS_MODEL {
  constructor() {
    this.db = connectDB;
    this.stringQuery = "";
  }

  // fetch all records from the database
  // @table-name: the name of the table to fetch from
  fetchAll(query) {
    return new Promise((resolve, reject) => {
      this.db.query(query, (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });
  }

  // fetch a record by id from the database
  // @id: the id of the record to fetch
  fetchById(table, id) {
    this.db.any(`SELECT * FROM ${table} WHERE id = ${id}`).then((rows) => {
      console.log(rows);
    });
  }

  // Note: used to run INSERT/DELETE/UPDATE, queries that don't return a value
  // @query: the query to run, with ? placeholders for values
  // @values: the values to replace the ? placeholders with

  // Example: Insert into TABLE_NAME (COLUMN_NAME) VALUES (?, ?), [VALUE, VALUE]
  runQuery(query, values = null, res = null) {
    if (res != null) {
      res.locals.partials.query = query;
    }
    return new Promise((resolve, reject) => {
      this.db.query(query, values, (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });
  }
}

module.exports = EXPRESS_MODEL;
