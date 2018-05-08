/**
 * Author：tantingting
 * Time：2018/4/25
 * Description：Description
 */

const express = require('express')
const router = express.Router()

const {
    axiosAjax,
    ajaxJavaUrl,
    webInfo
} = require('../utils/public')

/* GET home page. */
router.get('/', function (req, res, next) {
    let searchId = !req.query.id ? 0 : req.query.id
    async function getData () {
        const data = await new Promise((resolve) => {
            let sendData = {
                currentPage: 1,
                pageSize: 10,
                channelId: searchId
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

    getData().then((resData) => {
        if (resData.code === 1) {
            // res.send(resData)
            res.render('news', {
                newsData: {...resData.obj, searchId: searchId},
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
