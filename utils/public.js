/**
 * Author：zhoushuanglong
 * Time：2018-04-10 15:02
 * Description：nodejs public js
 */

const axios = require('axios')
const fs = require('fs')
const path = require('path')

const {
    mUrl,
    pcUrl
} = require('../config')

/**
 * JS：axiosAjax({
        type: 'post',
        url: '/info/news/columnadd',
        contentType: 'application/x-www-form-urlencoded',
        formData: true,
        params: {
            dataone: 'one',
            datatwo: 'two'
        },
        fn: function (data) {
            console.log(data)
        }
    })
 */
const axiosAjax = (arg) => {
    const {type, url, params, contentType, formData, fn, res} = arg

    let opt = null
    const ajaxType = type.toLowerCase()
    if (ajaxType === 'post') {
        opt = {
            method: type,
            url: url,
            data: params
        }
    } else if (ajaxType === 'get') {
        opt = {
            method: type,
            url: url,
            params: params
        }
    }

    if (formData) {
        let formDataParm = new URLSearchParams()
        for (let key in params) {
            formDataParm.append(key, params[key])
        }

        opt = {
            method: type,
            url: url,
            data: formDataParm
        }
    }

    if (contentType) {
        opt.headers = {
            'Content-Type': contentType
        }
    }

    axios(opt).then(function (response) {
        const data = response.data

        if (fn) {
            fn.call(this, data)
        }
    }).catch(function (err) {
        if (res) {
            console.log(err)
            res.render('error', {
                message: 'Request error',
                error: {
                    status: err.response.status,
                    stack: err.response.data
                }
            })
        }
    })
}

/**
 * java: pc接口代理
 */
const ajaxJavaUrl = `http://${pcUrl}`
const proxyJavaApi = [
    '/*',
    '/*/*',
    '/*/*/*',
    '/*/*/*/*',
    '/*/*/*/*/*'
]

const webInfo = {
    title: '火星财经-区块链先锋门户',
    keywords: '区块链,比特币,以太坊,eos,莱特币,瑞波币,挖矿,数字货币,区块链是什么,区块链技术,什么是区块链,比特币行情,比特币价格,比特币是什么,比特币今日价格,coinmarketcap,王峰十问,新闻早八点',
    description: '火星财经是集新闻、资讯、行情、数据等区块链信息等专业服务平台，致力于为区块链创业者以及数字货币投资者提供最新最及时的项目报道、投资顾问、项目分析、市场行情'
}

/**
 * JS：pageRender({
 *     req: req,
 *     res: res,
 *     mRender: function(){},
 *     pcRender: function(){}
 * })
 */

const onlineMUrl = mUrl
const onlinePcUrl = pcUrl

const isPc = (userAgentStr) => {
    const userAgent = userAgentStr.toLowerCase()

    const Agents = ['android', 'iphone', 'ipod', 'windows phone']
    let flag = true
    for (let i = 0; i < Agents.length; i++) {
        if (userAgent.indexOf(Agents[i]) > -1) {
            flag = false
            break
        }
    }
    return flag
}

const routerPcM = [
    'newsdetail'
]

const pageRender = (arg) => {
    const {req, res, mRender, pcRender} = arg
    const domain = req.headers.host
    const userAgent = req.headers['user-agent']
    const originalUrl = req.originalUrl

    let isRouterPcM = false
    for (let value of routerPcM) {
        if (originalUrl.indexOf(value) > -1) {
            isRouterPcM = true
            break
        }
    }

    if (isPc(userAgent)) {
        if (domain.indexOf(onlineMUrl) > -1) {
            if (isRouterPcM) {
                res.redirect('//' + onlinePcUrl + originalUrl)
            } else {
                res.redirect('//' + onlinePcUrl)
            }
        }
        if (pcRender) {
            pcRender()
        }
    } else {
        if (domain.indexOf(onlinePcUrl) > -1) {
            if (isRouterPcM) {
                res.redirect('//' + onlineMUrl + originalUrl)
            } else {
                res.redirect('//' + onlineMUrl)
            }
        }
        if (mRender) {
            mRender()
        }
    }
}

// 创建多级目录
const mkDirs = (dirname, callback) => {
    fs.stat(dirname, (err, stats) => {
        if (!err) {
            callback()
        } else {
            mkDirs(path.dirname(dirname), function () {
                fs.mkdir(dirname, callback)
            })
        }
    })
}

module.exports = {
    mkDirs,
    ajaxJavaUrl,
    proxyJavaApi,
    axiosAjax,
    webInfo,
    pageRender
}
