const axios = require('axios');
const con = require('../../project_connections/database_connection');
const { promisify } = require('util');
const { findMaxKey } = require('./common_methods');
const {addPoints} = require("../score_sys/scoring");
require('dotenv').config()
const queryAsync = promisify(con.query).bind(con);

const uploadReport = async (req, res) => {
     try {
        const { title, text, location, issueDate, data } = req.body;

        if (!title || !text || !location || !issueDate || !data) {
            return res.status(400).send('Invalid Data');
        }

        const [existingReport] = await queryAsync('SELECT Title FROM Report WHERE Title = ?', [title.toLowerCase()]);

        if (existingReport) {
            return res.status(409).send('Report with the same title already exists');
        }

        const response = await axios.post(process.env.NLP_ENDPOINT, {
            input_phrase: title + ' ' + text,
            matchers: {
                clean_energy: 'Clean Energy',
                global_warming: 'Global Warming',
                deforestation: 'Deforestation',
                extinction: 'Extinction',
                air_pollution: 'Air Pollution',
                water_pollution: 'Water Pollution',
                noise_pollution: 'Noise Pollution',
            },
        });

        const concern = findMaxKey(response.data.results);
        const author = req.user.email;

        await queryAsync('INSERT INTO Report (Title, Text, Author, Location, IssueDate, Concern) VALUES (?, ?, ?, ?, ?, ?)',
            [title.toLowerCase(), text, author, location, issueDate, concern]);

        const insertData = 'INSERT INTO ReportData (Data, Report) VALUES (?, ?)';
        for (const datum of data) {
            await queryAsync(insertData, [datum, title.toLowerCase()]);
        }
         addPoints(author, 10)
        return res.status(201).send('Report uploaded');
    } catch (error) {
        console.error('Error uploading report:', error);
        return res.status(500).send('Internal Server Error');
    } finally {
    }
};

module.exports = { uploadReport };
