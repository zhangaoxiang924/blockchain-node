/**
 * Author：tantingting
 * Time：2018/4/25
 * Description：Description
 */

const express = require('express')
const router = express.Router()
const utils = require('../utils/public')
let async = require('async')

const axiosAjax = utils.axiosAjax
const ajaxJavaUrl = utils.ajaxJavaUrl
const webInfo = utils.webInfo

/* GET home page. */
router.get('/', function (req, res, next) {
    const coinsData = (resolve) => {
        let sendData = {
            currentpage: 1,
            pagesize: 20,
            coinid: req.query.coinid
        }
        axiosAjax({
            type: 'get',
            url: ajaxJavaUrl + `/market/coin/exchange`,
            params: sendData,
            res: res,
            fn: function (resData) {
                let thisData = null
                if (resData.code === 1) {
                    thisData = resData.data
                } else {
                    thisData = null
                }
                resolve(null, thisData)
            }
        })
    }
    const rateData = (resolve) => {
        axiosAjax({
            type: 'post',
            url: ajaxJavaUrl + '/market/coin/financerate',
            params: {},
            res: res,
            fn: function (resData) {
                let thisData = null
                if (resData.code === 1) {
                    thisData = resData.data.legal_rate
                } else {
                    thisData = null
                }
                resolve(null, thisData)
            }
        })
    }
    async.parallel({
        obj: function (callback) {
            // 处理逻辑
            coinsData(callback)
        },
        rateData: function (callback) {
            // 处理逻辑
            rateData(callback)
        }
    }, function (error, result) {
        if (!error) {
            let resData = {...result}
            // res.send(resData)
            res.render('exchangeList', {
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
})

module.exports = router
