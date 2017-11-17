const { Client } = require('pg')

const connection = 'postgres://michael@localhost:5432/honks'
const client = new Client(connection) // Using environment variables

client.connect(function(err, res) {
    if (err) {
        console.log(err)
    } else {
        console.log('Postgres connected')            
    }
})

async function userAllowed(username) {
    try {
        let res = await client.query('select * from allowed_users where id = $1', [username])

        return res.rows.length != 0 || false
    } catch (err) {
        console.log(err.stack)
    }
}

module.exports = {
    userAllowed: userAllowed
}


