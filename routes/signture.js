/**
 * Author：zhoushuanglong
 * Time：2018-05-09 16:54
 * Description：signture
 */

const express = require('express')
const router = express.Router()
const sign = require('../utils/sign')
const request = require('request')

router.post('/', function (req, res, next) {
    console.log('进入路由')
    let wxshare = {
        signs: []
    }

    // 检查页面链接对应的签名是否可用
    let signtag = false
    let signindex
    wxshare.signs.forEach(function (item, index) {
        if (item.url === req.body.url) {
            signindex = index
            if (item.deadline && new Date().getTime() - item.deadline < 6000000) {
                signtag = true
            }
        }
    })

    if (!signtag) {

    }

    const appID = 'wxec2dc083d4024311'
    const appSecret = 'b78d95fd673f7fe469d2f957e877a34a'

    // 获取access_token
    const tokenUrl = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + appID + '&secret=' + appSecret
    request(tokenUrl, function (error, response, body) {
        if (response.statusCode === 200) {
            body = JSON.parse(body)
            wxshare.access_token = body.access_token
            console.log('获取到access_token' + body.access_token)

            // 获取jsapi_ticket
            const ticketUrl = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + body.access_token + '&type=jsapi'
            request(ticketUrl, function (err, response, content) {
                content = JSON.parse(content)
                console.log('jsapi_ticket' + content.ticket)

                if (content.errcode === 0) {
                    wxshare.jsapi_ticket = content.ticket

                    // 先拿一个当前时间戳，这里我缓存到了global
                    wxshare.deadline = new Date().getTime()
                    const signatureStr = sign(content.ticket, req.body.url)
                    signatureStr.deadline = new Date().getTime()

                    if (signindex && signindex !== 0) {
                        wxshare.signs(signindex, 1, signatureStr)
                    } else {
                        wxshare.signs.push(signatureStr)
                    }

                    console.log(wxshare)

                    // 返回给前端
                    res.status(200).json(signatureStr)
                }
            })
        }
    })
})

module.exports = router
