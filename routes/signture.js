/**
 * Author：zhoushuanglong
 * Time：2018-05-09 16:54
 * Description：signture
 */

const express = require('express')
const router = express.Router()
const sign = require('../utils/sign')
const request = require('request')

let config = {
    appID: 'wxec2dc083d4024311',
    appSecret: 'b78d95fd673f7fe469d2f957e877a34a'
}

let signTemp = {
    signs: [
        {
            deadline: '',
            jsapi_ticket: '',
            nonceStr: '',
            timestamp: '',
            url: '',
            signature: ''
        }
    ],
    accessTime: '',
    access_token: '',
    jsapi_ticket: '',
    nonceStr: '',
    timestamp: '',
    url: '',
    signature: ''
}

/**
 * 请求获取access_token
 * @param {* URL链接} hrefURL
 * @param {* 回调请求方法} callback
 */
const getAccessToken = (callback) => {
    console.log(config.appID)
    console.log(config.appSecret)
    const tokenUrl = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + config.appID + '&secret=' + config.appSecret
    request(tokenUrl, function (error, response, data) {
        if (error) console.log(error)

        console.log(data)
        console.log('get access_token:' + JSON.parse(data).access_token)

        if (response.statusCode && response.statusCode === 200) {
            const accessToken = JSON.parse(data).access_token
            callback && callback(accessToken)
        }
    })
}

/**
 * 请求获取Jsapi_Ticket
 * @param {* URL链接} hrefURL
 * @param {* token} accessToken
 * @param {* 回调请求方法} callback
 */
const getJsapiTicket = (reqUrl, accessToken, callback) => {
    console.log('ticket need access_token: ' + accessToken)
    const ticketUrl = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + accessToken + '&type=jsapi'
    request(ticketUrl, function (error, response, data) {
        if (error) console.log(error)

        console.log(data)
        console.log('get jsapi_ticket:' + JSON.parse(data).ticket)
        console.log(response.statusCode)

        if (response.statusCode && response.statusCode === 200) {
            const content = JSON.parse(data)

            if (content.errcode === 0) {
                const signatureStr = sign(content.ticket, reqUrl)

                console.log('signatureStr' + signatureStr)
                callback && callback(signatureStr)
            } else if (content.errcode === 40001) {
                console.log('access_token 过期')

                getAccessToken(function (accessTokenIn) {
                    signTemp.accessTime = new Date().getTime()
                    signTemp.access_token = accessTokenIn

                    getJsapiTicket(reqUrl, accessTokenIn, callback)
                })
            }
        }
    })
}

router.post('/', function (req, res, next) {
    console.log('进入路由')
    const reqUrl = req.body.url

    const deadTime = (2 * 60 * 60 * 1000) - 1000 * 1000
    const curentTime = new Date().getTime()
    let signIndex = -1
    let signtag = false

    const aTime = curentTime - signTemp.accessTime < deadTime // access_token是否过期

    for (let index in signTemp.signs) {
        const item = signTemp.signs[index]

        if (item.url === reqUrl) {
            signIndex = index
            if (aTime) {
                signtag = true
            }

            break
        }
    }

    const resJson = (signatureStr) => {
        const curentUrlSign = {
            deadline: new Date().getTime(),
            ...signatureStr
        }

        if (signIndex === -1) {
            signTemp.signs.push(curentUrlSign)
        } else {
            signTemp.signs[signIndex] = curentUrlSign
        }

        res.json(Object.assign(signTemp, signatureStr))
    }

    if (!signtag) {
        console.log('此url未签过名')

        if (aTime) {
            console.log('access_token 未过期')
            getJsapiTicket(reqUrl, signTemp.access_token, function (signatureStr) {
                resJson(signatureStr)
            })
        } else {
            console.log('access_token 已过期')
            getAccessToken(function (accessToken) {
                signTemp.accessTime = new Date().getTime()
                signTemp.access_token = accessToken

                getJsapiTicket(reqUrl, accessToken, function (signatureStr) {
                    resJson(signatureStr)
                })
            })
        }
    } else {
        console.log('此url未签过名并access_token 未过期')
        res.json(signTemp.signs[signIndex])
    }
})

module.exports = router
