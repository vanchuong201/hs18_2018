const Boom = require('boom')

module.exports = async (ctx, next) => {
    try {
        if (ctx.request.method !== 'GET' && typeof (ctx.request.body) !== 'object')
            ctx.request.body = JSON.parse(ctx.request.body)
    } catch (ex) {
        throw Boom.badData('request body must be JSON format', ctx.request.body)
    }
    return next()
}