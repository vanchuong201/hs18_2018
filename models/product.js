const models = require('../config/database')
const Promise = require('bluebird')
const tbl_ = 'products'

exports.createProduct = async (body) => {
    return models.knex(tbl_).insert(body)
}

let countProduct = exports.countProduct = async (options = { field: 'id' }) => {
    let query = models.knex(tbl_)
        .count(`${options.field || 'id'} as count`)
        .first()
    if(options.category_id){
        query.where('category_id', options.category_id)
    }
    if(options.name){
        query.where('name', 'like', options.name)
    }
    return query
}
exports.getList = async (options = { fields: ['*'] }) => {
    let product_query = models.knex(tbl_)
        .select(options.fields || ['*'])
        .limit(options.page_size)
        .offset(options.offset)

    if (options.name) {
        product_query.where('name', 'like', options.name)
    }
    if(options.category_id){
        product_query.where('category_id', options.category_id)
    }

    //----------Total-------------
    let total_product_query = countProduct(options)
    
    return Promise.props({
        events: product_query,
        total: total_product_query
    })
}

exports.updateProduct = async (id, body) => {
    return models.knex(tbl_)
        .update(body)
        .where('id', id)
}