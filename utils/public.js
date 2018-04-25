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

module.exports = {
    ajaxJavaUrl,
    proxyJavaApi,
    axiosAjax
}
