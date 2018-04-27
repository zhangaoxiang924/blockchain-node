/**
 * Author：tantingting
 * Time：2018/4/27
 * Description：Description
 */

import {pageLoadingHide, getQueryString, getTimeContent, ajaxGet, Animation, scrollDirect} from '../js/public/public'

// import html2canvas from 'html2canvas'

let url = '/info/news'
let apiInfo = '/info'
const htmlPath = ''

$(function () {
    pageLoadingHide()

    const $huoxingTop = $('#huoxingTop')
    scrollDirect(function (direction) {
        if (direction === 'down') {
            if (parseFloat($(window).scrollTop()) >= 600) {
                $huoxingTop.addClass('active')
            }
        }
        if (direction === 'up') {
            $huoxingTop.removeClass('active')
        }
    })

    // 音频
    let audio = $('.audio-wrap').data('audio')
    if (!audio) {} else {
        let musicList = []
        audio.map(function (item, index) {
            musicList.push({
                title: $.trim(item.fileName.split('.')[0]),
                singer: '',
                cover: '',
                src: item.fileUrl,
                lyric: null
            })
        })
        const smusic = new SMusic({
            musicList: musicList,
            autoPlay: false,
            defaultMode: 1,
            callback: function (obj) {}
        })
        console.log(smusic)
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

    let newsCorrelation = (tags, newsCounds, id) => {
        ajaxGet(url + '/relatednews', {
            tags: tags,
            newsCounds: newsCounds,
            id: id
        }, (data) => {
            let dataArr = data.obj.inforList
            let originalDate = new Date($.ajax({async: false}).getResponseHeader('Date'))
            let serve = originalDate + (3600000 * 8)
            let date = new Date(serve)
            let timestamp = date.getTime()
            let newsList = ''
            dataArr.map(function (d, i) {
                let time = getTimeContent(d.publishTime, timestamp)
                let img = JSON.parse(d.coverPic)
                newsList += `<div class="news-list-more ">
                                <a href=${htmlPath + '/newsdetail/m?id=' + d.id}>
                                    <div class="title">${cutString(d.title, 60)}</div>
                                    <div class="list-text">
                                        <div class="author clearfix"><span>${d.author}</span></div>
                                        <div class="time clearfix"><span>${time}</span></div>
                                    </div>
                                    <div class="cover-img-sma"><img src=${img.wap_small} alt=""></div>
                                </a>
                            </div>`
            })
            $('.news-list-box').html(newsList)
        })
    }

    newsCorrelation($('.details').data('tags'), 5, getQueryString('id'))

    // 广告
    ajaxGet(apiInfo + '/ad/showad', {
        adPlace: 2,
        type: 2
    }, (data) => {
        const obj = data.obj[2]
        let list = ''
        obj.map((item) => {
            console.log(item.useType)
            list += `<div class="block-ad">
                        <div class="block-ad-title">
                            <h3>${item.remake}</h3>
                            ${item.useType === 1 ? '<span>广告</span>' : ''}
                        </div>
                        <div class="block-ad-con">
                            <a href="${item.url}"><img src="${item.img_url}"/></a>
                        </div>
                    </div>`
        })
        $('.advertising').append(list)
    })

    // 返回顶部
    $(window).on('scroll', function () {
        let backTop = $(window).height() + $(window).scrollTop()
        if (backTop > 1500) {
            $('.back-top').addClass('top')
        } else {
            $('.back-top').removeClass('top')
        }
    })
    $('.back-top').on('click', function () {
        Animation()
    })
})
