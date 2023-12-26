const con = require("../../project_connections/database_connection");
const axios = require("axios");
const {snakeCase, getKeyForValueGreaterThanPointFour, snakeToTitle} = require("../common_methods");
const addConcern = async (req, res) => {
    const concern = req.params.concern
    let sql = 'SELECT * FROM Concerns WHERE (Concern = ?)'
    await con.query(sql, [concern.toLowerCase()], async (err, result) => {
        if (result.length !== 0) {
            return res.send("Concern already exists")
        }
        sql = 'SELECT * FROM Concerns'
        let matchers = {}
        await con.query(sql, async (err, result) => {
            if (result.length !== 0) {
                for (const res of result) {
                    matchers[snakeCase(res.Concern)] = res.Concern.toLowerCase()
                }
                const response = await axios.post(process.env.NLP_ENDPOINT, {
                    "input_phrase": concern,
                    "matchers": matchers
                });
                console.log(response.data)
                if (getKeyForValueGreaterThanPointFour(response.data.results) === 'DNE') {
                    sql = 'INSERT INTO Concerns (Concern) VALUES(?)'
                    await con.query(sql, [snakeToTitle(concern.toLowerCase()).toLowerCase()])
                } else
                    return res.send(`Your suggested concern ${concern} already exists under the name ${snakeToTitle(getKeyForValueGreaterThanPointFour(response.data.results))}`)


                return res.send(`Added concern: ${concern}`)
            }

        })

    })
}
module.exports = addConcern