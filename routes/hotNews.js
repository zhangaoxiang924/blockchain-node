/**
 * Author：tantingting
 * Time：2018/4/25
 * Description：Description
 */

const express = require('express')
const router = express.Router()
const utils = require('../utils/public')

const axiosAjax = utils.axiosAjax
const ajaxJavaUrl = utils.ajaxJavaUrl
const webInfo = utils.webInfo

/* GET home page. */
router.get('/', function (req, res, next) {
    let tags = !req.query.tags ? '' : req.query.tags
    async function getData () {
        const data = await new Promise((resolve) => {
            let sendData = {
                currentPage: 1,
                pageSize: 20,
                tags: tags
            }
            axiosAjax({
                type: 'GET',
                url: ajaxJavaUrl + '/info/news/relatednews1',
                params: sendData,
                res: res,
                fn: function (resData) {
                    resolve(resData)
                }
            })
        })

        return data
    }

    getData().then((resData) => {
        if (resData.code === 1) {
            // res.send(resData)
            res.render('hotNews', {
                data: {...resData.obj, currentTime: new Date().getTime()},
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
