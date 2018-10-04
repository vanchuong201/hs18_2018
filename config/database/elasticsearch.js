const config = require('../env')
const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
    host: config.ELASTICSEARCH_DB,
    log: [{
        type: 'stdio',
        levels: ['error']
    }]
})

client.ping({
    requestTimeout: 30000,
}, function (error) {
    if (error) {
        console.error('elasticsearch cluster is down!')
    } else {
        console.log('ElasticSearch is well')
    }
})

module.exports = client