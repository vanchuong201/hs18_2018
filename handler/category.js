const categoryModel = require('../models/category')

exports.create = async (user, body) => {
    return categoryModel.createCategory(body)
}

exports.getList = async (option) => {
    return categoryModel.getList(option)
}

exports.update = async (id, body) => {
    return categoryModel.updateCategory(id, body)
}