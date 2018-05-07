/**
 * Author：tantingting
 * Time：2018/4/23
 * Description：Description
 */

const express = require('express')
const router = express.Router()
const utils = require('../utils/public')
let async = require('async')

const axiosAjax = utils.axiosAjax
const ajaxJavaUrl = utils.ajaxJavaUrl
const webInfo = utils.webInfo

const pcRes = (req, res, next) => {
    let userId = req.cookies.hx_user_id
    const hotColumn = (resolve) => {
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
                resolve(null, thisData)
            }
        })
    }
    const authorList = (resolve) => {
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
                resolve(null, thisData)
            }
        })
    }
    const newsData = (resolve) => {
        axiosAjax({
            type: 'GET',
            url: ajaxJavaUrl + '/info/news/shownews?currentPage=&pageSize=35&channelId=0',
            params: {},
            res: res,
            fn: function (resData) {
                let thisData = []
                if (resData.code === 1) {
                    thisData = resData.obj
                } else {
                    thisData = null
                }
                resolve(null, thisData)
            }
        })
    }
    const adData = (resolve) => {
        axiosAjax({
            type: 'GET',
            url: ajaxJavaUrl + '/info/ad/showad?adPlace=1,2,3,4,8,9&type=1',
            params: {},
            res: res,
            fn: function (resData) {
                let thisData = []
                if (resData.code === 1) {
                    thisData = resData.obj
                } else {
                    thisData = null
                }
                resolve(null, thisData)
            }
        })
    }
    async.parallel({
        hotColumn: function (callback) {
            // 处理逻辑
            hotColumn(callback)
            // callback(null, 'one')
        },
        authorList: function (callback) {
            // 处理逻辑
            authorList(callback)
        },
        newsData: function (callback) {
            // 处理逻辑
            newsData(callback)
        },
        adData: function (callback) {
            // 处理逻辑
            adData(callback)
        }
    }, function (error, result) {
        if (!error) {
            let adData8 = result.adData[8]
            let hotColumnLen = Math.ceil(result.hotColumn.length / 2)
            let adAndColumn = []
            for (let i = 0; i < hotColumnLen; i++) {
                let ad = []
                let hotColumnGroup = 2 * i === result.hotColumn.length - 1 ? [result.hotColumn[2 * i]] : [result.hotColumn[2 * i], result.hotColumn[(2 * i) + 1]]
                if (adData8.length <= hotColumnLen) {
                    if (!adData8[i]) {
                        ad = []
                    } else {
                        ad.push(adData8[i])
                    }
                } else {
                    if (i === hotColumnLen.length - 1) {
                        ad = adData8.slice(i, adData8.length)
                    }
                }
                let data = {
                    ad: ad,
                    hotColumnGroup: hotColumnGroup
                }
                adAndColumn.push(data)
            }
            let resData = {...result, userId: userId, adAndColumn: adAndColumn}
            // res.send(resData)
            res.render('index', {
                data: resData,
                webSiteInfo: webInfo
            })
        } else {
            console.log(error)
            res.render('error', {
                message: error.message,
                error: {
                    status: error.code,
                    stack: 'Please pass the correct parameters.'
                }
            })
        }
    })
}

const mRes = (req, res, next) => {
    async function newsDetailData () {
        const data = await new Promise((resolve) => {
            let sendData = {
                currentPage: 1,
                pageSize: 20,
                channelId: 0
            }
            axiosAjax({
                type: 'GET',
                url: ajaxJavaUrl + '/info/news/shownews',
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
            res.render('m-index', {
                data: resData.obj,
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
}

/* GET home page. */
router.get('/', function (req, res, next) {
    // mRes(req, res, next)
    const url = req.headers.host
    if (url.indexOf(utils.onlineMUrl) > -1) {
        mRes(req, res, next)
    } else {
        pcRes(req, res, next)
    }
})

// router.get('/m', function (req, res, next) {
//     mRes(req, res, next)
// })

module.exports = router
