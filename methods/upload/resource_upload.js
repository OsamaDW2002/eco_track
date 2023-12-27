 const { matchNLP, queryAsync} = require("../common_methods");


const uploadResource = async (req, res) => {
    try {
        const { url, name } = req.body;
        const sql = "SELECT * FROM Resources WHERE (URL = ? AND Name = ?)";
        const result = await queryAsync(sql, [url, name.toLowerCase()]);

        if (result.length !== 0) {
            return res.send("URL already exists");
        }

        const concern = await matchNLP(name);
        const source = req.user.email;
        const insertSql = 'INSERT INTO Resources (URL,Name,Concern,Source) VALUES (?,?,?,?)';
        await queryAsync(insertSql, [url, name.toLowerCase(), concern, source]);

        return res.send(`Uploaded resource ${name} successfully`);
    } catch (error) {
        console.error("Error uploading resource:", error);
        return res.status(500).send("Internal Server Error");
    }
};

const removeResource = async (req, res) => {
    try {
        const name = req.params.name;
        console.log(name);
        if (!name) {
            return res.status(400).send("Invalid Data");
        }

        const selectSql = "SELECT * FROM Resources WHERE (Name = ?)";
        const result = await queryAsync(selectSql, [name.toLowerCase()]);

        if (result.length === 0 || result[0].Source !== req.user.email.toLowerCase()) {
            return res.status(400).send("No such resource or you don't own this resource");
        }

        const deleteSql = 'DELETE FROM Resources WHERE (Name =? AND Source = ?)';
        await queryAsync(deleteSql, [name.toLowerCase(), req.user.email.toLowerCase()]);

        return res.send(`Removed resource ${name}`);
    } catch (error) {
        console.error("Error removing resource:", error);
        return res.status(500).send("Internal Server Error");
    }
};

const updateResource = async (req, res) => {
    try {
        const { current_url:currentUrl, new_name:newName, new_url:newUrl } = req.body;

        if (!currentUrl || (!newName && !newUrl)) {
            return res.status(400).send("Invalid Data");
        }

        const selectSql = "SELECT * FROM Resources WHERE (URL = ?)";
        const result = await queryAsync(selectSql, [currentUrl]);

        if (result.length === 0 || result[0].Source !== req.user.email.toLowerCase()) {
            return res.status(400).send("No such resource or you don't own this resource");
        }

        const existingResource = result[0];

        if (newName && newName.toLowerCase() !== existingResource.Name) {
            const nameCheckSql = "SELECT * FROM Resources WHERE (Name = ?)";
            const nameCheckResult = await queryAsync(nameCheckSql, [newName.toLowerCase()]);
            if (nameCheckResult.length !== 0) {
                return res.status(400).send("Resource with the new name already exists");
            }
        }

        if (newUrl && newUrl !== existingResource.URL) {
            const urlCheckSql = "SELECT * FROM Resources WHERE (URL = ?)";
            const urlCheckResult = await queryAsync(urlCheckSql, [newUrl]);
            if (urlCheckResult.length !== 0) {
                return res.status(400).send("Resource with the new URL already exists");
            }
        }

        const updateSql = "UPDATE Resources SET Name=?, URL=? WHERE (URL=? AND Source=?)";
        await queryAsync(updateSql, [newName || existingResource.Name, newUrl || existingResource.URL, currentUrl, req.user.email.toLowerCase()]);

        return res.send(`Updated resource with URL ${currentUrl}`);
    } catch (error) {
        console.error("Error updating resource:", error);
        return res.status(500).send("Internal Server Error");
    }
};

module.exports = { uploadResource, removeResource, updateResource };
