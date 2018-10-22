const models = require('../config/database')
const Promise = require('bluebird')
const tbl_ = 'orders'
const tbl_detail = 'order_detail'

exports.createOrder = async (body) => {
    return models.knex(tbl_).insert(body)
}

let countOrder = exports.countOrder = async (options = {field: 'id'}) => {
    let query = models.knex(tbl_)
        .count(`${options.field || 'id'} as count`)
        .first()
    if (options.category_id) {
        query.where('category_id', options.category_id)
    }
    if (options.name) {
        query.where('name', 'like', options.name)
    }
    return query
}
exports.getList = async (options = {fields: ['*']}) => {
    let order_query = models.knex(tbl_)
        .select(options.fields || ['*'])
        .limit(options.page_size)
        .offset(options.offset)

    if (options.name) {
        order_query.where('name', 'like', options.name)
    }
    if (options.category_id) {
        order_query.where('category_id', options.category_id)
    }

    //----------Total-------------
    let total_order = countOrder(options)

    return Promise.props({
        orders: order_query,
        total: total_order
    })
}

exports.deleteOrder = async (id) => {
    return models.knex(tbl_)
        .delete(tbl_)
        .where('id', id)
}

exports.getOrder = async (id) => {
    return models.knex(tbl_)
        .select('*')
        .where('id', id)
        .first()
}

exports.updateOrder = async (id, body) => {
    return models.knex(tbl_)
        .update(body)
        .where('id', id)
}

exports.createOrderDetail = async (body) => {

    return models.knex.batchInsert(tbl_detail, body, 100)
        .returning(['id'], { returnAutoIncrementedIdsWithMySql: true})
        // .returning('id')
        .then(function (id) {
            return id
        })
        .catch(function (error) {
            return error
        });

    // return await models.knex.transaction(function(tr) {
    //     return models.knex.batchInsert(tbl_detail, body, 100)
    //         .transacting(tr)
    // })
    //     .then(function(res) {console.log('res>>>:',res);})
    //     .catch(function(error) { console.log('error>>>:',error) });
}