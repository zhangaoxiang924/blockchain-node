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

    // 改变页面title
    /* let getDetails = (id) => {
        ajaxGet(url + '/getbyid', {
            id: id,
            channelId: 2
        }, (data) => {
            console.log(data)
            let audio = data.obj.current.audio
            let musicList = []
            if (audio && audio !== '' && audio.indexOf('[') > -1) {
                if (JSON.parse(audio).length !== 0) {
                    JSON.parse(audio).map(function (item, index) {
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
                        callback: function (obj) {
                            /!*
                             {title: "赤血长殷", singer: "王凯", cover: "http://data.smohan.net/upload/other/cxcy/cover.jpg", src: "http://data.smohan.net/upload/other/cxcy/music.mp3", index: 4}
                             *!/
                        }
                    })
                    console.log(smusic)
                } else {
                    $('.audio-wrap').css('display', 'none')
                }
            } else {
                $('.audio-wrap').css('display', 'none')
            }
            let videoArr = []
            let video = data.obj.current.video
            if (video && video !== '' && audio.indexOf('[') > -1) {
                if (JSON.parse(video).length !== 0) {
                    JSON.parse(video).map(function (item, index) {
                        videoArr.push({
                            src: item.fileUrl,
                            artist: '',
                            name: $.trim(item.fileName.split('.')[0]),
                            img: '',
                            id: item.uid
                        })
                    })
                }
            }
            if (videoArr.length !== 0) {
                console.log(videoArr[0].src)
                $('.video-wrap ').css('display', 'block')
                $('.video-wrap video').attr(
                    {
                        'poster': JSON.parse(data.obj.current.coverPic).video_m,
                        'src': videoArr.src
                    }
                )
            } else {
                $('.video-wrap').css('display', 'none')
            }

            $('.audio-list-btn').click(function () {
                $('.m-music-list-wrap').toggle()
            })
            let cont = data.obj
            $('title').html(cont.current.title)

            // 设置时间
            let originalDate = new Date($.ajax({async: false}).getResponseHeader('Date'))
            let serve = originalDate + (3600000 * 8)
            let date = new Date(serve)
            let timestamp = date.getTime()
            let time = getTimeContent(cont.current.publishTime, timestamp)
            let shadeTime = timestampToTime(timestamp)
            newsCorrelation(cont.current.tags, 5, cont.current.id)
            let synopsis = data.obj.current.synopsis

            const timer = compareCalendar('2018-02-10', formatDateMore(cont.current.createTime).split(' ')[0])
            const $detailsSynopsis = $('#detailsSynopsis')
            if (timer) {
                $detailsSynopsis.addClass('active').children('p').text(synopsis)
            }

            // 作者信息备份
            let author = `<div class="author clearfix">
                                    <sapn>${cont.current.author}</sapn>
                                </div>`
            author = ''

            let readNumber = `<div class="read-number">${cont.current.hotCounts}</div>`

            let shareBtn = `<div
                                class="share-btn"
                                data-synopsis="${synopsis}"
                                data-time="${formatDateMore(cont.current.publishTime)}"></div>
                            </div>`
            shareBtn = ''

            let header = `<h6 data-time=${shadeTime} data-synopsis=${synopsis} id='flashNewsTime'>${cont.current.title}</h6>
                            <div class="list-text">
                                ${author}
                                <div class="time clearfix"><span>${time}</span></div>
                                ${readNumber + shareBtn}`

            let content = cont.current.content
            $('.details-header').html(header)
            $('.details-cont').html(content)
        })
    }
    getDetails(getQueryString('id')) */

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

    /* const $shareBox = $('#shareBox')
    const $shareTime = $('#shareTime')
    const $shareCon = $('#shareCon')
    const $imgWrap = $('#imgWrap')
    const $imgCon = $('#imgCon')
    const $imgConMask = $('#imgConMask')
    const $articleTitle = $('#articleTitle')

    $('.details-header').on('click', '.share-btn', function () {
        $shareTime.text($(this).data('time'))
        $articleTitle.text($('#flashNewsTime').html())
        $shareCon.text($('#flashNewsTime').data('synopsis'))

        setTimeout(function () {
            $shareBox.show()
            const conHeight = parseInt($shareBox.find('.share-cont').height())
            const conPadding = parseInt($shareBox.find('.share-box').css('padding-top'))
            $shareBox.height(conPadding + conHeight)

            html2canvas(document.getElementById('shareBox')).then(canvas => {
                let imgUri = canvas.toDataURL('image/jpeg') // 获取生成的图片的url
                $imgCon.attr('src', imgUri)
                $imgWrap.show()
            })
        }, 100)
    })
    $imgConMask.click(function () {
        $shareBox.hide()
        $imgWrap.hide()
    }) */

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

    console.log($('.details').data('tags'))
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
