const warehouseModel = require('../models/warehouse')
const Boom = require('boom')

exports.importWarehouse = async (user, body) => {
    body.created_by = user.user_id
    //Tạo log  nhập hàng
    let log = await warehouseModel.importWarehouse(body)
    if (!log) {
        throw Boom.notFound('Không ghi được log cập nhật', log)
    }
    //Cập nhật số lượng tồn kho
    return warehouseModel.updateWarehouseByProduct(body.product_id, body.amount)
}

exports.getLogs = async (option) => {
    return warehouseModel.getLogs(option)
}
