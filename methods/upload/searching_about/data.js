const con = require("../../../project_connections/database_connection");

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

module.exports = { getDataById, getDataByConcern };
