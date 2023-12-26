require('axios');
const con = require('../../project_connections/database_connection');
const {promisify} = require('util');
const {addPoints} = require("../scoring_system/scoring");
const publishToPub = require("../alert/messaging_client");
 const {matchNLP} = require("../common_methods");
require('dotenv').config()
const queryAsync = promisify(con.query).bind(con);

const uploadReport = async (req, res) => {
    try {
        const {title, text, location, issueDate, data} = req.body;

        if (!title || !text || !location || !issueDate || !data) {
            return res.status(400).send('Invalid Data');
        }

        const [existingReport] = await queryAsync('SELECT Title FROM Report WHERE Title = ?', [title.toLowerCase()]);

        if (existingReport) {
            return res.status(409).send('Report with the same title already exists');
        }


        const concern = await matchNLP(title + ' ' + text);
        const author = req.user.email;

        await queryAsync('INSERT INTO Report (Title, Text, Author, Location, IssueDate, Concern) VALUES (?, ?, ?, ?, ?, ?)',
            [title.toLowerCase(), text, author, location, issueDate, concern]);

        const insertData = 'INSERT INTO ReportData (Data, Report) VALUES (?, ?)';
        for (const datum of data) {
            await queryAsync(insertData, [datum, title.toLowerCase()]);
        }
        addPoints(author, 10)
        const dataToPub = {
            "type": "report",
            "concern": concern,
            "owner": author,
            "location": location,
            "title": title,
            "value": text
        }
        await publishToPub(dataToPub);
        return res.status(201).send('Report uploaded');
    } catch (error) {
        console.error('Error uploading report:', error);
        return res.status(500).send('Internal Server Error');
    } finally {
    }
};

const removeReport = async (req, res) => {
    let title = req.params.title
    console.log(title)

    if (!title)
        return res.status(400).send("Invalid Data");
    let sql = "SELECT * FROM Report WHERE (Title = ?)"
    await con.query(sql, [title.toLowerCase()], async (err, result) => {
        console.log(result)
        if (result.length === 0 || result[0].Author !== req.user.email.toLowerCase())
            return res.status(400).send("No such report or you don't own this report");

        sql = 'DELETE FROM Report WHERE (Title =? AND Author = ?)'
        await con.query(sql, [title.toLowerCase(), req.user.email.toLowerCase()])
        sql = 'DELETE FROM ReportData WHERE (Report = ? )'
        await con.query(sql, [title])
        return res.send(`Removed report ${title}`)
    })
}

module.exports = {uploadReport, removeReport};
