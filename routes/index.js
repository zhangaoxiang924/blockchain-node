const express = require('express')
const router = express.Router()
const utils = require('../utils/public')

const axiosAjax = utils.axiosAjax
const ajaxPhpUrl = utils.ajaxJavaUrl

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: ajaxPhpUrl})
    // async function indexData () {
    //     const data = await new Promise((resolve) => {
    //         axiosAjax({
    //             type: 'GET',
    //             url: ajaxPhpUrl + '/info/news/getbyid',
    //             params: {},
    //             res: res,
    //             fn: function (data) {
    //                 resolve(data)
    //             }
    //         })
    //     })
    //
    //     return data
    // }
    //
    // indexData().then((data) => {
    //     res.render('index', {...data, title: '123'})
    // })
})

module.exports = router
