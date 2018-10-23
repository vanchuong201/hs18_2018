const Joi = require('joi')
const Boom = require('boom')
const Router = require('koa-router')
const router = new Router({
    prefix: '/category'
})
const paginationUlti = require('../config/pagination')
const authentication = require('../security/authentication')
const categoryHandler = require('../handler/category')

/*Use authentication*/
router.use(async (ctx, next) => {
    return authentication(ctx, next)
})

router.post('/create', async (ctx) => {
    let body = ctx.request.body
    let validSchema = Joi.object().keys({
        name: Joi.string().required(),
        priority: Joi.number(),
    })
    Joi.validate(body, validSchema, (err) => {
        if (err) throw Boom.notAcceptable(err.message)
    })

    let res = await categoryHandler.create(ctx.user, body)

    ctx.body = {
        message: 'Tạo mới danh mục thành công',
        statusCode: res ? 200 : 400,
        data: res[0] || res
    }
})

router.get('/list', paginationUlti, async (ctx) => {
    let res = await categoryHandler.getList(ctx.query)
    ctx.body = {
        statusCode: res ? 200 : 400,
        data: res
    }
})

router.put('/:id', async (ctx) => {
    let cat_id = ctx.params["id"]
    let body = ctx.request.body
    let validSchema = Joi.object().keys({
        name: Joi.string().required(),
        priority: Joi.number()
    })
    Joi.validate(body, validSchema, (err) => {
        if (err) throw Boom.notAcceptable(err.message)
    })

    let res = await categoryHandler.update(cat_id, body)

    ctx.body = {
        message: 'Cập nhật danh mục thành công',
        statusCode: res ? 200 : 400,
        data: res[0] || res
    }
})


module.exports = router;
