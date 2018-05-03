/**
 * Author：tantingting
 * Time：2018/4/9
 * Description：Description
 */

import {
    axiosAjax,
    proxyUrl,
    lang,
    outputdollars,
    isPoneAvailable,
    getQueryString,
    fomartQuery,
    cutString,
    isPc,
    showLogin
} from './public/public'
import Cookies from 'js-cookie'
import {Reply} from './newsDetail/index'

$(function () {
    if (isPc() === false) {
        if (window.location.href.indexOf('newsdetail') !== -1) {
            window.location.href = `http://m.huoxing24.com/newsdetail?id=${getQueryString('id')}`
        } else {
            window.location.href = 'http://m.huoxing24.com/'
        }
    }

    // 顶部行情
    const getRollMsg = () => {
        axiosAjax({
            type: 'get',
            url: `${proxyUrl}/market/coin/total`,
            contentType: 'application/x-www-form-urlencoded',
            formData: false,
            noloading: true,
            params: {},
            fn: function (res) {
                let coinArr = res.data.coin
                if (res.code === 1) {
                    axiosAjax({
                        type: 'get',
                        url: `${proxyUrl}/market/coin/financerate`,
                        contentType: 'application/x-www-form-urlencoded',
                        formData: false,
                        noloading: true,
                        params: {},
                        fn: function (resData) {
                            let str = ''
                            if (resData.code === 1) {
                                let coinType = lang === 'zh' ? resData.data.legal_rate.CNY : resData.data.legal_rate.USD
                                // let newCoinArr = []
                                coinArr.map(function (item, i) {
                                    // newCoinArr.push(Object.assign({}, d, {price_usd: d.price_usd * coinType}))
                                    let priceUsd = parseFloat(item.price_usd * coinType).toFixed(3)
                                    let intPrice = outputdollars(priceUsd.toString().split('.')[0])
                                    priceUsd = intPrice + '.' + priceUsd.toString().split('.')[1]
                                    str += '<div class="coin-info"><span class="name">' + item.symbol + '-' + item.cn_name + '&nbsp;&nbsp;</span><span class="price"><span>￥</span><span>' + priceUsd + '</span></span><span class="rate rateUp ' + (parseFloat(item.percent_change_24h) < 0 ? `down` : `up`) + '"><i class="trend"></i>' + parseFloat(item.percent_change_24h) + '%</span></div>'
                                })
                                // console.log(newCoinArr)
                            }
                            $('#coinInfo').html(str)
                        }
                    })
                }
            }
        })
    }
    getRollMsg()
    setInterval(function () {
        getRollMsg()
    }, 60000)

    // 是否登录
    let hasLogin = Cookies.get('hx_user_token') || ''
    let hxNickName = Cookies.get('hx_user_nickname') || ''
    if (!hasLogin) {
        isLogin(false)
    } else {
        isLogin(true, hxNickName)
    }

    //
    let pathname = location.href
    if (pathname.indexOf('/user') > -1) {
        $('#navLoginContent a.login').addClass('login-active')
    }

    function getImgBtn () {
        axiosAjax({
            type: 'POST',
            url: `${proxyUrl}/passport/account/getGraphCode`,
            params: {},
            fn: function (resData) {
                $('#codeImg').attr('src', '/passport/account/getGraphCode')
            }
        })
    }

    function isLogin (flag, nickName) {
        let navLoginContent = $('#navLoginContent')
        if (!flag) {
            // 没有登录
            navLoginContent.find('span.login').css({'display': 'inline-block'})
            navLoginContent.find('a.login').html('').css({'display': 'none'})
            navLoginContent.find('#loginOut').css({'display': 'none'})
            navLoginContent.find('.register').css({'display': 'inline-block'})
        } else {
            // 登录
            navLoginContent.find('span.login').css({'display': 'none'})
            navLoginContent.find('a.login').html(cutString(nickName, 8)).css({'display': 'inline-block'})
            navLoginContent.find('#loginOut').css({'display': 'inline-block'})
            navLoginContent.find('.register').css({'display': 'none'})
        }
    }

    // 搜索
    $('.search-box-btn').on('click', function () {
        isShowsearch()
    })
    $('.search-content-div .close').on('click', function () {
        isShowsearch('close')
    })

    function isShowsearch (type) {
        let per = $('.search-content-div')
        if (type === 'close') {
            per.find('.search-content').removeClass('active')
            per.find('.close').removeClass('active')
            per.find('.search-content input').val('')
        } else {
            per.find('.search-content').addClass('active')
            per.find('.close').addClass('active')
        }
    }

    // 回车搜索
    document.addEventListener('keydown', (event) => {
        if ($('.search-content').hasClass('active') && event.keyCode === 13) {
            let val = $('.search-content-div .search-content input').val()
            location.href = `/search?val=${val}`
        }
    })

    // 登录
    $('.show-login').on('click', function () {
        showLogin('login', '登录')
    })

    let verifcategory = '1' // 1注册， 2找回密码

    $('.show-register').on('click', function () {
        verifcategory = '1'
        showLogin('register', '注册')
    })

    $('.forget-password').on('click', function () {
        verifcategory = '2'
        showLogin('retrievePassword', '找回密码')
    })
    // 注销
    $('#loginOut').on('click', function () {
        loginOut()
    })

    function loginOut () {
        axiosAjax({
            type: 'get',
            url: `${proxyUrl}/passport/account/logout`,
            formData: false,
            params: {passportid: Cookies.get('hx_user_id')},
            fn: function (res) {
                if (res.code === 1) {
                    Cookies.remove('hx_user_token')
                    Cookies.remove('hx_user_id')
                    Cookies.remove('hx_user_nickname')
                    Cookies.remove('hx_user_url')
                    Cookies.remove('hx_user_phone')
                    Cookies.remove('hx_user_realAuth')
                    Cookies.remove('hx_user_createTime')
                    isLogin(false)
                    $('iframe').attr('src', res.obj)
                    if (getQueryString('bbs')) {
                        window.location.href = getQueryString('bbs')
                    }
                    if (window.location.href.indexOf('/newsdetail') !== -1) {
                        // 评论
                        let newsId = getQueryString('id')
                        let reply = new Reply($('#replyBox'), newsId)
                        reply.init()
                    }
                }
            }
        })
    }

    $('#loginBlock .login-close').on('click', function () {
        showLogin('close')
    })

    // 获取验证吗
    $('#getCodeBtn').on('click', function () {
        etAuthCode()
        // $(this).css({'display': 'none'})
        // $('#waitTime').css({'display': 'block'})
    })

    $('#codeBtn').on('click', function () {
        setPhoneCode()
    })

    $('.refresh').on('click', function () {
        getImgBtn()
    })

    $('#verificationImg .close-img').on('click', function () {
        isShowImgModal(false)
    })

    function isShowImgModal (isShow) {
        if (!isShow) {
            $('.code-shade').removeClass('show')
            $('.verification-img').removeClass('show')
        } else {
            $('.code-shade').addClass('show')
            $('.verification-img').addClass('show')
        }
    }

    function etAuthCode () {
        let thisModal = $('#registerModal')
        const phoneNumber = $.trim(thisModal.find('input[name="phone"]').val())
        let hasError = false
        let hasErrorEl = thisModal.find('.error-msg')
        let errorMsg = ''
        if (phoneNumber === '') {
            hasError = true
            errorMsg = '手机号不能为空'
        } else if (!isPoneAvailable(phoneNumber)) {
            hasError = true
            errorMsg = '请输入正确的手机号'
        } else {
            hasError = false
            errorMsg = ''
        }
        // param = `countrycode=86&&phonenum=${phoneNumber.toString()}&&verifcategory=${codeType}`
        if (hasError) {
            showErrorMsg(hasError, errorMsg, hasErrorEl)
            return
        }
        isShowImgModal(true)
        getImgBtn()
    }

    function setPhoneCode () {
        isShowImgModal(false)
        let thisModal = $('#registerModal')
        const phoneNumber = $.trim(thisModal.find('input[name="phone"]').val())
        let hasError = false
        let hasErrorEl = thisModal.find('.error-msg')
        let errorMsg = ''
        let param = null
        let codeType = verifcategory
        let codeVal = $('input.code-text').val()
        param = {
            'phonenum': phoneNumber,
            'countrycode': '86',
            'verifcategory': codeType,
            'graphcode': codeVal
        }
        let paramStr = fomartQuery(param)
        axiosAjax({
            type: 'post',
            url: `${proxyUrl}/passport/account/getverifcode?${paramStr}`,
            formData: false,
            params: {},
            fn: function (res) {
                if (res.code === 1) {
                    let times = 60
                    let waitTime = $('#waitTime')
                    $('#getCodeBtn').css({'display': 'none'})
                    waitTime.css({'display': 'block'})
                    let timer = setInterval(function () {
                        if (times > 0) {
                            times--
                            waitTime.html(`${times}S`)
                        } else {
                            $('#getCodeBtn').css({'display': 'block'})
                            waitTime.css({'display': 'none'})
                            clearInterval(timer)
                            waitTime.html(`${times}S`)
                        }
                    }, 1000)
                } else {
                    hasError = true
                    errorMsg = res.msg
                    showErrorMsg(hasError, errorMsg, hasErrorEl)
                }
            }
        })
    }

    // 登录提交
    $('#loginModal button').on('click', function (e) {
        signinSubmit(e, 'login')
    })

    // 注册提交
    $('#registerModal button').on('click', function (e) {
        let type = 'register'
        if (verifcategory === '2') {
            type = 'retrievePassword'
        }
        signinSubmit(e, type)
    })

    function showErrorMsg (hasError, msg, el) {
        el.html(msg)
        if (!hasError) {
            el.removeClass('show')
        } else {
            el.addClass('show')
        }
    }

    function loginSub (res) {
        $('iframe').attr('src', res.obj.bbsLogin)
        Cookies.set('hx_user_realAuth', res.obj.realAuth, {expires: 7})
        Cookies.set('hx_user_intro', !res.obj.introduce ? '' : res.obj.introduce, {expires: 7})
        Cookies.set('hx_user_token', res.obj.token, {expires: 7})
        Cookies.set('hx_user_id', res.obj.passportId, {expires: 7})
        Cookies.set('hx_user_nickname', res.obj.nickName, {expires: 7})
        Cookies.set('hx_user_url', res.obj.iconUrl, {expires: 7})
        Cookies.set('hx_user_phone', res.obj.phoneNumber, {expires: 7})
        Cookies.set('hx_user_createtime', res.obj.createTime, {expires: 7})
        isLogin(true, res.obj.nickName)
        showLogin('close')
        if (getQueryString('bbs')) {
            window.location.href = getQueryString('bbs')
        }
        if (window.location.href.indexOf('/newsdetail') !== -1) {
            // 评论
            let newsId = getQueryString('id')
            let reply = new Reply($('#replyBox'), newsId)
            reply.init()
        }
    }

    function signinSubmit (event, type) {
        const eType = event.type.toLowerCase()
        const eCode = parseInt(event.keyCode)
        if ((eType === 'keydown' && eCode === 13) || eType === 'click') {
            let thisModal = $('#loginModal')
            // phone code pwd repwd
            const phoneNumber = $.trim(thisModal.find('input[name="phone"]').val())
            const password = $.trim(thisModal.find('input[name="pwd"]').val())
            let hasError = false
            let hasErrorEl = thisModal.find('.login-error-msg')
            let errorMsg = ''
            let urlLastStr = ''
            let sendData = null
            let fun = null
            // let loginSub = null
            if (type === 'login') {
                if (phoneNumber === '') {
                    hasError = true
                    errorMsg = '手机号不能为空'
                } else if (!isPoneAvailable(phoneNumber)) {
                    hasError = true
                    errorMsg = '请输入正确的手机号'
                } else if (password === '') {
                    hasError = true
                    errorMsg = '密码不能为空'
                } else {
                    hasError = false
                    errorMsg = ''
                    urlLastStr = '/login'
                    sendData = {'phonenum': phoneNumber, 'password': password}
                    fun = (res) => {
                        loginSub(res)
                    }
                }
            } else {
                // 注册
                thisModal = $('#registerModal')
                hasErrorEl = thisModal.find('.error-msg')
                const phoneNumber = $.trim(thisModal.find('input[name="phone"]').val())
                const password = $.trim(thisModal.find('input[name="pwd"]').val())
                const authCode = $.trim(thisModal.find('input[name="code"]').val())
                const rePassword = $.trim(thisModal.find('input[name="repwd"]').val())
                if (phoneNumber === '') {
                    hasError = true
                    errorMsg = '手机号不能为空'
                } else if (!isPoneAvailable(phoneNumber)) {
                    hasError = true
                    errorMsg = '请输入正确的手机号'
                } else if (authCode === '') {
                    hasError = true
                    errorMsg = '验证码不能为空'
                } else if (password === '') {
                    hasError = true
                    errorMsg = '密码不能为空'
                } else if (rePassword === '') {
                    hasError = true
                    errorMsg = '请确认密码'
                } else if (password !== rePassword) {
                    hasError = true
                    errorMsg = '密码输入不一致，请重新输入'
                } else {
                    hasError = false
                    errorMsg = ''
                    urlLastStr = '/register' // 注册
                    sendData = {
                        'phonenum': phoneNumber,
                        'password': password,
                        'verifcode': authCode,
                        'verifcategory': '1'
                    }
                    if (type === 'retrievePassword') {
                        urlLastStr = '/getbackuserpw' // 找回密码
                        sendData = {
                            ...sendData,
                            'verifcategory': '2'
                        }
                    }

                    fun = () => {
                        loginFunc('/login', {'phonenum': phoneNumber, 'password': password}, (res) => {
                            if (res.code === 1) {
                                hasError = false
                                errorMsg = ''
                                loginSub(res)
                            } else {
                                hasError = true
                                errorMsg = res.msg
                            }
                            showErrorMsg(hasError, errorMsg, hasErrorEl)
                        })
                    }
                }
            }

            if (!hasError) {
                loginFunc(urlLastStr, sendData, (res) => {
                    if (res.code === 1) {
                        hasError = false
                        errorMsg = ''
                        fun(res)
                    } else {
                        hasError = true
                        errorMsg = res.msg
                    }
                    showErrorMsg(hasError, errorMsg, hasErrorEl)
                })
            } else {
                showErrorMsg(hasError, errorMsg, hasErrorEl)
            }
        }
    }

    function loginFunc (urlLastStr, sendData, fun) {
        // '/passport/account/login', '/passport/account/register', '/passport/account/retrievePassword'
        let paramStr = fomartQuery(sendData)
        let url = `${proxyUrl}/passport/account${urlLastStr}?${paramStr}`
        axiosAjax({
            type: 'post',
            url: url,
            formData: false,
            params: {},
            fn: function (resData) {
                if (fun) {
                    fun(resData)
                }
            }
        })
    }
})
