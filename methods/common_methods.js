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

module.exports={findMaxKey,generateRandomString}