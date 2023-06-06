const fs = require("fs");
function toArrayBuffer(buffer) {
    const arrayBuffer = new ArrayBuffer(buffer.length);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];
    }
    return arrayBuffer;
} 
2
[1,2,3,4]
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
songsObj.add("Anri - DRIVING MY LOVE",".mp3")
songsObj.add("Mariya Takeuchi - 中森明菜 OH NO, OH YES! (cover)",".mp3")
songsObj.add("Anri - Shyness boy",".mp3")
module.exports = {
    songsObj: songsObj,
    sendMissing: sendMissing
}