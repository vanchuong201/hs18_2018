const koa = require('koa')
const logger = require('koa-logger')
const bodyParser = require('koa-bodyparser')
const app = new koa()
const cors = require('@koa/cors')
const port = process.env.port || 3000
const static = require('koa-static')

app.use(static('public'));
app.use(cors())
app.use(logger())

app.use(async (ctx, next) => {
    try {
        await next()
        if (ctx.body && typeof (ctx.body) === 'object') {
            ctx.body.data = ctx.body.data || ""
            ctx.body.message = ctx.body.message || ""
            ctx.body.error = ctx.body.error || ""
        }
    } catch (err) {
        console.log('error form index', err.stack)
        var response = {}

        if (err.isBoom) {
            response = err.output.payload
        }

        ctx.body = response
        ctx.body.statusCode = response.statusCode || 502
        ctx.body.data = ctx.body.data || ""
        ctx.message = ctx.body.message || ""
        ctx.error = ctx.body.error || ""
    }
})

app.use(bodyParser({
    multipart: true,
    urlencoded: true,
    jsonLimit: '5mb',
    formLimit: '5mb'
}))

var controller = require('./controller')
controller(app)

app.listen(port)
console.log("App running at " + port)