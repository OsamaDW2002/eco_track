const mysql = require("mysql");

const con = mysql.createConnection({
    host: "host",
    user: "name",
    password:"*****",
    database: "eco_track",
    port: 3306
});
con.connect()
module.exports = con;