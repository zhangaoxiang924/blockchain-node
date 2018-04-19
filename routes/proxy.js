/**
 * Author：zhoushuanglong
 * Time：2018-04-08 21:33
 * Description：proxy
 */
const express = require('express')
const router = express.Router()
const proxyJava = require('express-http-proxy')
const utils = require('../utils/public')

// pc:java接口代理
const javaApi = proxyJava(utils.ajaxJavaUrl, {
    proxyReqPathResolver: function (req) {
        return req.originalUrl
    }
})
for (let value of utils.proxyJavaApi) {
    router.use(value, javaApi)
}

module.exports = router
