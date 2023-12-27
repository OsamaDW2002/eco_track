 const {addPoints} = require("../scoring_system/scoring");
const publishToPub = require("../alert/messaging_client");
const {matchNLP, queryAsync} = require("../common_methods");
require('dotenv').config();


const reportExists = async (title, author) => {
    const [existingReport] = await queryAsync('SELECT * FROM Report WHERE Title = ?', [title.toLowerCase()]);
    console.log(existingReport); // Add this line to log the object
    return existingReport && existingReport.Author === author.toLowerCase();
};


const uploadReport = async (req, res) => {
    try {
        const {title, text, location, issue_date:issueDate, data} = req.body;

        if (!title || !text || !location || !issueDate || !data) {
            return res.status(400).send('Invalid Data');
        }

        if (await reportExists(title, req.user.email)) {
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
        addPoints(author, 10);

        const dataToPub = {
            "type": "report",
            "concern": concern,
            "owner": author,
            "location": location,
            "title": title,
            "value": text
        };
        await publishToPub(dataToPub);

        return res.status(201).send('Report uploaded');
    } catch (error) {
        console.error('Error uploading report:', error);
        return res.status(500).send('Internal Server Error');
    }
};

const removeReport = async (req, res) => {
    try {
        const title = req.params.title;

        if (!title) {
            return res.status(400).send("Invalid Data");
        }

        if (!(await reportExists(title, req.user.email))) {
            return res.status(400).send("No such report or you don't own this report");
        }

        await queryAsync('DELETE FROM Report WHERE (Title =? AND Author = ?)', [title.toLowerCase(), req.user.email.toLowerCase()]);
        await queryAsync('DELETE FROM ReportData WHERE (Report = ? )', [title]);

        return res.send(`Removed report ${title}`);
    } catch (error) {
        console.error('Error removing report:', error);
        return res.status(500).send('Internal Server Error');
    }
};

const updateReport = async (req, res) => {
    try {
        const {old_title:oldTitle, new_title:newTitle, new_text:newText, data} = req.body;

        if (!oldTitle || (!newTitle && !newText && !data)) {
            return res.status(400).send('Invalid Data. Please provide both oldTitle and at least one of newTitle, newText, or data to update.');
        }

        const existingReport = await reportExists(oldTitle, req.user.email)
console.log(existingReport)
        if (!existingReport) {
            return res.status(403).send('Report not found or you are not authorized to update this report');
        }


        const updateOperations = [];

        if (newTitle && newTitle.toLowerCase() !== oldTitle.toLowerCase()) {
            if (await reportExists(newTitle, req.user.email)) {
                return res.status(409).send('Title already exists for another user. Choose a different title.');
            }

            updateOperations.push(queryAsync('UPDATE Report SET Title = ? WHERE Title = ?', [newTitle.toLowerCase(), oldTitle.toLowerCase()]));
        }

        if (newText) {
            updateOperations.push(queryAsync('UPDATE Report SET Text = ? WHERE Title = ?', [newText, oldTitle.toLowerCase()]));
        }

        if (data) {
             updateOperations.push(queryAsync('DELETE FROM ReportData WHERE Report = ?', [oldTitle.toLowerCase()]));

             const insertData = 'INSERT INTO ReportData (Data, Report) VALUES (?, ?)';
            for (const datum of data) {
                updateOperations.push(queryAsync(insertData, [datum, newTitle ? newTitle.toLowerCase() : oldTitle.toLowerCase()]));
            }
        }

        await Promise.all(updateOperations);

        return res.status(200).send('Report updated successfully');
    } catch (error) {
        console.error('Error updating report:', error);
        return res.status(500).send('Internal Server Error');
    }
};

 module.exports = { uploadReport, removeReport, updateReport };

