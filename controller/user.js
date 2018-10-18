const Joi = require('joi')
const Boom = require('boom')
const Router = require('koa-router')
const router = new Router({
    // prefix: '/user'
})
const paginationUlti = require('../config/pagination')
const authentication = require('../security/authentication')
const userHandler = require('../handler/user')

router.post('/login', async (ctx) => {
    let body = ctx.request.body
    let validSchema = Joi.object().keys({
        username: Joi.string().required(),
        password: Joi.string().required()
    })
    Joi.validate(body, validSchema, (err) => {
        if (err) throw Boom.notAcceptable(err.message)
    })

    let res = await userHandler.login(body)

    ctx.body = {
        message: 'login successfully',
        statusCode: res ? 200 : 400,
        data: res
    }
})
router.post('/register', async (ctx) => {
    let body = ctx.request.body
    let validSchema = Joi.object().keys({
        username: Joi.string().required(),
        password: Joi.string().required(),
        repassword: Joi.string().required(),
        name: Joi.string(),
        email: Joi.string(),
        facebook: Joi.string(),
        phone: Joi.string(),
        city_id: Joi.number(),
        district_id: Joi.number(),
        address: Joi.string(),
    })
    Joi.validate(body, validSchema, (err) => {
        if (err) throw Boom.notAcceptable(err.message)
    })

    let res = await userHandler.register(body)

    ctx.body = {
        message: 'register successfully',
        statusCode: res ? 200 : 400,
        data: res[0] || res
    }
})

/*Use authentication*/
router.use(async (ctx, next) => {
    return authentication(ctx, next)
})

router.get('/user/list', paginationUlti, async (ctx) => {
    let res = await userHandler.getList(ctx.query)
    ctx.body = {
        statusCode: res ? 200 : 400,
        data: {
            users: res
        }
    }
})

router.post('/user/create', async (ctx) => {
    let body = ctx.request.body
    let validSchema = Joi.object().keys({
        username: Joi.string().required(),
        name: Joi.string(),
        email: Joi.string(),
        facebook: Joi.string(),
        phone: Joi.string(),
        city_id: Joi.number(),
        district_id: Joi.number(),
        address: Joi.string(),
    })
    Joi.validate(body, validSchema, (err) => {
        if (err) throw Boom.notAcceptable(err.message)
    })

    let res = await userHandler.create(body)

    ctx.body = {
        message: 'register successfully',
        statusCode: res ? 200 : 400,
        data: res[0] || res
    }
})

router.get('/profile', async (ctx) => {
    let res = await userHandler.profile(ctx.user.user_id)
    ctx.body = {
        statusCode: res ? 200 : 400,
        data: {
            profile: res
        }
    }
})

module.exports = router;