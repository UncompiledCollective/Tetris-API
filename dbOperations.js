const {createPool} = require("mysql");
// res - result passed from express.
// pool - pool decalred in server.js
//
function findIndex(reference, obj, callback) {
    if (!reference.length) {
        return null
    }
    let temp;
    let temp2 = null;
    for (let x = 0; x < reference.length; x++) {
        for (y in reference[x]) {
            if (reference[x][y] !== obj[y]) {
                temp = false;
                break;
            }
            temp = true;

        }
        if (temp) {
            temp2 = x
            break
        }
    }
    callback(temp2);
}
function filterSame(array, reference, callback) {
    let temp = [];
    for (let x = 0; x < reference.length; x++) {
        if (array.includes(reference[x].avatar_id)) {
            continue;
        }
        temp.push(reference[x]);
    }
    callback(temp)
}
module.exports = {
    findIndex: findIndex,
    filterSame: filterSame,
}