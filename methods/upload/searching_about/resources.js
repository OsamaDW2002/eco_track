const express = require('express');
const con = require('../../../project_connections/database_connection');

const queryAsync = async (sql, params) => {
    return new Promise((resolve, reject) => {
        con.query(sql, params, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

const getAllResources = async (req, res) => {
    try {
        const getResQuery = "SELECT name, url, source, concern FROM Resources";
        const results = await queryAsync(getResQuery, []);

        const formattedResources = results.map(resource => ({
            name: resource.name,
            url: resource.url,
            source: resource.source,
            concern: resource.concern
        }));

        res.json({ resources: formattedResources });
    } catch (error) {
        console.error("Error fetching all resources:", error);
        res.status(500).send("Internal Server Error");
    }
};

const getSpecificResource = async (req, res) => {
    try {
        const name = req.params.name;
        const getResQuery = "SELECT name, url, source, concern FROM Resources WHERE Resources.Name = ?";
        const results = await queryAsync(getResQuery, [name]);

        const formattedResources = results.map(resource => ({
            name: resource.name,
            url: resource.url,
            source: resource.source,
            concern: resource.concern
        }));

        res.json({ resources: formattedResources });
    } catch (error) {
        console.error("Error fetching specific resource:", error);
        res.status(500).send("Internal Server Error");
    }
};

const getResourcesByConcern = async (req, res) => {
    try {
        let concern = req.params.concern;

        if (!concern)
            return res.status(400).send("Invalid Data");

        const sql = "SELECT * FROM Resources WHERE (Concern = ?)";
        const resources = await queryAsync(sql, [concern]);

        if (resources.length === 0)
            return res.status(400).send("No resources found for the specified concern");

        const formattedResources = resources.map(resource => ({
            name: resource.Name,
            url: resource.URL,
            concern: resource.Concern,
            source: resource.Source
        }));

        res.json({ resources: formattedResources });
    } catch (error) {
        console.error("Error getting resources by concern:", error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = { getAllResources, getSpecificResource, getResourcesByConcern };
