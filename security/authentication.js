const config = require('../config/env')
const Boom = require('boom')
const jwt = require('jsonwebtoken')
const userModel = require('../models/user')

module.exports = async (ctx, next) => {
    if (!ctx.request.header['authorization']) {
        throw Boom.unauthorized('Unauthorized')
    }
    /*check token*/
    try {
        let decoded = jwt.verify(ctx.request.header['authorization'], config.SECRET_KEY);
        ctx.user = {
            user_id: decoded.data.id,
            username: decoded.data.username
        }
    } catch (err) {
        throw Boom.unauthorized(err.message)
    }

    // let router = await roleUlti.getRouterByPath(ctx._matchedRoute)
    // if (!router)
    //     throw Boom.notFound('PATH not found')

    let user = await userModel.getUserById(ctx.user.id)
    if (!user)
        throw Boom.notFound('User not found')
    return next()
}