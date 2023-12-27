
const {merge, queryAsync} = require("../common_methods");




const scoreboard = async (req, res) => {
    try {
        const findUsersQuery = `
            SELECT FirstName, LastName, Email, Profession, Concern, Score
            FROM UserConcern
            JOIN Profile ON UserConcern.User = Profile.Email
            ORDER BY Profile.Score DESC
            LIMIT 5
        `;

        const results = await queryAsync(findUsersQuery);

        const consolidatedData = merge(results);
        res.json(consolidatedData);
    } catch (error) {
        console.error("Error fetching scoreboard:", error);
        res.status(500).send("Internal Server Error");
    }
};

const findSpecificUser = async (req, res) => {
    try {
        const email = req.params.email;
        console.log(email);

        const findUserQuery = `
            SELECT FirstName, LastName, Email, Profession, Concern, Score
            FROM UserConcern
            JOIN Profile ON UserConcern.User = Profile.Email
            WHERE Profile.Email = ?
        `;

        const results = await queryAsync(findUserQuery, [email.toLowerCase()]);

        const consolidatedData = merge(results);
        res.json(consolidatedData);
    } catch (error) {
        console.error("Error fetching specific user:", error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = { scoreboard, findSpecificUser };
