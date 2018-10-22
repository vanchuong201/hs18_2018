const models = require('../config/database')
const tbl_ = 'users'

exports.login = async (username, password, field = ['*']) => {
    return models.knex(tbl_)
        .select(field)
        .where('username', username)
        .where('password', password)
        .first()
}

exports.createUser = async (body) => {
    return models.knex(tbl_).insert(body)
}

let countUser = exports.countUser = async (options = { field: 'id' }) => {
    let query = models.knex(tbl_)
        .count(`${options.field || 'id'} as count`)
        .first()
    if(options.name){
        query.where('name', 'like', options.name)
    }
    return query
}
exports.getList = async (options, field = ['*']) => {
    let user_list_query = models.knex(tbl_)
        .select(field)
    if(options.name){
        user_list_query.where('name', 'like', options.name)
    }

    //----------Total-------------
    let total_user = countUser(options)

    return Promise.props({
        users: user_list_query,
        total: total_user
    })
}

exports.updateInfo = async (username, body) => {
    return models.knex(tbl_)
        .update(body)
        .where('username', username)
}

exports.getUserById = (id, field = ['*']) => {
    return models.knex(tbl_)
        .select(field)
        .where('id', id)
        .first()
}

exports.getUserByUsername = (username, field = ['*']) => {
    return models.knex(tbl_)
        .select(field)
        .where('username', username)
        .first()
}