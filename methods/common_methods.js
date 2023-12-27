const axios = require("axios");
const con = require("../project_connections/database_connection");

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

async function matchNLPSet(phrase) {
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

                // Log the structure of the response
                console.log('Response Structure:', response.data);

                // Check if response.data.results is an array with a filter function
                if (Array.isArray(response.data.results) && typeof response.data.results.filter === 'function') {
                    const filteredResults = response.data.results.filter(result => result.value >= 30);
                    const concernsArray = filteredResults.map(result => snakeToTitle(result.matcher).toLowerCase());
                    resolve(concernsArray);
                } else {
                    // If the structure is unexpected, resolve with an empty array or handle accordingly
                    console.error('Unexpected response structure:', response.data);
                    resolve([]);
                }
            } else {
                // If no concerns with count >= 30 are found, resolve with a default concern or handle accordingly
                resolve(['DefaultConcern']);
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

function merge(results) {
    const consolidatedData = results.reduce((acc, obj) => {
        const key = `${obj.FirstName}_${obj.LastName}`;
        if (!acc[key]) {
            acc[key] = { ...obj, Concerns: [obj.Concern] };
        } else {
            acc[key].Concerns.push(obj.Concern);
        }
        delete acc[key].Concern;
        return acc;
    }, {});
    return Object.values(consolidatedData);
}

const queryAsync = async (sql, params) => {
    return new Promise((resolve, reject) => {
        con.query(sql, params, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

module.exports={matchNLP,generateRandomString,snakeCase,getKeyForValueGreaterThanPointFour,snakeToTitle,merge,queryAsync,matchNLPSet}