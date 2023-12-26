const con = require('../../project_connections/database_connection');

const {addPoints} = require("../scoring_system/scoring");
const publishToPub = require("../alert/messaging_client");
const {matchNLP} = require("../common_methods");
require('dotenv').config()
const uploadData = async (req, res) => {
    try {
        const {value, type, notes, collectionDate} = req.body;

        if (!value || !type || !notes || !collectionDate) {
            return res.status(400).send("Invalid Data");
        }


        const concern = await matchNLP(notes + " " + type)
        console.log(concern)
        const user = req.user.email;

        const sql = "INSERT INTO EnvData (Value, Type, Notes, CollectionDate, Concern, Source) VALUES (?, ?, ?, ?, ?, ?)";
        await con.query(sql, [value, type, notes, collectionDate, concern, user]);
        addPoints(user, 5)
        const dataToPub = {"type": "data", "concern": concern, "owner": user, "title": type, "value": value}
        await publishToPub(dataToPub);
        res.send("Data uploaded");
    } catch (error) {
        console.error("Error uploading data:", error);
        res.status(500).send("Internal Server Error");
    }
};

const removeData = async (req, res) => {
    let id = req.params.id

    if (!id)
        return res.status(400).send("Invalid Data");
    let sql = "SELECT * FROM EnvData WHERE (ID = ?)"
    await con.query(sql, [id], async (err, result) => {
        console.log(result)
        if (result.length === 0 || result[0].Source !== req.user.email.toLowerCase())
            return res.status(400).send("No such data or you don't own this data");

        sql = 'DELETE FROM EnvData WHERE (ID =? AND Source = ?)'
        await con.query(sql, [id, req.user.email.toLowerCase()])
        sql = 'DELETE FROM ReportData WHERE (Data = ? )'
        await con.query(sql, [id])
        return res.send(`Removed data: ${id}`)
    })
}


module.exports = {uploadData, removeData};
