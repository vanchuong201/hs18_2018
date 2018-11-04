const Joi = require('joi')
const Boom = require('boom')
const Router = require('koa-router')
const router = new Router({
    prefix: '/order'
})
const paginationUlti = require('../config/pagination')
const authentication = require('../security/authentication')
const orderHandler = require('../handler/order')

/*Use authentication*/
router.use(async (ctx, next) => {
    return authentication(ctx, next)
})

router.post('/create', async (ctx) => {
    let body = ctx.request.body
    let validSchema = Joi.object().keys({
        products: Joi.array().items(
            Joi.object().keys({
                id: Joi.number().required(),
                quantity: Joi.number().required()
            })
        ),
        fee_ship: Joi.number(),
        user_id: Joi.number(),
        ship_name: Joi.string(),
        ship_address: Joi.string(),
        city_id: Joi.number(),
        district_id: Joi.number(),
        phone: Joi.string(),
        email: Joi.string(),
        facebook: Joi.string(),
        note: Joi.string(),
        status: Joi.number(),
        is_shipped: Joi.number(),
        is_paid: Joi.number(),
        tracking_code: Joi.string().allow(["", null]),
    })
    Joi.validate(body, validSchema, (err) => {
        if (err) throw Boom.notAcceptable(err.message)
    })

    let res = await orderHandler.create(ctx.user, body)
    ctx.body = {
        message: 'Tạo mới đơn hàng thành công',
        statusCode: res ? 200 : 400,
        data: res
    }
})

router.get('/list', paginationUlti, async (ctx) => {
    let res = await orderHandler.getList(ctx.query)
    ctx.body = {
        statusCode: res ? 200 : 400,
        data: res
    }
})

router.get('/:id', async (ctx) => {
    let res = await orderHandler.getOrderDetail(ctx.params["id"])
    ctx.body = {
        statusCode: res ? 200 : 400,
        data: res
    }
})

//confirm = "shipped" || "paid" || "confirm" || "done" || rejected || cancel || update
router.put('/:id/:confirm', async (ctx) => {
    let order_id = ctx.params["id"], confirm = ctx.params["confirm"]
    let body = ctx.request.body

    let validSchema = Joi.object().keys({
        fee_ship: Joi.number(),
        user_id: Joi.number(),
        ship_name: Joi.string(),
        ship_address: Joi.string(),
        city_id: Joi.number(),
        district_id: Joi.number(),
        phone: Joi.string(),
        email: Joi.string(),
        facebook: Joi.string(),
        note: Joi.string(),
    })
    Joi.validate(body, validSchema, (err) => {
        if (err) throw Boom.notAcceptable(err.message)
    })

    let res = await orderHandler.update(order_id, body, confirm)

    ctx.body = {
        message: res.mess,
        statusCode: res ? 200 : 400,
        data: res.orderUpdate
    }
})


module.exports = router;
