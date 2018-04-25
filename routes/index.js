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

/* GET home page. */
router.get('/', function (req, res, next) {
    // /info/topic/listall?currentPage=1&pageSize=20
    // /info/author/showauthorlist?currentPage=1&pageSize=50&myPassportId=63cd65b00e584f9292074ced8cfd47fa
    // /info/news/shownews?currentPage=&pageSize=25&channelId=0
    let userId = req.cookies.hx_user_id
    // let hotColumn = null
    // let authorList = null
    // let newsData = null
    // let adData = null
    const hotColumn = (resolve) => {
        axiosAjax({
            type: 'GET',
            url: ajaxJavaUrl + '/info/topic/listall?currentPage=1&pageSize=20',
            params: {},
            res: res,
            fn: function (resData) {
                console.log('111')
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
                console.log('222')
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
            url: ajaxJavaUrl + '/info/news/shownews?currentPage=&pageSize=25&channelId=0',
            params: {},
            res: res,
            fn: function (resData) {
                console.log('333')
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
                console.log('444')
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
    console.log('======')
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
                let hotColumnGroup = [result.hotColumn[2 * i], result.hotColumn[(2 * i) + 1]]
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
            res.render('index', {data: resData, 'title': '火星财经-区块链先锋门户'})
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
})
/* router.get('/', function (req, res, next) {
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
                    console.log('111')
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
                    console.log('222')
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
                    console.log('333')
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
        res.render('index', {data: resData, 'title': '火星财经-区块链先锋门户'})
        /!* if (resData.code === 1) {
            res.render('newsDetail', {newsData: resData.obj})
        } else {
            res.render('error', {
                message: resData.msg,
                error: {
                    status: resData.code,
                    stack: 'Please pass the correct parameters.'
                }
            })
        } *!/
    })
}) */

module.exports = router