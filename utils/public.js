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
const javaPrefix = '/pc'
const proxyJavaApi = [
    // javaPrefix + '/info/news/getbyid',
    javaPrefix + '/market/coin/total',
    javaPrefix + '/market/coin/financerate',
    javaPrefix + '/passport/account/login',
    javaPrefix + '/passport/account/register',
    javaPrefix + '/passport/account/getbackuserpw',
    javaPrefix + '/passport/account/getverifcode',
    javaPrefix + '/passport/account/logout',
    javaPrefix + '/info/news/getauthorinfo', // 作者信息
    javaPrefix + '/info/news/relatednews', // 相关新闻
    javaPrefix + '/info/ad/showad', // 广告
    javaPrefix + '/info/follow/author/delete', // 取消关注
    javaPrefix + '/info/follow/author/add', // 关注
    javaPrefix + '/market/coin/querycoins', // 行情
    javaPrefix + '/info/comment/getbyarticle', // 获取评论
    javaPrefix + '/info/comment/del', // 删除评论
    javaPrefix + '/info/comment/add', // 添加评论
    javaPrefix + '/info/comment/reply', // 回复
    javaPrefix + '/info/news/collect' // 收藏
]

/**
 * php: bbs接口代理
 */
const ajaxPhpUrl = 'http://wecenter.huoxing24.vip'
const phpPrefix = '/bbs'
const proxyPhpApi = [
    phpPrefix,
    phpPrefix + '/account/ajax/profiles_setting'
]

module.exports = {
    ajaxPhpUrl,
    ajaxJavaUrl,
    proxyPhpApi,
    proxyJavaApi,
    axiosAjax
}
