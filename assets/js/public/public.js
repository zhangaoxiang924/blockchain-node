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
    const {type, url, params, contentType, formData, fn, noloading} = arg

    let ajaxLoadingStr = `<div class="lk-loading ajax active" id="ajaxLoading">
    <div class="lk-loading-center">
        <div class="lk-loading-center-absolute">
            <div class="round round-one"></div>
            <div class="round round-two"></div>
            <div class="round round-three"></div>
        </div>
    </div>
</div>`

    if (noloading) {
        ajaxLoadingStr = '<div id="ajaxLoading"></div>'
    }

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

const numTrans = (num) => {
    if (num > 99999999) {
        return {value: formatPrice(num / 100000000), label: '亿'}
    } else if (num > 9999 && num < 99999999) {
        return {value: formatPrice(num / 10000), label: '万'}
    } else {
        return {value: formatPrice(num), label: ''}
    }
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

// 计算前7天日期
const sevenDays = () => {
    const formatDate = (y, m, d) => {
        const newM = m < 10 ? `0${m + 1}` : m + 1
        const newD = d < 10 ? `0${d}` : d

        return `${y}-${newM}-${newD}`
    }

    let dateArray = []
    for (let i = 0; i < 7; i++) {
        const caDate = new Date()
        caDate.setDate(caDate.getDate() - i)
        dateArray.push(formatDate(caDate.getFullYear(), caDate.getMonth(), caDate.getDate()))
    }

    return dateArray
}

// 时间戳转日期
const timestampToTime = (timestamp) => {
    const date = new Date(timestamp) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
    const Y = date.getFullYear() + '-'
    const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    const D = date.getDate() + ' '
    const h = date.getHours() + ':'
    const m = date.getMinutes() + ':'
    const s = date.getSeconds()
    return Y + M + D + h + m + s
}

const formatDateMore = (time) => {
    const timemap = new Date(time)
    const y = timemap.getFullYear()
    const m = timemap.getMonth() < 10 ? '0' + (timemap.getMonth() + 1) : timemap.getMonth() + 1
    const d = timemap.getDate() < 10 ? '0' + timemap.getDate() : timemap.getDate()
    const h = timemap.getHours() < 10 ? '0' + timemap.getHours() : timemap.getHours()
    const mn = timemap.getMinutes() < 10 ? '0' + timemap.getMinutes() : timemap.getMinutes()
    return `${y}-${m}-${d} ${h}:${mn}`
}

// 返回顶部
const Animation = () => {
    const timer = setInterval(() => {
        let osTop = document.documentElement.scrollTop || document.body.scrollTop
        document.documentElement.scrollTop = osTop - (osTop) / 8
        document.body.scrollTop = osTop - (osTop) / 8
        if (osTop <= 5) {
            clearInterval(timer)
        }
    }, 10)
}

const ajaxGet = (url, data, fn) => {
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

    $.ajax({
        type: 'GET',
        url: url,
        dataType: 'json',
        data: data,
        error: function () {
            console.log('error')
        },
        success: function (data) {
            $('#ajaxLoading').remove()
            fn.call(window, data, url)
        }
    })
}

// 比较日期，时间大小
const compareCalendar = (startDate, endDate) => {
    if (startDate.indexOf(' ') !== -1 && endDate.indexOf(' ') !== -1) {
        // 包含时间，日期
        return compareTime(startDate, endDate)
    } else {
        // 不包含时间，只包含日期
        return compareDate(startDate, endDate)
    }
}

// 判断日期，时间大小
const compareTime = (startDate, endDate) => {
    if (startDate.length > 0 && endDate.length > 0) {
        const startDateTemp = startDate.split(' ')
        const endDateTemp = endDate.split(' ')

        const arrStartDate = startDateTemp[0].split('-')
        const arrEndDate = endDateTemp[0].split('-')

        const arrStartTime = startDateTemp[1].split(':')
        const arrEndTime = endDateTemp[1].split(':')

        const allStartDate = new Date(arrStartDate[0], arrStartDate[1], arrStartDate[2], arrStartTime[0], arrStartTime[1], arrStartTime[2])
        const allEndDate = new Date(arrEndDate[0], arrEndDate[1], arrEndDate[2], arrEndTime[0], arrEndTime[1], arrEndTime[2])

        if (allStartDate.getTime() >= allEndDate.getTime()) {
            console.log('startTime不能大于endTime，不能通过')
            return false
        } else {
            console.log('startTime小于endTime，所以通过了')
            return true
        }
    } else {
        console.log('时间不能为空')
        return false
    }
}

// 比较日前大小
const compareDate = (checkStartDate, checkEndDate) => {
    let arys1 = []
    let arys2 = []
    if (checkStartDate != null && checkEndDate != null) {
        arys1 = checkStartDate.split('-')
        const sdate = new Date(arys1[0], parseInt(arys1[1] - 1), arys1[2])
        arys2 = checkEndDate.split('-')
        const edate = new Date(arys2[0], parseInt(arys2[1] - 1), arys2[2])
        if (sdate > edate) {
            // console.log('日期开始时间大于结束时间')
            return false
        } else {
            // console.log('通过')
            return true
        }
    }
}

// 滚动方向
const scrollDirect = (fn) => {
    let beforeScrollTop = document.body.scrollTop

    fn = fn || function () {
    }

    window.addEventListener('scroll', function (event) {
        // const event = event || window.event
        const afterScrollTop = parseFloat($(window).scrollTop())
        const delta = afterScrollTop - beforeScrollTop
        beforeScrollTop = afterScrollTop

        const scrollTop = $(this).scrollTop()
        const scrollHeight = $(document).height()
        const windowHeight = $(this).height()
        if (scrollTop + windowHeight > scrollHeight - 10) { // 滚动到底部执行事件
            fn('up')
            return
        }
        if (afterScrollTop < 10 || afterScrollTop > $(document.body).height - 10) {
            fn('up')
        } else {
            if (Math.abs(delta) < 10) {
                return false
            }
            fn(delta > 0 ? 'down' : 'up')
        }
    }, false)
}

// 展示登陆注册弹框
const showLogin = (type, title) => {
    if (type === 'close') {
        $('#loginBlock').css({'display': 'none'})
    } else {
        $('#loginBlock').css({'display': 'block'})
        if (type === 'login') {
            $('#loginModal h1').html(title)
            $('#registerModal').css({'display': 'none'})
            $('#loginModal').css({'display': 'block'})
        } else {
            $('#registerModal h1').html(title)
            $('#registerModal').css({'display': 'block'})
            $('#loginModal').css({'display': 'none'})
            $('#registerModal button').html('注册')
            if (type === 'retrievePassword') {
                $('#registerModal button').html('找回密码')
            }
        }
    }
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
    getHourMinute,
    sevenDays,
    timestampToTime,
    formatDateMore,
    Animation,
    ajaxGet,
    compareCalendar,
    scrollDirect,
    add0,
    numTrans,
    showLogin
}
