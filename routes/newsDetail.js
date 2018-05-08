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
// const webInfo = utils.webInfo

const pcRes = (req, res, next) => {
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
            res.render('newsDetail', {
                newsData: resData.obj,
                webSiteInfo: {
                    title: `${resData.obj.current.title}_火星财经`,
                    keywords: `${resData.obj.current.tags}，${resData.obj.current.title}`,
                    description: resData.obj.current.synopsis
                }
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

const mRes = (req, res, next) => {
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
            let timestamp = new Date().getTime()
            // console.log(timestamp)
            res.render('m-newsDetail', {
                newsData: {
                    ...resData.obj,
                    timestamp: timestamp
                },
                webSiteInfo: {
                    title: `${resData.obj.current.title}_火星财经`,
                    keywords: `${resData.obj.current.tags}，${resData.obj.current.title}`,
                    description: resData.obj.current.synopsis
                }
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

// router.get('/:id', function (req, res, next) {
router.get('/', function (req, res, next) {
    utils.pageRender({
        req: req,
        res: res,
        mRender: function () {
            mRes(req, res, next)
        },
        pcRender: function () {
            pcRes(req, res, next)
        }
    })
})

module.exports = router
