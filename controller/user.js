const Joi = require('joi')
const Boom = require('boom')
const Router = require('koa-router')
const router = new Router({
    // prefix: '/user'
})
const authentication = require('../security/authentication')
const userHandler = require('../handler/user')

router.post('/login', async (ctx) => {
    let body = ctx.request.body
    let validSchema = Joi.object().keys({
        username: Joi.string().required(),
        password: Joi.string().required()
    })
    Joi.validate(body, validSchema, (err) => {
        if (err) throw Boom.notAcceptable('not acceptable')
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
        repassword: Joi.string().required()
    })
    Joi.validate(body, validSchema, (err) => {
        if (err) throw Boom.notAcceptable('not acceptable')
    })

    let res = await userHandler.register(body)

    ctx.body = {
        message: 'register successfully',
        statusCode: res ? 200 : 400,
        data: res
    }
})

/*Use authentication*/
router.use(async (ctx, next) => {
    return authentication(ctx, next)
})

router.get('/profile', async (ctx) => {
    let res = await userHandler.profile(ctx.user.id)
    ctx.body = {
        statusCode: 200,
        data: {
            profile: res
        }
    }
})

module.exports = router;