const config = require('../env')
const redis = require('redis')
const client = redis.createClient(config.REDIS_DB)
const {
    promisify
} = require('util')
const getAsyncList = promisify(client.lrange).bind(client)
const updateAsyncList = promisify(client.lset).bind(client)
const setAsyncString = promisify(client.set).bind(client)
const incrAsyncString = promisify(client.incr).bind(client)
const getAsyncString = promisify(client.get).bind(client)

client.on('ready', (err) => {
    console.log('redis is well')
})

client.on('error', (err) => {
    console.log("Error " + err)
})

module.exports = {
    client: client,
    getAsyncList: getAsyncList,
    updateAsyncList: updateAsyncList,
    setAsyncString: setAsyncString,
    incrAsyncString: incrAsyncString,
    getAsyncString: getAsyncString
}