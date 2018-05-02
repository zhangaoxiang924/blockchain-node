/**
 * Author：tantingting
 * Time：2018/4/9
 * Description：Description
 */

import Cookies from 'js-cookie'
import {pageLoadingHide, axiosAjax, proxyUrl, fomartQuery, getQueryString} from './public/public'
import {ad, relatedNews, NewsAuthor} from './modules/index'
import {AsideMarked, Reply, MusicPlay} from './newsDetail/index'

$(function () {
    let newsId = getQueryString('id')
    pageLoadingHide()
    let newsDataInfo = $('.news-detail').data('info')

    // 广告
    axiosAjax({
        type: 'get',
        url: proxyUrl + '/info/ad/showad',
        formData: false,
        params: {
            adPlace: '5,6,7',
            type: '1'
        },
        fn: function (res) {
            if (res.code === 1) {
                let topAd = ad(res.obj[5])
                let bottomAd = ad(res.obj[6])
                let rightAd = ad(res.obj[7])
                $('.news-detail .ad-top').html(topAd)
                $('.news-detail .ad-bottom').html(bottomAd)
                $('.news-detail .ad-show').html(rightAd)
            }
        }
    })

    // 作者信息
    axiosAjax({
        type: 'get',
        url: `${proxyUrl}/info/news/getauthorinfo?${fomartQuery({
            passportId: newsDataInfo.createdBy,
            myPassportId: !Cookies.get('hx_user_id') ? '' : Cookies.get('hx_user_id')
        })}`,
        formData: false,
        params: {},
        fn: function (res) {
            if (res.code === 1) {
                let author = new NewsAuthor(res.obj)
                author.init($('.authorinfo'), 'right')
                author.init($('.authorinfo-bottom'), 'bottom')
                // let bottom = new newsAuthor($('.authorinfo-bottom'), res.obj, 'bottom')
                // bottom.init()
            }
        }
    })

    // 相关新闻
    axiosAjax({
        type: 'get',
        url: `${proxyUrl}/info/news/relatednews?${fomartQuery({
            tags: newsDataInfo.tags,
            id: newsDataInfo.id,
            newsCounts: 6
        })}`,
        formData: false,
        params: {},
        fn: function (res) {
            if (res.code === 1) {
                let data = res.obj.inforList
                let bottom = relatedNews(data, 'bottom')
                let right = relatedNews(data, 'right')
                $('.ad-recomend .news-recommend').html(right)
                $('.bottom-recommend-news .news-contain').html(bottom)
            }
        }
    })

    // 行情
    let marked = new AsideMarked($('.market'))
    marked.init()

    // 评论
    // let newsId = getQueryString('id')
    let reply = new Reply($('#replyBox'), newsId)
    reply.init()

    // 音频
    if ($('#react-music-player').length) {
        let musicPlay = new MusicPlay($('#react-music-player').data('info'), $('#react-music-player'))
        musicPlay.init()
    }

    // 收藏
    $('.collect').on('click', function () {
        let $this = $(this)
        let userId = Cookies.get('hx_user_id')
        let token = Cookies.get('hx_user_token')
        if (!token) {
            $('#loginBlock').css({'display': 'block'})
            $('#loginModal h1').html('登录')
            $('#registerModal').css({'display': 'none'})
            $('#loginModal').css({'display': 'block'})
        } else {
            let ifCollect = $(this).data('ifcollect')
            let status = parseInt(ifCollect) === 1 ? -1 : 1
            let hasCollect = `<i class="iconfont hasCollect">&#xe605;</i><span> 已收藏</span>`
            let notCollect = `<i class="iconfont">&#xe651;</i><span> 收藏</span>`
            let sendData = {
                newsId: newsId,
                passportId: userId,
                token: token,
                status: status
            }
            axiosAjax({
                type: 'get',
                url: proxyUrl + '/info/news/collect',
                formData: false,
                params: sendData,
                fn: function (res) {
                    if (res.code === 1) {
                        if (parseInt(ifCollect) === 0) {
                            $this.html(hasCollect)
                            $this.data('ifcollect', '1')
                        } else {
                            $this.html(notCollect)
                            $this.data('ifcollect', '0')
                        }
                    }
                }
            })
        }
    })
})
