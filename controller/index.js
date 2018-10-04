const glob = require('glob')

module.exports = (app) => {
    glob(`${__dirname}/*.js`, {
        ignore: '**/index.js'
    }, (err, files) => {
        if (files.length) {
            files.forEach((file) => {
                const controller = require(file)

                app
                    .use(controller.routes())
                    .use(controller.allowedMethods())
            })
        }
    })
}