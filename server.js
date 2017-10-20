const express = require('express')
const app = express()
const download = require('./download.js')

app.get('/', function(req, res) {
    let videoId = req.query.videoId

    download.getAudio(videoId, function(path) {
        res.contentType = 'audio/ogg'

        res.download(path)
    })
})

app.listen(3000)