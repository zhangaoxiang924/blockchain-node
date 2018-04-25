/**
 * Author：tantingting
 * Time：2018/4/23
 * Description：Description
 */
import Cookies from 'js-cookie'
// import {pageLoadingHide, axiosAjax, proxyUrl, fomartQuery, getQueryString} from './public/public'
import {pageLoadingHide, axiosAjax, proxyUrl, fomartQuery, getTimeContent} from './public/public'
import {ad} from './modules/index'
import layer from 'layui-layer'
import {NewsSwiper, RealTimeNews} from './index/index'

$(function () {
    pageLoadingHide()

    let mySwiper = new Swiper('#adSwiper', {
        loop: true,
        autoplay: 3000,
        // 如果需要分页器
        pagination: '.swiper-pagination',
        // 如果需要前进后退按钮
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev'
    })

    $('.ad-swiper').on('mouseenter', function () {
        mySwiper.stopAutoplay()
    })
    $('.ad-swiper').on('mouseleave', function () {
        mySwiper.startAutoplay()
    })

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

    // 新闻
    $('#newsTabs li').on('click', function () {
        if ($(this).hasClass('active')) {
            return
        }
        let currPage = 1
        let pageSize = 25
        let id = $(this).data('id')
        getNewsList(currPage, pageSize, id, (res) => {
            $('#newsListContent').html(getNewsStr(res.obj))
            $('#newsTabs li').removeClass('active')
            $(this).addClass('active')
        })
    })
    // 加载更多
    $('.check-more-load').on('click', function () {
        let pageCount = $(this).data('pagecount')
        let currPage = $(this).data('currpage')
        let id = $('#newsTabs li.active').data('id')
        currPage = parseInt(currPage) + 1
        // console.log(pageCount, currPage)
        if (currPage > pageCount) {
            layer.msg('暂无更多新闻 !')
            return
        }
        getNewsList(currPage, 25, id, (res) => {
            $('#newsListContent').append(getNewsStr(res.obj))
        })
    })
    function getNewsStr (obj) {
        let arr = obj.inforList
        let currentTime = obj.currentTime
        let str = ''
        arr.map((item) => {
            str += `<div class="index-news-list"><div class="list-left"><a target="_blank" href="/newsdetail?id=${item.id}"><img src="${(!item.coverPic || !JSON.parse(item.coverPic).pc) ? `http://static.huoxing24.com/images/2018/03/05/1520243882098653.svg` : JSON.parse(item.coverPic).pc}" alt=""></a></div><div class="list-right" style="width: 350px;"><a target="_blank" href="/newsdetail?id=${item.id}"><h6 class="headline">${item.title}</h6><div class="details">${item.synopsis}</div></a><div class="list-bottom index-mian clearfix"><p class="portrait"><a target="_blank" href="/newsauthor?userId=${item.passportId}"><img alt="" src="${item.iconUrl}"></a></p><p class="name">责任编辑：${item.author}</p><p class="lock-time">${getTimeContent(item.publishTime, currentTime)}</p><p class="read-num main-read-num"><span class="count-eye"> </span><span class="read-count">${item.hotCounts}</span></p></div></div></div>`
        })
        return str
    }
    function getNewsList (currPage, pageSize, id, fn) {
        let sendData = {
            currentPage: !currPage ? 1 : currPage,
            pageSize: !pageSize ? 25 : pageSize,
            channelId: !id ? 0 : id
        }
        axiosAjax({
            type: 'get',
            url: proxyUrl + `/info/news/shownews?${fomartQuery(sendData)}`,
            formData: false,
            params: {},
            fn: function (res) {
                if (res.code === 1) {
                    fn(res)
                    $('.check-more-load').data('pagecount', res.obj.pageCount).data('currpage', sendData.currentPage)
                }
            }
        })
    }

    // 关注作者
    $('.cancel-attention').on('click', function () {
        let authorId = $(this).data('id')
        attention(authorId, 'delete', (res) => {
            if (res.code === 1) {
                layer.msg('关注已取消')
                $(this).css({'display': 'none'})
                $(this).siblings('.attention').css({'display': 'block'})
            } else {
                layer.msg(res.msg)
            }
        })
    })
    $('.attention').on('click', function () {
        let authorId = $(this).data('id')
        if (!Cookies.get('hx_user_token')) {
            $('#loginBlock').css({'display': 'block'})
            $('#loginModal h1').html('登录')
            $('#registerModal').css({'display': 'none'})
            $('#loginModal').css({'display': 'block'})
            return
        }
        attention(authorId, 'add', (res) => {
            if (res.code === 1) {
                layer.msg('关注成功')
                $(this).css({'display': 'none'})
                $(this).siblings('.cancel-attention').css({'display': 'block'})
            } else if (res.code === 0) {
                layer.msg(res.msg)
                $(this).css({'display': 'none'})
                $(this).siblings('.cancel-attention').css({'display': 'block'})
            } else {
                layer.msg(res.msg)
            }
        })
    })
    function attention (authorId, type, fun) {
        let sendData = {
            'passportid': Cookies.get('hx_user_id'),
            'token': Cookies.get('hx_user_token'),
            'authorId': authorId
        }
        let url = `${proxyUrl}/info/follow/author/${type}?${fomartQuery(sendData)}`
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

    // 新闻轮播
    let newsSwiper = new NewsSwiper($('.comment-news-content'))
    newsSwiper.init()

    // 快讯
    let realTimeNews = new RealTimeNews($('.real-time-bottom'))
    realTimeNews.init()
})
