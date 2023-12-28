const axios = require("axios");
const { snakeCase, getKeyForValueGreaterThanPointFour, snakeToTitle, queryAsync } = require("../common_methods");

const addConcern = async (req, res) => {
    try {
        const concern = req.params.concern;
        const existingConcern = await queryAsync('SELECT * FROM Concerns WHERE Concern = ?', [concern.toLowerCase()]);
        if (existingConcern.length !== 0) {
            return res.send("Concern already exists");
        }

        const allConcerns = await queryAsync('SELECT * FROM Concerns');
        const matchers = {};

        if (allConcerns.length !== 0) {
            for (const res of allConcerns) {
                matchers[snakeCase(res.Concern)] = res.Concern.toLowerCase();
            }

            const response = await axios.post(process.env.NLP_ENDPOINT, {
                "input_phrase": concern,
                "matchers": matchers,
            });

            console.log(response.data);

            const existingConcernName = getKeyForValueGreaterThanPointFour(response.data.results);

            if (existingConcernName === 'DNE') {
                await queryAsync('INSERT INTO Concerns (Concern) VALUES(?)', [snakeToTitle(concern.toLowerCase())]);
            } else {
                return res.send(`Your suggested concern ${concern} already exists under the name ${snakeToTitle(existingConcernName)}`);
            }

            return res.send(`Added concern: ${concern}`);
        }
    } catch (error) {
        console.error('Error adding concern:', error);
        return res.status(500).send('Internal Server Error');
    }
};

const listAllConcerns = async (req, res) => {
    try {
        const allConcerns = await queryAsync('SELECT * FROM Concerns');
        res.json(allConcerns);
    } catch (error) {
        console.error('Error listing all concerns:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = { addConcern, listAllConcerns };
