const request = require('request')
const fs = require('fs')
const paths = require('path')

function getMetadata(query, callback) {
    fs.readFile(paths.join(__dirname, 'spotify_access_token.json'), function(err, content) {
        let options = {
            url: 'https://api.spotify.com/v1/search?q=' + query + '&type=track&limit=1',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + JSON.parse(content).token
            }
        }
    
        request(options, function(statusCode, result) {
            let data = JSON.parse(result.body)
            let metadata = {}
    
            metadata.title = data.tracks.items[0].name
            let artists = []
            metadata.album = data.tracks.items[0].album.name
    
            console.log(data.tracks.items[0].artists[0].name)
    
            for (var i = 0; i < data.tracks.items[0].artists.length; i++) {
                artists.push(data.tracks.items[0].artists[i].name)
            }
            metadata.artists = artists
    
            callback(metadata)
        })
    })   
}

module.exports = {
    getMetadata: getMetadata
}