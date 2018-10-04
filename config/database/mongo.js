const config = require('../env')
const mongoose = require('mongoose')

mongoose.Promise = global.Promise;
mongoose.connect(config.MONGO_DB, {
    useMongoClient: true,
    autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('open', function () {
    console.log('mongodb is well')
})

let logsSchema = mongoose.Schema({
    id: Number
})

exports.logs = mongoose.model('logs', logsSchema)