/**
 * Author：zhoushuanglong
 * Time：2018-04-10 15:02
 * Description：nodejs public js
 */

const axios = require('axios')

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
// const ajaxJavaUrl = 'http://www.huoxing24.vip'
const ajaxJavaUrl = 'http://www.huoxing24.com'
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

const onlineMUrl = 'm.huoxing24.com'
// const onlineMUrl = 'm.huoxing24.vip'

module.exports = {
    ajaxJavaUrl,
    proxyJavaApi,
    axiosAjax,
    webInfo,
    onlineMUrl
}
