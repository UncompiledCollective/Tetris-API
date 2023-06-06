const fs = require("fs");
function sendMissing(number, array, callback = false) {
    let temp = [];
    for (let x = number; x < array.length; x++) {
        temp.push(array[x])
    }
    if (callback) {
        if (temp.length === 0) {
            callback(0);
        } else {
            callback(temp);
        }
    }
}
const songsObj = {
    songs: [],
    add: function(title = "", format = ".mp3"){
        let string = "./songs/" + title + format;
        let buffer = fs.readFileSync(string);
        return this.songs.push({ title: title, audio: buffer });
        
    }
}
songsObj.add("Anri - Shyness boy", ".mp3");
module.exports = {
    songsObj: songsObj,
    sendMissing: sendMissing
}