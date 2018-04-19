/**
 * Author：tantingting
 * Time：2018/4/9
 * Description：Description
 */

var express = require('express')
var router = express.Router()
const utils = require('../utils/public')
const Cookies = require('js-cookie')

const axiosAjax = utils.axiosAjax
const ajaxJavaUrl = utils.ajaxJavaUrl

/* GET home page. */
router.get('/', function (req, res, next) {
    let newsId = req.query.id
    let newsData = null
    if (!req.query.id) {
        newsData = null
    } else {
        async function indexData () {
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

        indexData().then((resData) => {
            if (resData.code === 1) {
                res.render('newsDetail', {newsData: resData.obj})
            }
        })
    }
})

module.exports = router
