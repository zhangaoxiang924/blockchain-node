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
 * 请求获取Jsapi_Ticket
 * @param {* URL链接} hrefURL
 * @param {* token} accessTtoken
 * @param {* 回调请求方法} callback
 */
const jsapiTicket = (reqUrl, accessTtoken, callback) => {
    const ticketUrl = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + accessTtoken + '&type=jsapi'
    request(ticketUrl, function (error, response, content) {
        console.log('get jsapi_ticket:' + JSON.parse(content).ticket)

        if (response.statusCode && response.statusCode === 200) {
            content = JSON.parse(content)
            if (content.errcode === 0) {
                const signatureStr = sign(content.ticket, reqUrl)

                console.log('signatureStr' + signatureStr)
                callback && callback(signatureStr)
            }
        }
    })
}

/**
 * 请求获取access_token
 * @param {* URL链接} hrefURL
 * @param {* 回调请求方法} callback
 */
const accessToken = (callback) => {
    const tokenUrl = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + config.appID + '&secret=' + config.appSecret
    request(tokenUrl, function (error, response, content) {
        console.log('get access_token:' + JSON.parse(content).access_token)

        if (response.statusCode && response.statusCode === 200) {
            const accessToken = JSON.parse(content).access_token
            callback && callback(accessToken)
        }
    })
}

router.post('/', function (req, res, next) {
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
        if (aTime) {
            jsapiTicket(reqUrl, signTemp.access_token, function (signatureStr) {
                resJson(signatureStr)
            })
        } else {
            accessToken(function (accessToken) {
                signTemp.accessTime = new Date().getTime()
                signTemp.access_token = accessToken

                jsapiTicket(reqUrl, accessToken, function (signatureStr) {
                    resJson(signatureStr)
                })
            })
        }
    } else {
        res.json(signTemp.signs[signIndex])
    }
})

module.exports = router
