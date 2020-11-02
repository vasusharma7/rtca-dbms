const mysql = require("mysql");
const config = require("config");

const conn = mysql.createConnection({
  host: config.get("host"),
  user: config.get("username"),
  password: config.get("password"),
  database: config.get("database"),
  charset: config.get("charset"),
});

conn.connect(function (err) {
  if (err) throw err;
  console.log("Connected To MYSQL!");
});

module.exports = conn;
