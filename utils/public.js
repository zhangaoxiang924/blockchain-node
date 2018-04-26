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
    keywords: '区块链，区块链项目，区块链是什么，区块链概念股，区块链论坛，区块链社区，区块链服务，区块链培训，区块链资讯，区块链活动，区块链市场，区块链投资，区块链百科，虚拟币，数字货币，挖矿，虚拟币是什么，数字货币是什么，怎么挖矿，挖矿是什么，coinmarketcap，比特币，比特币今日价格，比特币交易平台，莱特币，以太坊',
    description: '火星财经是集新闻、资讯、行情、数据等区块链信息等专业服务平台，致力于为区块链创业者以及数字货币投资者提供最新最及时的项目报道、投资顾问、项目分析、市场行情'
}

module.exports = {
    ajaxJavaUrl,
    proxyJavaApi,
    axiosAjax,
    webInfo
}
