const models = require('../config/database')
const Promise = require('bluebird')
const tbl_ = 'warehouse'
const tbl_logs = 'warehouse_logs'

/*Logs*/
exports.importWarehouse = async (body) => {
    return models.knex(tbl_logs).insert(body)
}

let countLogs = exports.countLogs = async (options = { field: 'id' }) => {
    return models.knex(tbl_)
        .count(`${options.field || 'id'} as count`)
        .first()
}
exports.getLogs = async (options = {fields:['*']}) => {
    let query = models.knex(tbl_logs)
        .select(options.fields || ['*'])
        .limit(options.page_size)
        .offset(options.offset)

    let total = countLogs(options)
    return Promise.props({
        products: query,
        total: total
    })
}

/*Warehouse*/
exports.updateWarehouseById = async (id, num) => {
    return models.knex(tbl_).update({inventory: num}).where('id', id)
}

exports.updateWarehouseByProduct = async (prod_id, num) => {
    return models.knex(tbl_).update({inventory: num}).where('product_id', prod_id)
}

exports.createWarehouse = async (body) => {
    return models.knex(tbl_).insert(body)
}

exports.getInventoryOfProduct = async (prod_id) => {
    return models.knex(tbl_).select(['inventory']).where('product_id', prod_id).first()
}
