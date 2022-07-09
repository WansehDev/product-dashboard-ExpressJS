const fs = require("fs");
const YAML = require("js-yaml");

const raw = fs.readFileSync("data.yaml");
const data = YAML.load(raw);


// check if what database engine was set in yaml

if (data.DBEngine == "PostgreSQL") {
  var pgp = require("pg-promise")();
  var db = pgp(data.pg.db);
} else {
  var Mysql = require("mysql2");
  var db = Mysql.createConnection({
    host: data.mysql.host,
    user: data.mysql.user,
    password: data.mysql.password, 
    database: data.mysql.database, // database name
    port: data.port,
  });  
}

db.connect((err) => {
  if (err) throw err;
});

module.exports = db;
