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
                    passportId: req.cookies.hx_user_id
                }
            }
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
            console.log(resData)
            res.render('liveNewsDetail', {
                data: {
                    ...resData.obj,
                    currentTime: !resData.currentTime ? new Date().getTime() : resData.currentTime
                },
                webSiteInfo: webInfo
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
