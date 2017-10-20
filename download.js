const fs = require('fs')
const child_process = require('child_process');
const path = require('path')

function getAudio(videoId, callback) {
    let filePath = path.join(__dirname, 'audio', videoId + '.ogg')
    console.log(filePath)
    fs.exists(filePath, function(exists) {
        if (!exists) {
            let command = 'mkdir audio; ' + 
                    'cd audio;' + 
                    ' youtube-dl -f bestaudio --no-progress -w -o "%(id)s.%(ext)s" --no-post-overwrites --extract-audio --audio-format opus --audio-quality 9 -- "https://youtube.com/watch?v=' + videoId + '";' + 
                    ' mv ' + videoId + '.opus ' + videoId + '.ogg'

            child_process.exec(command, function(error, stdout, stderr) {
                console.log(stdout)
                callback(filePath)
            })
        } else {
            callback(filePath)
        }
    })
}

module.exports = {
    getAudio: getAudio
}

