const mysql = require("mysql");

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "eco_track",
    port: 3306
});
module.exports = con;