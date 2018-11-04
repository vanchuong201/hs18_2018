const productModel = require('../models/product')
const warehouseModel = require('../models/warehouse')
const Boom = require('boom')

exports.create = async (user, body) => {
    body.created_by = user.user_id
    let prod_insert = await productModel.createProduct(body)
    if(! prod_insert){
        throw Boom.notFound('Không tạo được sản phầm')
    }
    let re = warehouseModel.createWarehouse({product_id: prod_insert[0]})
    if(!re){
        throw Boom.notFound('Không tạo mới được kho')
    }
    return prod_insert
}

exports.getList = async (option) => {
    return productModel.getList(option)
}

exports.update = async (id, body) => {
    return productModel.updateProduct(id, body)
}