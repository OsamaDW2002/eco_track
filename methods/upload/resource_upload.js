const con = require("../../project_connections/database_connection");

const {matchNLP} = require("../common_methods");

const uploadResource = async (req, res) => {
    const {url, name} = req.body
    let sql = "SELECT * FORM Resources WHERE (URL = ? AND Name = ?)"
    await con.query(sql, [url, name.toLowerCase()], async (err, result) => {
        if (result.length !== 0) {
            return res.send("URL already exists")
        }

        const concern = await matchNLP(name);
        const source = req.user.email;
        sql = 'INSERT INTO Resources URL,Name,Concern,Source VALUES(?,?,?,?)'
        await con.query(sql, [url, name.toLowerCase(), concern, source])

        return res.send(`Uploaded resource ${name} successfully`)
    })
}


const removeResource = async (req, res) => {
    let name = req.params.name
    console.log(name)
    if (!name)
        return res.status(400).send("Invalid Data");
    let sql = "SELECT * FROM Resources WHERE (Name = ?)"
    await con.query(sql, [name.toLowerCase()], async (err, result) => {
        if (result.length === 0 || result[0].Source !== req.user.email.toLowerCase())
            return res.status(400).send("No such resource or you don't own this resource");

        sql = 'DELETE FROM Resources WHERE (Name =? AND Source = ?)'
        await con.query(sql, [name.toLowerCase(), req.user.email.toLowerCase()])

        return res.send(`Removed resource ${name}`)
    })
}

const updateResource = async (req, res) => {
    const { url, name } = req.body;

    if (!name || !url) {
        return res.status(400).send("Invalid Data");
    }

    let sql = "SELECT * FROM Resources WHERE (Name = ?)";
    await con.query(sql, [name.toLowerCase()], async (err, result) => {
        if (result.length === 0 || result[0].Source !== req.user.email.toLowerCase()) {
            return res.status(400).send("No such resource or you don't own this resource");
        }

        sql = 'UPDATE Resources SET URL=? WHERE (Name=? AND Source=?)';
        await con.query(sql, [url, name.toLowerCase(), req.user.email.toLowerCase()]);

        return res.send(`Updated resource ${name} successfully`);
    });
};

module.exports = {
    uploadResource,
    removeResource,
    updateResource
};
