 const con = require("../../project_connections/database_connection");
const {generateRandomString} = require("../common_methods");
const {db,admin} = require("../../project_connections/firebase_connection");

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
        const emailDoc = await db.collection('emails').doc('emails-map').get()
        await emailDoc.ref.update({[result[0].ID]: admin.firestore.FieldValue.delete()})
        return res.send(`Removed alert ${name}`)
    })
}

const getAlerts = async (req, res) => {
    let sql = "SELECT * FROM Alert WHERE (Email = ?)"
    await con.query(sql, [req.user.email], async (err, results) => {
        if (results.length === 0)
            return res.send("No Alerts Found")
        let alerts = []
        for (const result of results) {
            alerts.push({
                name: result.Name,
                type: result.Type,
                value: result.Value,
                trigger: result.AlertTRigger,
                operation: result[0].Operation
            })
        }

        return res.json({count: results.length, alerts: alerts})
    })
}
const getAlertByName = async (req, res) => {
    console.log(req.params.name)
    let sql = "SELECT * FROM Alert WHERE (Email = ? AND NAME= ?)"
    await con.query(sql, [req.user.email, req.params.name], (err, result) => {
        if (result.length === 0)
            return res.send("No Such Alert")
        const alert = {
            name: result[0].Name,
            type: result[0].Type,
            value: result[0].Value,
            trigger: result[0].AlertTRigger,
            operation: result.Operation
        }
        console.log(alert)
        return res.json(alert)

    })
}

module.exports = {setAlert, removeAlert, getAlerts, getAlertByName}