const axios = require("axios");
const con = require("../project_connections/database_connection");
const {resolve} = require("path");

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
function generateRandomString() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
}

function snakeCase(text) {
    text = text.trim().replace(/\W+/g, '_');
    return text.toLowerCase();
}

async function matchNLP(phrase) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Concerns';
        let matchers = {};
        con.query(sql, async (err, results) => {
            if (err) {
                reject(err);
            }
            if (results.length !== 0) {
                for (const res of results) {
                    matchers[snakeCase(res.Concern)] = res.Concern.toLowerCase();
                }
                const response = await axios.post(process.env.NLP_ENDPOINT, {
                    input_phrase: phrase,
                    matchers: matchers,
                });
                resolve(snakeToTitle(findMaxKey(response.data.results)).toLowerCase());
            }
        });
    });
}

function getKeyForValueGreaterThanPointFour(inputMap) {
    let keyForValueGreaterThanPointFour = 'DNE';

    for (const key in inputMap) {
        const value = inputMap[key];
        if (value > 40.0) {
            keyForValueGreaterThanPointFour = key;
            break;
        }
    }

    return keyForValueGreaterThanPointFour;
}
function snakeToTitle(str) {
     let stringWithSpaces = str.replace(/_/g, ' ');

     return stringWithSpaces.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

module.exports={matchNLP,generateRandomString,snakeCase,getKeyForValueGreaterThanPointFour,snakeToTitle}