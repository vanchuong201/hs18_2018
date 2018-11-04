const orderModel = require('../models/order')
const userHandler = require('../handler/user')
const productHandler = require('../handler/product')
const Boom = require('boom')
const orderStatus = require('../config/order_status')
// const _ = require('lodash')

exports.create = async (user, body) => {
    if (!body.products || body.products.length < 1) {
        throw Boom.notAcceptable('Hình như có gì đó sai sai!!!. Không tìm thấy sản phẩm của đơn hàng')
    }

    /** Tạo customer nếu chưa có*/
    if (!body.user_id) {
        if (!body.phone && !body.email)
            throw Boom.notAcceptable('Không có thông tin người nhận')
        let insertUser = {
            username: body.phone || body.email,
            name: body.ship_name,
            email: body.email,
            facebook: body.facebook,
            phone: body.phone,
            city_id: body.city_id,
            district_id: body.district_id,
            address: body.ship_address,
        }
        body.user_id = await userHandler.create(insertUser);
    }

    /** get list product detail */
    let prod_ids = body.products.map((prod) => {
        return prod.id;
    })
    let order_products = await productHandler.getList({ids: prod_ids, fields: ['id', 'name', 'price']})

    /** Create Order */
    let insertOrder = {
        user_id: body.user_id,
        ship_name: body.ship_name,
        ship_address: body.ship_address,
        city_id: body.city_id,
        district_id: body.district_id,
        phone: body.phone,
        email: body.email,
        facebook: body.facebook,
        note: body.note,
        is_shipped: body.is_shipped,
        is_paid: body.is_paid,
        tracking_code: body.tracking_code,
        created_by: user.user_id
    }
    let order = await orderModel.createOrder(insertOrder)

    /** Create oderDetail */
    if (!order[0]) {
        throw Boom.badData('Lỗi tạo order. Thử lại !!!')
    }
    // map productDetail + productQuantity
    let product_orderDetails = [body.products, order_products.products].reduce((a, b) => a.map((c, i) => Object.assign({}, c, b[i])));
    /*let insert_orderDetails2 = _.map(body.products, function(item){
        return _.extend(item, _.find(order_products.products, { id: item.id }));
    });*/
    return insertOrderDetail(order[0], product_orderDetails)
}

let insertOrderDetail = exports.insertOrderDetail = async (order_id, product_orderDetails) => {
    let insert_orderDetails = product_orderDetails.map((prod) => {
        return {
            order_id: order_id,
            product_id: prod.id,
            product_name: prod.name,
            quantity: prod.quantity,
            price: prod.price

        }
    })
    let res = await orderModel.createOrderDetail(insert_orderDetails)
    if (!res || res == undefined || res == 'undefined' || typeof res == undefined) { // Nếu tạo order detail lỗi thì xóa order vừa tạo xong
        let order_deleted = await orderModel.deleteOrder(order[0])
        if (order_deleted)
            throw Boom.notAcceptable('Tạo chi tiết đơn hàng thất bại')
        else
            throw Boom.notAcceptable('Tạo chi tiết đơn hàng thất bại, ko xóa được đơn hàng đã tạo. Xóa thủ công đê em ei !!!')
    }
    return order_id;
}

exports.getList = async (option) => {
    return orderModel.getList(option)
}

//confirm = "shipped" || "paid" || "confirm" || "done" || rejected || cancel || update
exports.update = async (id, body, confirm) => {
    let orderDetail = await getOrderById(id)
    if (!orderDetail.id)
        throw Boom.badData('Không tìm thấy lô tem')
    if ((orderDetail.status == orderStatus.done || orderDetail.status == orderStatus.cancel || orderDetail.status == orderStatus.rejected ||
        orderDetail.is_shipped == 1 || orderDetail.is_paid) && body.fee_ship)
        throw Boom.badData('Trạng thái đơn hàng ko cho phép cập nhật phí ship')

    let dataUpdate = {}, mess = ''
    switch (confirm) {
        case "shipped":
            mess = 'Xác nhận đã giao hàng!'
            dataUpdate = {is_shipped: 1}
            break;
        case "paid":
            mess = 'Xác nhận đã thanh toán!'
            dataUpdate = {is_paid: 1}
            break
        case "confirm":
            mess = 'Xác nhận đơn hàng thành công'
            dataUpdate = {status: orderStatus.confirmed}
            break
        case "done":
            mess = 'Xác nhận đơn hàng đã hoàn thành'
            dataUpdate = {status: orderStatus.done}
            break
        case "reject":
            mess = 'Từ chối đơn hàng'
            dataUpdate = {status: orderStatus.rejected}
            break
        case "cancel":
            mess = "Đã hủy đơn"
            dataUpdate = {status: orderStatus.cancel}
            break
        case "update":
            if (!body.user_id) {
                if (!body.phone && !body.email)
                    throw Boom.notAcceptable('Không có thông tin người nhận')
                let insertUser = {
                    username: body.phone || body.email,
                    name: body.ship_name,
                    email: body.email,
                    facebook: body.facebook,
                    phone: body.phone,
                    city_id: body.city_id,
                    district_id: body.district_id,
                    address: body.ship_address,
                }
                body.user_id = await userHandler.create(insertUser);
            }
            dataUpdate = body
            break;
        default:
            throw Boom.notAcceptable('Sai linh cmnr !!!')
    }
    let re = await orderModel.updateOrder(id, dataUpdate);
    return {
        mess: mess,
        orderUpdate: re[0] || re
    }
}

let getOrderById = exports.getOrderById = async (id) => {
    return orderModel.getOrder(id)
}

exports.getOrderDetail = async (order_id) => {
    return orderModel.getOrderDetail(order_id)
}
