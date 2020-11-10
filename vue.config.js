'use strict'
const settings = require('./src/setting.js')
const path = require('path')

function resolve(dir) {
    return path.join(__dirname, dir)
}

const name = settings.title // page title

module.exports = {
    publicPath: './',
    outputDir: process.env.VUE_APP_PROJECT_NAME,
    assetsDir: 'static',
    productionSourceMap: false,
    lintOnSave: false,
    devServer: {
        port: 1993,
        overlay: {
            warnings: false,
            errors: true
        },
        contentBase: './',
        proxy: {
            '/': {
                target: process.env.VUE_APP_PROD_REQUEST_DOMAIN_PREFIX,
                ws: true,
                changeOrigin: true
            }
        },
        open: false
    },
    configureWebpack: {
        name: name,
        resolve: {
            alias: {
                '@': resolve('src')
            }
        }
    }
}