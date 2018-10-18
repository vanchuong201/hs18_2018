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

exports.getList = async (body, field = ['*']) => {
    return models.knex(tbl_)
        .select(field)

}

exports.updateInfo = async (username, body) => {
    return models.knex(tbl_)
        .update(body)
        .where('username', username)
}

exports.getUserById = (id, field = ['*']) => {
    console.log(models.knex(tbl_)
        .select(field)
        .where('id', id)
        .first().toString())
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