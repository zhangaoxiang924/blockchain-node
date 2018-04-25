/**
 * Author：zhoushuanglong
 * Time：2018-04-08 15:48
 * Description：public
 */

import axios from 'axios'
import layer from 'layui-layer'

const isPc = () => {
    const userAgent = window.navigator.userAgent.toLowerCase()

    const Agents = ['android', 'iphone', 'ipad', 'ipod', 'windows phone']
    let flag = true
    for (let i = 0; i < Agents.length; i++) {
        if (userAgent.indexOf(Agents[i]) > -1) {
            flag = false
            break
        }
    }
    return flag
}

const isIos = () => {
    const userAgent = window.navigator.userAgent.toLowerCase()

    let flag = false
    if (userAgent.indexOf('iphone') > -1 || userAgent.indexOf('ipad') > -1) {
        flag = true
    }
    return flag
}

const isAndroid = () => {
    const userAgent = window.navigator.userAgent.toLowerCase()

    let flag = false
    if (userAgent.indexOf('android') > -1) {
        flag = true
    }
    return flag
}

const isPad = () => {
    const userAgent = window.navigator.userAgent.toLowerCase()

    let flag = false
    if (userAgent.indexOf('ipad') > -1) {
        flag = true
    }
    return flag
}

const isWeixin = () => {
    const userAgent = window.navigator.userAgent.toLowerCase()

    let flag = false
    if (userAgent.indexOf('micromessenger') > -1) {
        flag = true
    }
    return flag
}

const ieVersion = () => {
    const userAgent = window.navigator.userAgent.toLowerCase()

    return userAgent.match(/msie\s\d+/)[0].match(/\d+/)[0] || userAgent.match(/trident\s?\d+/)[0]
}

/**
 * JS：getQueryString(name)
 */
const getQueryString = (key) => {
    let reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)')
    let result = window.location.search.substr(1).match(reg)
    return result ? decodeURIComponent(result[2]) : null
}

/**
 * JS：pageLoadingHide()
 */
const pageLoadingHide = () => {
    const $pageLoading = $('#pageLoading')
    $pageLoading.removeClass('active')
    setTimeout(() => {
        $pageLoading.remove()
    }, 300)
}

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
    const {type, url, params, contentType, formData, fn} = arg

    const ajaxLoadingStr = `<div class="lk-loading ajax active" id="ajaxLoading">
    <div class="lk-loading-center">
        <div class="lk-loading-center-absolute">
            <div class="round round-one"></div>
            <div class="round round-two"></div>
            <div class="round round-three"></div>
        </div>
    </div>
</div>`

    if ($('#ajaxLoading').length === 0) {
        $('body').append(ajaxLoadingStr)
    }

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
        $.each(params, function (key, value) {
            formDataParm.append(key, value)
        })

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
        if ($('#ajaxLoading').length > 0) {
            $('#ajaxLoading').remove()
        }
        if (fn) {
            fn.call(this, data, this)
        }
    }).catch(function (error) {
        layer.msg(error)
    })
}

// 格式化金额
const outputdollars = (number) => {
    if (number.length <= 3) {
        return (number === '' ? '0' : number)
    } else {
        let mod = number.length % 3
        let output = (mod === 0 ? '' : (number.substring(0, mod)))
        for (let i = 0; i < Math.floor(number.length / 3); i++) {
            if ((mod === 0) && (i === 0)) {
                output += number.substring(mod + 3 * i, mod + 3 * i + 3)
            } else {
                output += ',' + number.substring(mod + 3 * i, mod + 3 * i + 3)
            }
        }
        return output
    }
}

// 格式化价格 保留6位有效数字
const formatPrice = (val) => {
    // console.log(val)
    if (!val) {
        return 0
    }
    let price = val
    if (val > 1) {
        price = price.toPrecision(6)
    } else {
        let valStr = val.toString()
        let str = valStr.substring(valStr.indexOf('.') + 1)
        if (str > 5) {
            price = price.toFixed(5)
        } else {
            price = val
        }
    }
    return price
}

// 手机号码验证
const isPoneAvailable = (pone) => {
    const myreg = /^[1][3,4,5,7,8][0-9]{9}$/
    if (!myreg.test(pone)) {
        return false
    } else {
        return true
    }
}

// 超出字数显示省略号
const cutString = (str, len) => {
    // length属性读出来的汉字长度为1
    if (str.length * 2 <= len) {
        return str
    }
    let strlen = 0
    let s = ''
    for (let i = 0; i < str.length; i++) {
        s = s + str.charAt(i)
        if (str.charCodeAt(i) > 128) {
            strlen = strlen + 2
            if (strlen >= len) {
                return s.substring(0, s.length - 1) + '...'
            }
        } else {
            strlen = strlen + 1
            if (strlen >= len) {
                return s.substring(0, s.length - 2) + '...'
            }
        }
    }
    return s
}

// 格式化请求参数
const fomartQuery = (obj) => {
    let str = ''
    for (let [key, val] of Object.entries(obj)) {
        str += `&${key}=${val}`
    }

    return str.substring(1)
}

// 格式化时间
const formatDate = (date, str) => {
    let _str = !str ? '-' : str
    const zero = (m) => {
        return m < 10 ? '0' + m : m
    }
    let time = new Date(date)
    let y = time.getFullYear()
    let m = time.getMonth() + 1
    let d = time.getDate()
    if (date) {
        return y + _str + zero(m) + _str + zero(d)
    } else {
        return ''
    }
}

const getTimeContent = (publishTime, requestTime) => {
    let limit = parseInt((requestTime - publishTime)) / 1000
    let content = ''
    if (limit < 60) {
        content = '刚刚'
    } else if (limit >= 60 && limit < 3600) {
        content = Math.floor(limit / 60) + '分钟前'
    } else if (limit >= 3600 && limit < 86400) {
        content = Math.floor(limit / 3600) + '小时前'
    } else {
        content = formatDate(publishTime)
    }
    return content
}
// 加0
const add0 = (num) => {
    return num >= 10 ? num : '0' + num
}
// 获取时分
const getHourMinute = (time) => {
    const timeTemp = new Date(time)
    return `${add0(timeTemp.getHours())}:${add0(timeTemp.getMinutes())}`
}

const lang = 'zh'
const proxyUrl = ''

export {
    isPc,
    isIos,
    isAndroid,
    isWeixin,
    isPad,
    ieVersion,
    getQueryString,
    pageLoadingHide,
    axiosAjax,
    proxyUrl,
    lang,
    outputdollars,
    isPoneAvailable,
    fomartQuery,
    cutString,
    formatDate,
    formatPrice,
    getTimeContent,
    getHourMinute
}
