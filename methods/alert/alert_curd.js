const db = require("../../project_connections/firebase_connection");
const con = require("../../project_connections/database_connection");
const {generateRandomString} = require("../common_methods");

const setAlert = async (req, res) => {
    let {type, trigger, value, operation, identifier, name} = req.body;
    if (!type || !trigger || !value) {
        res.status(400).send("Invalid Data");
    }
    const alertId = generateRandomString();
    if (!operation) {
        operation = "N"
    }
    if (type === 'data') {
        if (trigger === 'concern') {
            const concernDoc = await db.collection('data-triggers').doc('concern-triggers').get();
            await concernDoc.ref.update({[alertId]: value})
        } else if (trigger === 'numeric') {
            if (operation === 'N' || !identifier) {
                res.status(400).send("Invalid Data");
            }
            const numericDoc = await db.collection('data-triggers').doc('numerical-triggers').get();
            await numericDoc.ref.update({[alertId]: {op: operation, value, identifier}})
        } else
            res.status(400).send("Invalid Data");

    } else if (type === 'report') {
        if (trigger === 'concern') {
            const concernDoc = await db.collection('report-triggers').doc('concern-triggers').get();
            await concernDoc.ref.update({[alertId]: value})
        } else if (trigger === 'text') {
            const textDoc = await db.collection('data-triggers').doc('numerical-triggers').get();
            await textDoc.ref.update({[alertId]: value})
        } else
            res.status(400).send("Invalid Data");

    } else
        res.status(400).send("Invalid Data");


    const sql = "INSERT INTO Alert (Name, Email, Type,AlertTRigger, ID,Value,Operation) VALUES (?,?,?,?,?,?,?)";
    await con.query(sql, [name.toLowerCase(), req.user.email, type, trigger, alertId, value.toString(), operation]);
    const emailDoc = await db.collection("emails").doc("emails-map").get()
    await emailDoc.ref.update({[alertId]: req.user.email})
    res.send(`Alert ${name} Set`)


}

const removeAlert = async (req, res) => {
    let name = req.params.name
     if (!name)
        return res.status(400).send("Invalid Data");
    let sql = "SELECT * FROM Alert WHERE (Name = ?)"
    await con.query(sql, [name.toLowerCase()], async (err, result) => {
        if (result.length === 0 || result[0].Email !== req.user.email)
            return res.status(400).send("No such alert or you have not set this alert");

        sql = 'DELETE FROM Alert WHERE (Name =? AND Email = ?)'
        await con.query(sql, [name.toLowerCase(), req.user.email])
      return   res.send(`Removed alert ${name}`)
    })
}

module.exports = {setAlert,removeAlert}