/**
 * Author：tantingting
 * Time：2018/4/27
 * Description：Description
 */
import {pageLoadingHide, axiosAjax, proxyUrl, fomartQuery, getHourMinute, sevenDays} from './public/public'
import {relatedNews} from './modules/index'
import Cookies from 'js-cookie'
import layer from 'layui-layer'
$(function () {
    pageLoadingHide()
    // 前7天
    setSevenDays()
    function setSevenDays (time) {
        let str = ''
        let days = sevenDays()
        days.map((item) => {
            let queryTime = !time ? Date.parse(new Date(days[0])).toString() : time
            let itemDay = new Date(item)
            let itemDate = Date.parse(itemDay).toString()
            let dataClass = queryTime.substr(0, 8) === itemDate.substr(0, 8) ? 'active' : ''
            str += ` <li class="date-item ${dataClass}" data-date="${itemDate}">${itemDay.getDate()}日</li>`
        })
        $('.news-date').html(str)
    }
    $('.news-date').on('click', '.date-item', function () {
        let dateTime = $(this).data('date')
        getNewsList({
            currentPage: 1,
            queryTime: dateTime
        }, (res) => {
            $('#liveNewsContain').html(getNewsStr(res.obj))
            $(this).siblings('.date-item').removeClass('active')
            $(this).addClass('active')
        })
    })
    $('.news-head').on('click', 'em', function () {
        let channelId = !$(this).data('channelid') ? '' : $(this).data('channelid')
        getNewsList({
            currentPage: 1,
            channelId: channelId
        }, (res) => {
            $('#liveNewsContain').html(getNewsStr(res.obj))
            $(this).siblings('em').removeClass('active')
            $(this).addClass('active')
        })
    })

    // 利好/利空
    bindJudgeProfit()
    function bindJudgeProfit () {
        $('.judge-profit').on('click', 'p', function () {
            let $this = $(this)
            let status = $this.data('status')
            let id = $this.data('id')
            let sendData = {
                passportid: !Cookies.get('hx_user_id') ? '' : Cookies.get('hx_user_id'),
                token: !Cookies.get('hx_user_token') ? '' : Cookies.get('hx_user_token'),
                status: status,
                id: id
            }
            axiosAjax({
                type: 'get',
                url: proxyUrl + `/info/lives/upordown?${fomartQuery(sendData)}`,
                formData: false,
                params: {},
                fn: function (res) {
                    if (res.code === 1) {
                        let num = parseInt($this.find('.num').html())
                        if ($this.hasClass('active')) {
                            $this.find('.num').html(num - 1)
                            $this.removeClass('active')
                        } else {
                            $this.find('.num').html(num + 1)
                            $this.addClass('active')
                            let $other = $this.siblings('p')
                            if ($other.hasClass('active')) {
                                let otnerNum = $other.find('.num').html()
                                $other.find('.num').html(otnerNum - 1)
                                $other.removeClass('active')
                            }
                        }
                    }
                }
            })
        })
    }

    // 加载更多
    $('.check-more-load').on('click', function () {
        let pageCount = $(this).data('pagecount')
        let currPage = $(this).data('currpage')
        // let id = !$('.news-head em.active').data('channelid') ? '' : $('.news-head em.active').data('channelid')
        // let queryTime = $('.news-date .date-item.active').data('date')
        currPage = parseInt(currPage) + 1
        // console.log(pageCount, currPage)
        if (currPage > pageCount) {
            layer.msg('暂无更多新闻 !')
            return
        }
        getNewsList({
            currentPage: currPage
        }, (res) => {
            $('#liveNewsContain').append(getNewsStr(res.obj))
        })
    })
    function getNewsStr (obj) {
        let arr = obj.inforList
        // let currentTime = obj.currentTime
        let str = ''
        arr.map((item) => {
            str += `<li class="flash-news">
                <div class="news-item">
                    <span class="${parseInt(item.tag) === 2 ? 'important-news' : ''}"></span>
                    <span class="new-time">${getHourMinute(item.createdTime)}</span>
                    <p class="news-detail" style="color: ${parseInt(item.tag) === 2 && 'red'};">${item.content}</p>
                    ${!item.url ? '' : `<a href="${item.url}" style="color: #1482f0" target="_blank"> 「查看原文」</a>`}
                    <div class="judge-profit">
                        <p  data-status="1" data-id="${item.id}" class="${parseInt(item.type) === 1 ? 'good-profit active' : 'good-profit'}">
                            <span>利好</span>
                            <span class="num"> ${item.upCounts} </span>
                        </p>
                        <p  data-status="0" data-id="${item.id}" class="${parseInt(item.type) === 0 ? 'bad-profit active' : 'bad-profit'} ">
                            <span>利空</span>
                            <span class="num"> ${item.downCounts} </span>
                        </p>
                    </div>
                </div>
            </li>`
        })
        return str
    }
    function getNewsList (query, fn) {
        let id = !$('.news-head em.active').data('channelid') ? '' : $('.news-head em.active').data('channelid')
        let queryTime = $('.news-date .date-item.active').data('date')
        let sendData = {
            currentPage: ``,
            pageSize: 30,
            channelId: id,
            queryTime: queryTime,
            passportid: !Cookies.get('hx_user_id') ? '' : Cookies.get('hx_user_id'),
            ...query
        }
        axiosAjax({
            type: 'get',
            url: proxyUrl + `/info/lives/showlives?${fomartQuery(sendData)}`,
            formData: false,
            params: {},
            fn: function (res) {
                if (res.code === 1) {
                    fn(res)
                    bindJudgeProfit()
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
            newsCounts: 10
        })}`,
        formData: false,
        params: {},
        fn: function (res) {
            if (res.code === 1) {
                let data = res.obj.inforList
                // let bottom = relatedNews(data, 'bottom')
                let right = relatedNews(data, 'right')
                $('.hot-news-wrap .news-recommend').html(right)
                // $('.bottom-recommend-news .news-contain').html(bottom)
            }
        }
    })
    // 新闻排行
    axiosAjax({
        type: 'get',
        url: `${proxyUrl}/info/news/recommend?${fomartQuery({
            lastDays: 3,
            readCounts: 50,
            newsCounts: 10
        })}`,
        formData: false,
        params: {},
        fn: function (res) {
            if (res.code === 1) {
                let data = res.obj.inforList
                // let bottom = relatedNews(data, 'bottom')
                let str = getSortNewsStr(data)
                $('.hot-news-wrap .news-sort-box').html(str)
                // $('.bottom-recommend-news .news-contain').html(bottom)
            }
        }
    })
    function getSortNewsStr (arr) {
        let str = ''
        arr.map((item, index) => {
            str += `<div class="list-box clearfix"><span>${index + 1}</span><a target="_blank" class="right-text" href="/newsdetail?id=${item.id}">${item.title}</a></div>`
        })
        return str
    }
})
