const categoryModel = require('../models/category')

exports.create = async (body) => {
    return categoryModel.createCategory(body)
}

exports.getList = async (option) => {
    return categoryModel.getList(option)
}

exports.update = async (id, body) => {
    return categoryModel.updateCategory(id, body)
}