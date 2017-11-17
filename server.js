const express = require('express')
const app = express()
const download = require('./download.js')
const youtube = require('./youtube.js')
const spotify = require('./spotify.js')
const postgres = require('./postgres.js')

app.get('/download', function(req, res) {
    let searchQuery = req.query.searchQuery
    let videoId = req.query.videoId

    if (searchQuery == undefined) {
        if (videoId == undefined) {
            res.send({ error: 'invalid videoId'})            
        } else {
            download.getAudio(videoId, (path) => {
                res.contentType = 'audio/ogg'
                res.download(path)
            })
        }
    } else {
        youtube.getVideoId(searchQuery, (it) => {
            download.getAudio(it, (path) => {
                res.contentType = 'audio/ogg'
                res.download(path)
            })
        })
    }
})

app.get('/metadata', function(req, res) {
    let searchQuery = req.query.searchQuery;
    let user = req.query.user;

    (async () => {
        if (searchQuery == undefined) {
            res.send({ error: 'invalid searchQuery'})
        } else if (user == undefined || !(await postgres.userAllowed(user))) {
            res.send({ error: 'user not allowed'})
        } else {
            spotify.getMetadata(searchQuery, function(result) {
                res.send(result)
            })
        }
    })()  
})
app.listen(3000)