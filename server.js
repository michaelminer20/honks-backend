const express = require('express')
const app = express()
const download = require('./download.js')
const youtube = require('./youtube.js')

app.get('/download', function(req, res) {
    let searchQuery = req.query.searchQuery
    let videoId = req.query.videoId

    if (searchQuery == undefined) {
        if (videoId == undefined) {
            error = {
                error: {
                    reason: 'no-data-provided'
                }
            }
            res.send(error)
            return
        } else {
            download.getAudio(videoId, (path) => {
                res.contentType = 'audio/ogg'
                res.download(path)
                // res.send({song: {
                //     artist: 'artist',
                //     title: 'title',
                //     album: 'album',
                //     genre: 'genre'
                // }})
            })
        }
    } else {
        youtube.getVideoId(searchQuery, (it) => {
            download.getAudio(it, (path) => {
                res.contentType = 'audio/ogg'
                res.download(path)
                // res.send({song: {
                //     artist: 'artist',
                //     title: 'title',
                //     album: 'album',
                //     genre: 'genre'
                // }})
            })
        })
    }
})

app.get('/get-next', function(req, res) {
    
})
app.listen(3000)