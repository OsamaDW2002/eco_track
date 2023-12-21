const axios = require('axios');
const con = require('../../project_connections/database_connection')
const uploadData = async (req, res) => {
    const {value, type, notes, collectionDate} = req.body;
    if (!value || !type || !notes || !collectionDate) {
        res.send("Invalid Data")
    }
    const response = await axios.post("http://127.0.0.1:5000/match_percentage", {
        "input_phrase": notes + " " + type,
        "matchers": {
            "clean_energy": "Clean Energy",
            "global_warming": "Global Warming",
            "deforestation": "Deforestation",
            "extinction":"Extinction",
            "air_pollution":"Air Pollution",
            "water_pollution":"Water Pollution",
            "noise_pollution":"Noise Pollution"
        }
    })

    const concern = findMaxKey(response.data.results);
    const user = req.user.email;
    const sql = "INSERT INTO EnvData (Value,Type,Notes,CollectionDate,Concern,Source) VALUES (?, ?, ?, ?, ?, ?)"
    await con.query(sql,[value,type,notes,collectionDate,concern,user]);
    res.send("Data uploaded")
}
function findMaxKey(results) {
    let maxKey = null;
    let maxValue = null;

    for (const key in results) {
        if (results.hasOwnProperty(key)) {
            const value = results[key];

            if (maxValue === null || value > maxValue) {
                maxValue = value;
                maxKey = key;
            }
        }
    }

    return maxKey;
}

module.exports={uploadData}