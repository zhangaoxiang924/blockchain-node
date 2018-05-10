/**
 * Author：tantingting
 * Time：2018/4/27
 * Description：Description
 */
import {isPc, isIos, isAndroid, isWeixin} from './public/public'

const {pcUrl} = require('../../config')

$(function () {
    if (isPc()) {
        window.location.href = `http://${pcUrl}`
    }

    // 下载
    let iosUrl = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.linekong.mars24'
    let andUrl = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.linekong.mars24'
    let downLoad = $('.b-down')

    downLoad.on('click', function () {
        if (isIos()) {
            downLoad.attr('href', iosUrl)
        }
        if (isAndroid() || isWeixin()) {
            downLoad.attr('href', andUrl)
        }
    })

    // 返回
    $('.back-prev-page').on('click', function (e) {
        e.preventDefault()
        e.stopPropagation()
        window.history.back()
    })
})
