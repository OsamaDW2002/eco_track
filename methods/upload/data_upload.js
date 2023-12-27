const {addPoints} = require("../scoring_system/scoring");
const publishToPub = require("../alert/messaging_client");
const {matchNLP, queryAsync, snakeToTitle} = require("../common_methods");
require('dotenv').config();


const uploadData = async (req, res) => {
    try {
        const {value, type, notes, collection_date: collectionDate} = req.body;

        if (!value || !type || !notes || !collectionDate) {
            return res.status(400).send("Invalid Data");
        }

        const concern = await matchNLP(notes + " " + type);
        console.log(concern);
        const user = req.user.email;

        const sql = "INSERT INTO EnvData (Value, Type, Notes, CollectionDate, Concern, Source) VALUES (?, ?, ?, ?, ?, ?)";
        await queryAsync(sql, [value, type, notes, collectionDate, concern, user]);

        addPoints(user, 5);
        const dataToPub = {"type": "data", "concern": concern, "owner": user, "title": type, "value": value};
        await publishToPub(dataToPub);

        res.send(`Data uploaded under the environmental concern: ${snakeToTitle(concern)}`);
    } catch (error) {
        console.error("Error uploading data:", error);
        res.status(500).send("Internal Server Error");
    }
};

const removeData = async (req, res) => {
    try {
        let id = req.params.id;

        if (!id)
            return res.status(400).send("Invalid Data");

        const sql = "SELECT * FROM EnvData WHERE (ID = ?)";
        const result = await queryAsync(sql, [id]);

        console.log(result);
        if (result.length === 0 || result[0].Source !== req.user.email.toLowerCase())
            return res.status(400).send("No such data or you don't own this data");

        const deleteDataSql = 'DELETE FROM EnvData WHERE (ID = ? AND Source = ?)';
        await queryAsync(deleteDataSql, [id, req.user.email.toLowerCase()]);

        const deleteReportDataSql = 'DELETE FROM ReportData WHERE (Data = ?)';
        await queryAsync(deleteReportDataSql, [id]);

        return res.send(`Removed data: ${id}`);
    } catch (error) {
        console.error("Error removing data:", error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = {uploadData, removeData};
