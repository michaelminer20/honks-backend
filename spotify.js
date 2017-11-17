const request = require('request')
const fs = require('fs')
const paths = require('path')

function getMetadata(query, callback) {
    fs.readFile(paths.join(__dirname, 'spotify_access_credentials.json'), function (err, content) {
        let credentials = JSON.parse(content)
        let client_id = credentials.client_id
        let client_secret = credentials.client_secret

        // your application requests authorization
        let authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            headers: {
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            form: {
                grant_type: 'client_credentials'
            },
            json: true
        }

        request.post(authOptions, function (error, response, body) {
            if (!error && response.statusCode == 200) {

                // Use the access token to access the Spotify Web API
                let token = body.access_token;

                let options = {
                    url: 'https://api.spotify.com/v1/search?q=' + query + '&type=track&limit=1',
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + token
                    }
                }

                request(options, function (statusCode, result) {
                    let data = JSON.parse(result.body)
                    let metadata = {}
                    
                    metadata.title = data.tracks.items[0].name
                    let artists = []
                    metadata.album = data.tracks.items[0].album.name

                    for (var i = 0; i < data.tracks.items[0].artists.length; i++) {
                        artists.push(data.tracks.items[0].artists[i].name)
                    }
                    metadata.artists = artists

                    callback(metadata)
                })
            }
        })
    })
}

module.exports = {
    getMetadata: getMetadata
}