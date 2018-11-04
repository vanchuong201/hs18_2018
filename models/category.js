const models = require('../config/database')
const tbl_ = 'product_categories'

exports.createCategory = async (body) => {
    return models.knex(tbl_).insert(body)
}

exports.getList = async (options = { fields: ['*'] }) => {
    let product_query = models.knex(tbl_)
        .select(options.fields || ['*'])
        .limit(options.page_size)
        .offset(options.offset)

    if (options.name) {
        product_query.where('name', 'like', options.name)
    }
    return product_query
}

exports.updateCategory = async (id, body) => {
    return models.knex(tbl_).update(body).where('id', id)
}