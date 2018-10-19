const Joi = require('joi')
const Boom = require('boom')
const Router = require('koa-router')
const router = new Router({
    prefix: '/product'
})
const paginationUlti = require('../config/pagination')
const authentication = require('../security/authentication')
const productHandler = require('../handler/product')

/*Use authentication*/
router.use(async (ctx, next) => {
    return authentication(ctx, next)
})

router.post('/create', async (ctx) => {
    let body = ctx.request.body
    let validSchema = Joi.object().keys({
        name: Joi.string().required(),
        price: Joi.number().required(),
        image: Joi.string().allow(["", null]),
        category_id: Joi.number().required(),
        stock: Joi.number().required(),
        unit: Joi.number()
    })
    Joi.validate(body, validSchema, (err) => {
        if (err) throw Boom.notAcceptable(err.message)
    })

    let res = await productHandler.create(ctx.user, body)

    ctx.body = {
        message: 'Tạo mới sản phẩm thành công',
        statusCode: res ? 200 : 400,
        data: res[0] || res
    }
})

router.get('/list', paginationUlti, async (ctx) => {
    let res = await productHandler.getList(ctx.query)
    ctx.body = {
        statusCode: res ? 200 : 400,
        data: res
    }
})

router.put('/:id', async (ctx) => {
    let product_id = ctx.params["id"]
    let body = ctx.request.body
    let validSchema = Joi.object().keys({
        name: Joi.string().required(),
        price: Joi.number().required(),
        image: Joi.string().allow(["", null]),
        category_id: Joi.number().required(),
        stock: Joi.number().required(),
        unit: Joi.number()
    })
    Joi.validate(body, validSchema, (err) => {
        if (err) throw Boom.notAcceptable(err.message)
    })

    let res = await productHandler.update(product_id, body)

    ctx.body = {
        message: 'Cập nhật sản phẩm thành công',
        statusCode: res ? 200 : 400,
        data: res[0] || res
    }
})


module.exports = router;
