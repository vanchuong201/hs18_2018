module.exports = (ctx, next) => {
    let page = parseInt(ctx.query.page)
    if (isNaN(page) || page < 1) {
        page = 1
    }
    ctx.query.page = page
    let limit = parseInt(ctx.query.page_size)
    if (isNaN(limit) || limit < 1 || limit > 30) {
        limit = 10
    }
    ctx.query.page_size = limit
    ctx.query.offset = limit * (page - 1)
    return next()
}