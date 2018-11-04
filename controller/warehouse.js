const Joi = require('joi')
const Boom = require('boom')
const Router = require('koa-router')
const router = new Router({
    prefix: '/warehouse'
})
const paginationUlti = require('../config/pagination')
const authentication = require('../security/authentication')
const warehouseHandler = require('../handler/warehouse')

/*Use authentication*/
router.use(async (ctx, next) => {
    return authentication(ctx, next)
})

router.post('/import', async (ctx) => {
    let body = ctx.request.body
    let validSchema = Joi.object().keys({
        product_id: Joi.number().integer().min(0).invalid(0),
        amount: Joi.number().min(0).invalid(0),
    })
    Joi.validate(body, validSchema, (err) => {
        if (err) throw Boom.notAcceptable(err.message)
    })

    let res = await warehouseHandler.importWarehouse(body)

    ctx.body = {
        message: 'Nhập kho thành công',
        statusCode: res ? 200 : 400,
        data: res[0] || res
    }
})

router.get('/logs', paginationUlti, async (ctx) => {
    let res = await warehouseHandler.getLogs(ctx.query)
    ctx.body = {
        statusCode: res ? 200 : 400,
        data: res
    }
})

module.exports = router;
