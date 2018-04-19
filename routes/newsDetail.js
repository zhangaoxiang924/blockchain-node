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

/* GET home page. */
router.get('/', function (req, res, next) {
    let newsId = req.query.id

    async function newsDetailData () {
        const data = await new Promise((resolve) => {
            let sendData = null
            if (!req.cookies.hx_user_token) {
                sendData = {id: newsId}
            } else {
                sendData = {
                    id: newsId,
                    passportId: req.cookies.hx_user_id,
                    token: req.cookies.hx_user_token
                }
            }
            axiosAjax({
                type: 'GET',
                url: ajaxJavaUrl + '/info/news/getbyid',
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
            res.render('newsDetail', {newsData: resData.obj})
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
