/**
 * Author：tantingting
 * Time：2018/4/25
 * Description：Description
 */

const express = require('express')
const router = express.Router()
let async = require('async')

const {
    axiosAjax,
    ajaxJavaUrl,
    webInfo
} = require('../utils/public')

/* GET home page. */
router.get('/', function (req, res, next) {
    const coinsData = (resolve) => {
        let sendData = {
            currentPage: 1,
            pageSize: 20,
            passportId: !req.cookies.hx_user_id ? '' : req.cookies.hx_user_id,
            myCollect: 0
        }
        axiosAjax({
            type: 'post',
            url: ajaxJavaUrl + '/market/coin/querycoins',
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
        coinsData: function (callback) {
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
            res.render('markets', {
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
