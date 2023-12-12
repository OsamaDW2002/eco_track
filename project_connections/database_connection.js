import mysql from "mysql";

export const con = mysql.createConnection({
    host: "34.165.41.217",
    user: "osama",
    password: "12028609",
    database:"eco_track",
    port:3306
});
