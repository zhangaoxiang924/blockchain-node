/**
 * Author：tantingting
 * Time：2018/4/23
 * Description：Description
 */

const express = require('express')
const router = express.Router()
const utils = require('../utils/public')

const axiosAjax = utils.axiosAjax
const ajaxJavaUrl = utils.ajaxJavaUrl

/* GET home page. */
router.get('/', function (req, res, next) {
    // /info/topic/listall?currentPage=1&pageSize=20
    // /info/author/showauthorlist?currentPage=1&pageSize=50&myPassportId=63cd65b00e584f9292074ced8cfd47fa
    // /info/news/shownews?currentPage=&pageSize=25&channelId=0
    async function indexData () {
        const hotColumn = await new Promise((resolve) => {
            axiosAjax({
                type: 'GET',
                url: ajaxJavaUrl + '/info/topic/listall?currentPage=1&pageSize=20',
                params: {},
                res: res,
                fn: function (resData) {
                    let thisData = []
                    if (resData.code === 1) {
                        thisData = resData.obj.inforList
                    } else {
                        thisData = []
                    }
                    resolve(thisData)
                }
            })
        })
        const authorList = await new Promise((resolve) => {
            axiosAjax({
                type: 'GET',
                url: ajaxJavaUrl + `/info/author/showauthorlist?currentPage=1&pageSize=50&myPassportId=${req.cookies.hx_user_id}`,
                params: {},
                res: res,
                fn: function (resData) {
                    let thisData = []
                    if (resData.code === 1) {
                        thisData = resData.obj.inforList
                    } else {
                        thisData = []
                    }
                    resolve(thisData)
                }
            })
        })
        const newsData = await new Promise((resolve) => {
            axiosAjax({
                type: 'GET',
                url: ajaxJavaUrl + '/info/news/shownews?currentPage=&pageSize=25&channelId=0',
                params: {},
                res: res,
                fn: function (resData) {
                    let thisData = []
                    if (resData.code === 1) {
                        thisData = resData.obj
                    } else {
                        thisData = null
                    }
                    resolve(thisData)
                }
            })
        })
        return {hotColumn: hotColumn, authorList: authorList, newsData: newsData, userId: req.cookies.hx_user_id}
    }

    indexData().then((resData) => {
        // console.log(resData)
        res.render('index', {data: resData})
        /* if (resData.code === 1) {
            res.render('newsDetail', {newsData: resData.obj})
        } else {
            res.render('error', {
                message: resData.msg,
                error: {
                    status: resData.code,
                    stack: 'Please pass the correct parameters.'
                }
            })
        } */
    })
})

module.exports = router
