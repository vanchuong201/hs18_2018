const productModel = require('../models/product')

exports.create = async (user, body) => {
    body.created_by = user.user_id
    return productModel.createProduct(body)
}

exports.getList = async (option) => {
    return productModel.getList(option)
}

exports.update = async (id, body) => {
    return productModel.updateProduct(id, body)
}