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
    let userId = !req.query.userId ? '' : req.query.userId
    async function getData () {
        const data = await new Promise((resolve) => {
            let sendData = {
                currentPage: 1,
                pageSize: 10,
                passportId: userId,
                status: 1
            }
            axiosAjax({
                type: 'GET',
                url: ajaxJavaUrl + '/info/news/showcolumnlist',
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
            res.render('newsAuthor', {
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
