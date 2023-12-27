const con = require("../../../project_connections/database_connection");
const {queryAsync, matchNLPSet} = require("../../common_methods");

const getDataById = async (req, res) => {
    try {
        let id = req.params.id;

        if (!id)
            return res.status(400).send("Invalid Data");

        const sql = "SELECT * FROM EnvData WHERE (ID = ?)";
        con.query(sql, [id], async (err, result) => {
            if (err) throw err;

            if (result.length === 0 || result[0].Source !== req.user.email.toLowerCase())
                return res.status(400).send("No such data or you don't own this data");

            const formattedData = {
                id: result[0].ID,
                value: result[0].Value,
                type: result[0].Type,
                notes: result[0].Notes,
                collectionDate: result[0].CollectionDate,
                concern: result[0].Concern,
                source: result[0].Source
            };

            res.json(formattedData);
        });
    } catch (error) {
        console.error("Error getting data by ID:", error);
        res.status(500).send("Internal Server Error");
    }
};

const getDataByConcern = async (req, res) => {
    try {
        let concern = req.params.concern;

        if (!concern)
            return res.status(400).send("Invalid Data");

        const sql = "SELECT * FROM EnvData WHERE (Concern = ?)";
        con.query(sql, [concern], async (err, result) => {
            if (err) throw err;

            if (result.length === 0)
                return res.status(400).send("No data found for the specified concern");

            const formattedData = result.map(item => ({
                id: item.ID,
                value: item.Value,
                type: item.Type,
                notes: item.Notes,
                collectionDate: item.CollectionDate,
                concern: item.Concern,
                source: item.Source
            }));

            res.json({ data: formattedData });
        });
    } catch (error) {
        console.error("Error getting data by concern:", error);
        res.status(500).send("Internal Server Error");
    }
};

const searchDataByTextOrLocation = async (req, res) => {
    try {
        const searchText = req.query.text;
        const searchLocation = req.query.location;
        console.log(searchText)

         if (!searchText && !searchLocation) {
            return res.status(400).send('Invalid Data. Please provide text or location to search.');
        }

         const concernsArray = await matchNLPSet(searchText);

         let query = 'SELECT * FROM EnvData WHERE';
        const queryParams = [];

         if (concernsArray.length > 0) {
             query += ` Concern IN (${concernsArray.map(concern => `'${concern}'`).join(',')})`;
        }

        if (searchText) {
            if (concernsArray.length > 0) {
                query += ' AND';
            }
            query += ' (Notes LIKE ? OR Type LIKE ?)';
            const searchPattern = `%${searchText}%`;
            queryParams.push(searchPattern, searchPattern);
        }

        if (searchLocation) {
            if (concernsArray.length > 0 || searchText) {
                query += ' AND';
            }
            query += ' Location = ?';
            queryParams.push(searchLocation);
        }

         const searchResults = await queryAsync(query, queryParams);

        return res.status(200).json({ results: searchResults, text: searchText, location: searchLocation });
    } catch (error) {
        console.error('Error searching data by text or location:', error);
        return res.status(500).send('Internal Server Error');
    }
};

module.exports = { getDataById, getDataByConcern, searchDataByTextOrLocation };
