const express = require('express');
const con = require('../../project_connections/database_connection');

const queryAsync = async (sql, params) => {
    return new Promise((resolve, reject) => {
        con.query(sql, params, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

function merge(results) {
    const consolidatedData = results.reduce((acc, obj) => {
        const key = `${obj.FirstName}_${obj.LastName}`;
        if (!acc[key]) {
            acc[key] = { ...obj, Concerns: [obj.Concern] };
        } else {
            acc[key].Concerns.push(obj.Concern);
        }
        delete acc[key].Concern;
        return acc;
    }, {});
    return Object.values(consolidatedData);
}

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
