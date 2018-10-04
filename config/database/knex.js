const config = require('../env')
let knex = require('knex')({
    client: 'mysql',
    connection: config.MYSQL_DB,
    pool: {
        min: 0,
        max: 3,
        afterCreate: function (connection, callback) {
            connection.query("SET time_zone = '+07:00';", function (err) {
                callback(err, connection);
            })
        }
    }
})

module.exports = knex