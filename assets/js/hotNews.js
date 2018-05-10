/**
 * Author：tantingting
 * Time：2018/4/25
 * Description：Description
 */

// import Cookies from 'js-cookie'
import {pageLoadingHide, axiosAjax, proxyUrl, fomartQuery, getTimeContent, getQueryString, add0} from './public/public'
import {relatedNews} from './modules/index'
import layer from 'layui-layer'

$(function () {
    pageLoadingHide()
    // 加载更多
    $('.check-more-load').on('click', function () {
        let pageCount = $(this).data('pagecount')
        let currPage = $(this).data('currpage')
        let tags = getQueryString('tags')
        currPage = parseInt(currPage) + 1
        // console.log(pageCount, currPage)
        if (currPage > pageCount) {
            layer.msg('暂无更多新闻 !')
            return
        }
        let sendData = {
            currentPage: currPage,
            pageSize: 20,
            tags: encodeURIComponent(tags)
        }
        getNewsList(sendData, (res) => {
            $('#newsListContent').append(getNewsStr(res.obj))
        })
    })
    function getNewsStr (obj) {
        let arr = obj.inforList
        let currentTime = $('.news-hot-label').data('currtime')
        let str = ''
        arr.map((item) => {
            str += `<div class="index-news-list"><div class="list-left"><a target="_blank" href="/newsdetail/${item.id}.html"><img src="${(!item.coverPic || !JSON.parse(item.coverPic).pc) ? `http://static.huoxing24.com/images/2018/03/05/1520243882098653.svg` : JSON.parse(item.coverPic).pc}" alt=""></a></div><div class="list-right" style="width: 535px;"><a target="_blank" href="/newsdetail/${item.id}.html"><h6 class="headline">${item.title}</h6><div class="details">${item.synopsis}</div></a><div class="list-bottom index-mian clearfix"><p class="portrait"><a target="_blank" href="/newsauthor?userId=${item.passportId}"><img alt="" src="${item.iconUrl}"></a></p><p class="name">${item.author}</p><p class="lock-time">${getTimeContent(item.publishTime, currentTime)}</p><p class="read-num main-read-num"><span class="count-eye"> </span><span class="read-count">${item.hotCounts}</span></p></div></div></div>`
        })
        return str
    }
    function getNewsList (sendData, fn) {
        axiosAjax({
            type: 'get',
            url: proxyUrl + `/info/news/relatednews1?${fomartQuery(sendData)}`,
            formData: false,
            contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
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

    // 专题内容
    axiosAjax({
        type: 'get',
        url: `${proxyUrl}/info/topic/querytopic?${fomartQuery({
            id: getQueryString('id')
        })}`,
        formData: false,
        params: {},
        fn: function (res) {
            if (res.code === 1) {
                let data = res.obj
                let dateStr = `${add0(parseInt(new Date(data.createTime).getMonth()) + 1)}月${add0(parseInt(new Date(data.createTime).getDate()))}日`
                $('.hot-top-bg').css({background: `url('${data.pcBackImage}') center center no-repeat`})
                $('.hot-top-bg').find('h6').html(data.topicName)
                $('.hot-top-bg').find('span').html(dateStr)
            }
        }
    })
})
