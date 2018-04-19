/**
 * Author：zhoushuanglong
 * Time：2018-04-08 21:33
 * Description：proxy
 */

const express = require('express')
const router = express.Router()
const proxyJava = require('express-http-proxy')
const utils = require('../utils/public')

// bbs:php接口代理
const phpApi = proxyJava(utils.ajaxPhpUrl, {
    proxyReqPathResolver: function (req) {
        return req.originalUrl.split('/api/bbs')[1]
    }
})
for (let value of utils.proxyPhpApi) {
    router.use(value, phpApi)
}

// pc:java接口代理
const javaApi = proxyJava(utils.ajaxJavaUrl, {
    proxyReqPathResolver: function (req) {
        return req.originalUrl.split('/api/pc')[1]
    }
})
for (let value of utils.proxyJavaApi) {
    router.use(value, javaApi)
}

module.exports = router
