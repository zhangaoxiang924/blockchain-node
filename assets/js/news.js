/**
 * Author：tantingting
 * Time：2018/4/25
 * Description：Description
 */

// import Cookies from 'js-cookie'
import {pageLoadingHide, axiosAjax, proxyUrl, fomartQuery, getTimeContent} from './public/public'
import {relatedNews} from './modules/index'

$(function () {
    pageLoadingHide()

    // 新闻
    $('.nav-box a').on('click', function () {
        if ($(this).hasClass('active')) {
            return
        }
        let currPage = 1
        let pageSize = 10
        let id = $(this).data('id')
        getNewsList(currPage, pageSize, id, (res) => {
            $('#newsListContent').html(getNewsStr(res.obj))
            $('.nav-box a').removeClass('active')
            $(this).addClass('active')
        })
    })
    // 加载更多
    $('.check-more-load').on('click', function () {
        let pageCount = $(this).data('pagecount')
        let currPage = $(this).data('currpage')
        let id = $('.nav-box a.active').data('id')
        currPage = parseInt(currPage) + 1
        // console.log(pageCount, currPage)
        if (currPage > pageCount) {
            layer.msg('暂无更多新闻 !')
            return
        }
        getNewsList(currPage, 10, id, (res) => {
            console.log($('#newsListContent'))
            $('#newsListContent').append(getNewsStr(res.obj))
        })
    })
    function getNewsStr (obj) {
        let arr = obj.inforList
        let currentTime = obj.currentTime
        let str = ''
        arr.map((item) => {
            str += `<div class="index-news-list"><div class="list-left"><a target="_blank" href="/newsdetail?id=${item.id}"><img src="${(!item.coverPic || !JSON.parse(item.coverPic).pc) ? `http://static.huoxing24.com/images/2018/03/05/1520243882098653.svg` : JSON.parse(item.coverPic).pc}" alt=""></a></div><div class="list-right" style="width: 535px;"><a target="_blank" href="/newsdetail?id=${item.id}"><h6 class="headline">${item.title}</h6><div class="details">${item.synopsis}</div></a><div class="list-bottom index-mian clearfix"><p class="portrait"><a target="_blank" href="/newsauthor?userId=${item.passportId}"><img alt="" src="${item.iconUrl}"></a></p><p class="name">${item.author}</p><p class="lock-time">${getTimeContent(item.publishTime, currentTime)}</p><p class="read-num main-read-num"><span class="count-eye"> </span><span class="read-count">${item.hotCounts}</span></p></div></div></div>`
        })
        return str
    }
    function getNewsList (currPage, pageSize, id, fn) {
        let sendData = {
            currentPage: !currPage ? 1 : currPage,
            pageSize: !pageSize ? 10 : pageSize,
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

    // 相关新闻
    axiosAjax({
        type: 'get',
        url: `${proxyUrl}/info/news/hotnews?${fomartQuery({
            lastDays: 3,
            readCounts: 50,
            newsCounts: 6
        })}`,
        formData: false,
        params: {},
        fn: function (res) {
            if (res.code === 1) {
                let data = res.obj.inforList
                // let bottom = relatedNews(data, 'bottom')
                let right = relatedNews(data, 'right')
                $('.ad-recomend .news-recommend').html(right)
                // $('.bottom-recommend-news .news-contain').html(bottom)
            }
        }
    })
})
