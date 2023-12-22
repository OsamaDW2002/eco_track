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
module.exports={findMaxKey}