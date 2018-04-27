/**
 * Author：tantingting
 * Time：2018/4/27
 * Description：Description
 */
import {isPc, isIos, isAndroid, isWeixin, getQueryString} from '../js/public/public'

$(function () {
    if (isPc()) {
        if (window.location.href.indexOf('newsdetail') !== -1) {
            window.location.href = `/newsdetail?id=${getQueryString('id')}`
        } else {
            window.location.href = '/'
        }
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
})
