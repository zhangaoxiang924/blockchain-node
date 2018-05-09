/**
 * Author：tantingting
 * Time：2018/4/27
 * Description：Description
 */
import {isPc, isIos, isAndroid, isWeixin, axiosAjax} from './public/public'

const {pcUrl} = require('../../config')

$(function () {
    if (isPc()) {
        window.location.href = `http://${pcUrl}`
    }

    axiosAjax({
        type: 'post',
        url: '/signture',
        params: {url: window.location.href},
        fn: function (data) {
            const $wxData = $('#wxShareTitleDesc')
            wx.config({
                debug: false,
                appId: 'wxec2dc083d4024311',
                timestamp: data.timestamp,
                nonceStr: data.nonceStr,
                signature: data.signature,
                jsApiList: [
                    'checkJsApi',
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ'
                ]
            })
            wx.ready(function () {
                const shareData = {
                    title: $wxData.data('title'),
                    desc: $wxData.data('desc'),
                    link: data.url,
                    imgUrl: $wxData.data('imgurl')
                }
                wx.onMenuShareAppMessage(shareData)
                wx.onMenuShareTimeline(shareData)
                wx.onMenuShareQQ(shareData)
            })
            wx.error(function (err) {
                alert(err.errMsg) // 正式环境关闭
            })
        }
    })

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
