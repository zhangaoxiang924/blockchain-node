/**
 * Author：tantingting
 * Time：2018/4/9
 * Description：Description
 */

const express = require('express')
const router = express.Router()
const utils = require('../utils/public')

const axiosAjax = utils.axiosAjax
const ajaxJavaUrl = utils.ajaxJavaUrl
const webInfo = utils.webInfo

/* GET home page. */
// router.get('/:id', function (req, res, next) {
router.get('/', function (req, res, next) {
    let newsId = req.query.id
    async function newsDetailData () {
        const data = await new Promise((resolve) => {
            let sendData = null
            if (!req.cookies.hx_user_id) {
                sendData = {id: newsId}
            } else {
                sendData = {
                    id: newsId,
                    passportid: req.cookies.hx_user_id
                }
            }
            // console.log(sendData)
            axiosAjax({
                type: 'GET',
                url: ajaxJavaUrl + '/info/lives/getbyid',
                params: sendData,
                res: res,
                fn: function (resData) {
                    resolve(resData)
                }
            })
        })

        return data
    }

    newsDetailData().then((resData) => {
        if (resData.code === 1) {
            // console.log(resData)
            let data = {...resData.obj}
            let title = ''
            let content = ''
            if (!data.title) {
                if (!data.content) {
                    title = ''
                    content = ''
                } else {
                    let startIndex = data.content.indexOf('【') === -1 ? 0 : data.content.indexOf('【') + 1
                    let endIndex = data.content.indexOf('】') === -1 ? 0 : data.content.indexOf('】')
                    title = data.content.substring(startIndex, endIndex)
                    content = data.content.substring(endIndex + 1)
                }
            } else {
                title = data.title
                content = data.content
            }
            let renderData = {
                ...resData.obj,
                title: title,
                content: content,
                currentTime: !resData.currentTime ? new Date().getTime() : resData.currentTime
            }
            // console.log(renderData)
            res.render('liveNewsDetail', {
                data: renderData,
                webSiteInfo: {
                    ...webInfo,
                    title: `${renderData.title}_火星财经`
                }
            })
        } else {
            res.render('error', {
                message: resData.msg,
                error: {
                    status: resData.code,
                    stack: 'Please pass the correct parameters.'
                }
            })
        }
    })
})

module.exports = router
