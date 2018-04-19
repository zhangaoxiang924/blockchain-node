/**
 * Author：tantingting
 * Time：2018/4/16
 * Description：Description
 */

import {axiosAjax, proxyUrlPc, formatDate, fomartQuery, formatPrice, getTimeContent} from './public'
import Cookies from 'js-cookie'
import layer from 'layui-layer'

// 广告
const ad = (arr) => {
    let itemStr = ''
    arr.map((item) => {
        itemStr += `<a href="${item.url}" target="_blank" style="width: 100%; height: 100%;"><img src="${item.img_url}" alt=""><span class="active"></span></a>`
    })
    let str = `<div class="news-img clearfix">${itemStr}</div>`
    return !arr.length ? '' : str
}

// 相关新闻
const relatedNews = (arr, dir) => {
    let itemStr = ''
    let str = ''
    if (dir === 'bottom') {
        arr.map((item) => {
            // !item.createTime ? '' : formatDate(item.createTime, '.')
            itemStr += `<a target="_blank" class="clearfix news-item" href="/newsdetail?id=${item.id}"><span class="dot"></span><div><div class="news-title">${item.title}</div><p>${item.author}丨${!item.createTime ? '' : formatDate(item.createTime, '.')}</p></div></a>`
        })
        str = `<div class="news-list-contain">${itemStr}</div>`
    } else {
        arr.map((item) => {
            itemStr += `<a class="list-box" target="_blank" href="/newsdetail?id=${item.id}"><div><div class="left-img"><img src="${!item.coverPic ? `http://static.huoxing24.com/images/2018/03/05/1520243882098653.svg` : JSON.parse(item.coverPic).pc}" alt=""></div><span class="right-text">${item.title}</span></div></a>`
        })
        str = `<div class="new-list-box">${itemStr}</div>`
    }
    return str
}

// 作者
class NewsAuthor {
    constructor (item) {
        // this.dir = !dir ? 'right' : dir // right,bottom
        this.info = item
        // this.warp = warp
        this.htmlStr = ``
    }
    init (warp, dir) {
        let self = this
        warp.html(this.getStr(dir))
        warp.find('.attention').on('click', function () {
            // let type = 'add'
            let ifCollect = parseInt(self.info.ifCollect)
            let infoData = self.info
            let type = ifCollect === 1 ? 'delete' : 'add'
            // let $this = $(this)
            self.attention(type, (res) => {
                if (res.code === 1) {
                    if (ifCollect === 1) {
                        // 取消关注
                        infoData = {
                            ...infoData,
                            ifCollect: 0,
                            followCount: infoData.followCount - 1
                        }
                        $('.attention').html('关注').removeClass('active')
                    } else {
                        // 关注
                        infoData = {
                            ...infoData,
                            ifCollect: 1,
                            followCount: infoData.followCount + 1
                        }
                        $('.attention').html('取消关注').addClass('active')
                    }
                    $('.fans-num').html(infoData.followCount)
                    self.info = infoData
                }
            })
        })
    }

    getStr (dir) {
        if (dir === 'right') {
            this.htmlStr = `<div class="new-author-title"><div class="author-title-img"><a target="_blank" href="/newsauthor?userId=${this.info.passportId}"><img src="${this.info.iconUrl}" alt=""></a></div><h6 class="title-author">${this.info.nickName}</h6><p class="introduce-author">${this.info.introduce}</p><div class="author-detl clearfix"><div class="author-name"><h6>粉丝</h6><p><span class="fans-num">${this.info.followCount}</span></p></div><a class="author-article" target="_blank" href="/newsauthor?userId=${this.info.passportId}"><h6>文章数量</h6><p><span>${this.info.newsCount}</span> 篇</p></a></div>${parseInt(this.info.ifCollect) === 1 ? `<div class="attention active">取消关注</div>` : `<div class="attention">关注</div>`}</div>`
        } else {
            this.htmlStr = `<div class="new-author-title line-new-author clearfix"><div class="author-title-img"><a target="_blank" href="/newsauthor?userId=${this.info.passportId}"><img src="${this.info.iconUrl}" alt=""></a></div><div class="bottom-author-desc"><div><h5 class="title-author">${this.info.nickName}</h5><span>&nbsp;&nbsp;文章数量&nbsp;${this.info.newsCount}</span></div><p class="introduce-author">${this.info.introduce}</p></div>${parseInt(this.info.ifCollect) === 1 ? `<div class="attention active">取消关注</div>` : `<div class="attention">关注</div>`}</div>`
        }
        return this.htmlStr
    }

    attention (type, fun) {
        let sendData = {
            'passportid': Cookies.get('hx_user_id'),
            'token': Cookies.get('hx_user_token'),
            'authorId': this.info.passportId
        }
        let url = `${proxyUrlPc}/info/follow/author/${type}?${fomartQuery(sendData)}`
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
}

// 涨跌幅榜
class AsideMarked {
    constructor (warp) {
        this.warp = warp
        this.currency = '1'
        this.tend = 'desc'
        this.marketTitle = ['排名', '名称', '价格', '涨幅']
    }

    init () {
        let thStr = ''
        let self = this
        this.marketTitle.map((item) => {
            thStr += `<li>${item}</li>`
        })
        let asideMarketStr = `<div class="aside-market"><div class="aside-market-top clearfix"><div class="clearfix"><h5 id="orderByDesc" class="${this.tend === 'desc' ? 'active' : ''}">涨幅榜</h5><h5 id="orderByAsc" class="${this.tend !== 'desc' ? 'active' : ''}">跌幅榜</h5></div><a class="more" target="_blank" href="/markets">MORE&nbsp;&nbsp;&gt;</a></div><div class="market-column-box"><div class="market-box-list"><div class="market-tab"><ul class="table-title-ul clearfix">${thStr}</ul></div><div class="market-tab-list"><table><tbody>`
        asideMarketStr += `</tbody></table></div></div></div></div>`
        this.warp.html(asideMarketStr)
        this.getMarkData(this.tend)
        $('#orderByDesc').on('click', function () {
            self.getMarkData('desc')
            $(this).addClass('active')
            this.tend = 'desc'
            $('#orderByAsc').removeClass('active')
        })
        $('#orderByAsc').on('click', function () {
            self.getMarkData('asc')
            $(this).addClass('active')
            this.tend = 'asc'
            $('#orderByDesc').removeClass('active')
        })
    }

    getHtmlStr (arr, rate) {
        let str = ''
        let symbol = this.currency === '0' ? '＄' : '￥'
        arr.map((item, index) => {
            str += `<tr><td>${index + 1}</td><td class="coins-name-column grey"><font class="img-log"><img src="${item.icon}" alt=""></font><span>${!item.cn_name ? item.symbol : item.cn_name}</span></td><td>${symbol}${formatPrice(this.price(item.price_usd, rate))}</td><td class="${item.percent_change_24h >= 0 ? 'green' : 'red'}">${item.percent_change_24h + ' %'}</td><td></td></tr>`
        })
        return str
    }

    price (price, rate) {
        if (this.currency === '0') {
            return price
        } else if (this.currency === '1') {
            return price * parseFloat(rate)
        }
    }

    getRate (fn) {
        let url = `${proxyUrlPc}/market/coin/financerate`
        axiosAjax({
            type: 'post',
            url: url,
            formData: false,
            params: {},
            fn: function (resData) {
                if (resData.code === 1) {
                    if (fn) {
                        fn(resData.data.legal_rate)
                    }
                }
            }
        })
    }

    getMarkData (sort) {
        let self = this
        let sendData = {
            currentPage: 1,
            isMineable: null,
            myCollect: 0,
            pageSize: 8,
            passportId: !Cookies.get('hx_user_id') ? '' : Cookies.get('hx_user_id'),
            sort: {
                column: 'percent_change_24h',
                order: sort
            }
        }
        let url = `${proxyUrlPc}/market/coin/querycoins`
        axiosAjax({
            type: 'post',
            url: url,
            formData: false,
            params: {...sendData},
            fn: function (res) {
                if (res.code === 1) {
                    let list = res.data.coin
                    self.getRate((legalRate) => {
                        let itemStr = self.getHtmlStr(list, legalRate.CNY)
                        self.warp.find('.market-tab-list table tbody').html(itemStr)
                        self.warp.find('.market-tab-list table tbody tr').on('click', function () {
                            let index = self.warp.find('.market-tab-list table tbody tr').index(this)
                            location.href = `/project?coinid=${list[index].coin_id}`
                        })
                    })
                }
            }
        })
    }
}

// 评论
class Reply {
    constructor (warp, id) {
        this.warp = warp
        this.newsId = id
        this.currentPage = 1
        this.pageSize = 5
        this.recordCount = 0
        this.userNickName = Cookies.get('hx_user_nickname')
        this.userId = Cookies.get('hx_user_id')
        this.nickUrl = Cookies.get('hx_user_url')
        this.token = Cookies.get('hx_user_token')
        this.conmentStr = ''
        this.notLogin = `<div class="prompt-not-login" style="display: ${!this.token ? 'block' : 'none'};"><p>请先 <span class="reply-login-button">登陆</span> 再评论</p></div>`
        this.hasLogin = `<div class="prompt-has-login" style="display: ${!this.token ? 'none' : 'block'};"><img alt="" src="${this.nickUrl}"><div class="reply-editor"><div class="editor"><textarea></textarea></div></div><p class="submit-btn"><span>评论</span></p></div>`
    }
    init () {
        let self = this
        let htmlStr = `<div class="reply-module">${this.notLogin}<div class="reply-section">`
        htmlStr += `</div>${this.hasLogin}</div>`
        this.warp.html(htmlStr)
        $('.reply-login-button').on('click', function () {
            // $('#loginModal h1').html(title)
            // 登录弹窗
            $('#loginBlock').css({'display': 'block'})
            $('#registerModal').css({'display': 'none'})
            $('#loginModal').css({'display': 'block'})
        })
        // 评论
        $('.submit-btn span').on('click', function () {
            let content = $('.prompt-has-login').find('textarea').val()
            self.addNewsComments(content)
        })
        this.getNewsConments(this.currentPage, this.pageSize)
    }

    getConmentsStr (data) {
        let str = this.currentPage === 1 ? '' : this.conmentStr
        let currentTime = data.currentTime
        let arr = data.inforList
        // let recordCount = data.recordCount
        arr.map((item) => {
            let str2 = ''
            let comment = item.comment
            let repliesLen = item.replies.length
            let repliesBox = ''
            if (!repliesLen) {
                str2 = ''
                repliesBox = `<div class="secord-reply"><ul class="reply-floor">${str2}</ul><p class="all-reply-floor show-secord-all" style="display: none;"><span>查看全部回复</span></p><p class="all-reply-floor show-secord-other" style="display: none;"><span>查看部分回复</span></p></div>`
            } else {
                str2 = this.getSencordConmentsStr(item.replies, 3)
                repliesBox = `<div class="secord-reply"><ul class="reply-floor">${str2}</ul><p class="all-reply-floor show-secord-all" style="display: ${repliesLen > 3 ? 'block' : 'none'};"><span>查看全部回复</span></p><p class="all-reply-floor show-secord-other" style="display: none;"><span>查看部分回复</span></p></div>`
            }
            str += `<li class="reply-item"><p class="head-img"><img src="${comment.userIcon}" alt=""></p><div class="reply-detail"><p class="reply-author">${comment.userNickName}</p><p class="reply-words">${comment.content}</p></div><div class="reply-info"><span class="reply-date">${getTimeContent(comment.createTime, currentTime)}</span><p class="reply-info-item"><span class="comment-reply-btn"><i class="iconfont"></i>回复</span><span data-id="${comment.id}" class="comment-del-btn" style="display: ${this.userId === comment.userId ? 'inline-block' : 'none'};">删除</span></p></div><div class="reply-editor-section" style="display: none;"><div class="reply-editor"><div class="editor"><textarea></textarea></div></div><div class="reply-editor-btns"><div data-id="${comment.id}" class="reply-btn reply-btn-submit disabled">回复</div><div class="reply-btn reply-btn-cancel">取消</div></div></div>${repliesBox}</li>`
        })
        this.conmentStr = str
        return str
    }

    getSencordConmentsStr (arr, len) {
        let str = ''
        let currArr = len === 'all' ? arr : arr.slice(0, len)
        currArr.map((item) => {
            str += `<li class="reply-floor-item"><span data-id="${item.id}" class="comment-del-btn" style="display: ${this.userId === item.userId ? 'inline-block' : 'none'};">删除</span><p class="reply-floor-author">${item.userNickName}</p><p class="reply-floor-text">${item.content}</p></li>`
        })
        return str
    }

    // 查看回复
    showReply (data, $this, type) {
        let self = this
        let len = type === 'all' ? 'all' : 3
        let secordStr = this.getSencordConmentsStr(data, len)
        $this.parent('.secord-reply').find('.reply-floor').html(secordStr)
        $this.css({'display': 'none'})
        if (type === 'all') {
            $this.siblings('.show-secord-other').css({'display': 'block'})
        } else {
            $this.siblings('.show-secord-all').css({'display': 'block'})
        }
        // 删除评论
        $('.comment-del-btn').on('click', function () {
            let commentId = $(this).data('id')
            self.delNewsComments(commentId, () => {
                if (!$(this).closest('.reply-floor-item').length) {
                    $(this).closest('.reply-item').remove()
                } else {
                    $(this).closest('.reply-floor-item').remove()
                }
            })
        })
    }

    // 获取评论
    getNewsConments (currentPage, pageSize) {
        let self = this
        let url = `${proxyUrlPc}/info/comment/getbyarticle`
        this.currentPage = currentPage
        let sendData = {
            id: this.newsId,
            currentPage: currentPage,
            pageSize: pageSize
        }
        axiosAjax({
            type: 'get',
            url: url,
            formData: false,
            params: {...sendData},
            fn: function (res) {
                if (res.code === 1) {
                    let data = res.obj
                    self.recordCount = data.recordCount
                    let htmlStr = `<p class="reply-title">评论（${data.recordCount}条）</p><ul class="reply-content">`
                    let conmentsStr = self.getConmentsStr(data)
                    htmlStr += conmentsStr
                    htmlStr += `</ul><p class="all-reply-btn ${data.recordCount <= (currentPage - 1) * pageSize + data.inforList.length ? 'none' : 'block'}">查看更多评论</p>`
                    self.warp.find('.reply-section').html(htmlStr)
                    $('.comment-reply-btn').on('click', function () {
                        let parents = $(this).closest('.reply-item')
                        parents.find('.reply-editor-section').css({'display': 'block'})
                    })

                    $('.reply-btn-cancel').on('click', function () {
                        $(this).closest('.reply-editor-section').css({'display': 'none'})
                    })

                    // 查看更多
                    $('.all-reply-btn').on('click', function () {
                        if (self.recordCount <= (self.currentPage - 1) * self.pageSize + data.inforList.length) {
                            layer.msg('暂无更多评论 !')
                            return
                        }
                        let currentPage = self.currentPage + 1
                        self.currentPage = currentPage
                        self.getNewsConments(currentPage, self.pageSize)
                    })

                    // 查看全部回复
                    $('.show-secord-all').on('click', function () {
                        let index = $(this).closest('.reply-item').index()
                        self.showReply(data.inforList[index].replies, $(this), 'all')
                    })

                    // 查看部分回复
                    $('.show-secord-other').on('click', function () {
                        let index = $(this).closest('.reply-item').index()
                        self.showReply(data.inforList[index].replies, $(this), 'other')
                    })

                    // 删除评论
                    $('.comment-del-btn').on('click', function () {
                        let commentId = $(this).data('id')
                        self.delNewsComments(commentId, () => {
                            if (!$(this).closest('.reply-floor-item').length) {
                                $(this).closest('.reply-item').remove()
                            } else {
                                $(this).closest('.reply-floor-item').remove()
                            }
                        })
                    })

                    // 回复
                    $('.reply-btn-submit').on('click', function () {
                        let id = $(this).data('id')
                        let content = $(this).closest('.reply-editor-section').find('textarea').val()
                        self.replyNewsComments(id, content)
                    })
                }
            }
        })
    }

    // 删除回复
    delNewsComments (id) {
        let self = this
        let url = `${proxyUrlPc}/info/comment/del`
        let sendData = {
            id: id,
            token: this.token,
            passportid: this.userId
        }
        axiosAjax({
            type: 'get',
            url: url,
            formData: false,
            params: {...sendData},
            fn: function (res) {
                if (res.code === 1) {
                    self.getNewsConments(1, 5)
                } else {
                    layer.msg(res.msg)
                }
            }
        })
    }

    // 回复
    replyNewsComments (commentsId, content) {
        let self = this
        let url = `${proxyUrlPc}/info/comment/reply`
        let sendData = {
            targetId: this.newsId,
            token: this.token,
            userId: this.userId,
            userNickName: this.userNickName,
            pid: commentsId,
            content: content
        }
        axiosAjax({
            type: 'get',
            url: url,
            formData: false,
            params: {...sendData},
            fn: function (res) {
                if (res.code === 1) {
                    self.getNewsConments(1, 5)
                } else {
                    layer.msg(res.msg)
                }
            }
        })
    }

    // 评论
    addNewsComments (content) {
        let self = this
        let url = `${proxyUrlPc}/info/comment/add`
        let sendData = {
            targetId: this.newsId,
            content: content,
            token: this.token,
            userNickName: this.userNickName,
            userId: this.userId
        }
        axiosAjax({
            type: 'get',
            url: url,
            formData: false,
            params: {...sendData},
            fn: function (res) {
                if (res.code === 1) {
                    self.getNewsConments(1, 5)
                    $('.prompt-has-login').find('textarea').val('')
                } else {
                    layer.msg(res.msg)
                }
            }
        })
    }
}

// 音频
class MusicPlay {
    constructor (item, warp) {
        this.warp = warp
        this.info = item
        this.audio = this.warp.find('audio')[0]
        this.duration = 0
        this.totalTime = 0
        this.currentTime = 0
        this.paused = true
        this.timeId = 0
    }
    init () {
        let self = this
        setTimeout(() => {
            // console.log(this.audio.duration)
            if (isNaN(this.audio.duration)) {
                return
            }
            this.duration = parseInt(this.audio.duration)
            this.totalTime = this.getTime(this.duration)
            this.warp.find('.total-time').html(this.totalTime)
        }, 1000)

        $('.play-btn').on('click', function () {
            if (!self.paused) {
                // 暂停
                self.pause()
                clearInterval(self.timeId)
                $(this).removeClass('icon-pause').addClass('icon-play')
                self.paused = true
            } else {
                // 播放
                self.play()
                $(this).removeClass('icon-play').addClass('icon-pause')
                self.paused = false
                self.setProgress()
                self.timeId = setInterval(() => {
                    self.setProgress()
                }, 1000)
                /* self.timeId = setInterval(() => {
                    let duration = self.audio.duration
                    let currTime = self.audio.currentTime
                    if (currTime < duration) {
                        let playTime = self.getTime(parseInt(currTime))
                        self.warp.find('.remain-time').html(playTime)
                        let w = (currTime / duration) * 100
                        self.warp.find('.progress-played').css({'width': `${w}%`})
                    }
                }, 1000) */
            }
        })

        // 点击进度条
        self.warp.find('.progress-wrapper').on('click', function (e) {
            self.setTimeOnPc(e)
        })
    }

    play () {
        let audio = this.audio
        audio.play()
    }
    pause () {
        let audio = this.audio
        audio.pause()
    }

    setProgress () {
        let self = this
        let duration = self.audio.duration
        let currTime = self.audio.currentTime
        if (currTime < duration) {
            let playTime = self.getTime(parseInt(currTime))
            self.warp.find('.remain-time').html(playTime)
            let w = (currTime / duration) * 100
            self.warp.find('.progress-played').css({'width': `${w}%`})
        } else {
            self.audio.currentTime = 0
            self.audio.play()
            self.warp.find('.progress-played').css({'width': `0%`})
        }
    }

    // PC端设置进度条
    setTimeOnPc (e) {
        clearInterval(this.timeId)
        let audio = this.audio
        let w = ((e.pageX - this.warp.find('.progress').offset().left) / this.warp.find('.progress').width())
        this.warp.find('.progress-played').css({'width': `${w * 100}%`})
        let duration = this.audio.duration
        let currTime = duration * w
        audio.currentTime = currTime
        audio.play()
        this.setProgress()
        self.timeId = setInterval(() => {
            this.setProgress()
        }, 1000)
        this.warp.find('.play-btn').removeClass('icon-play').addClass('icon-pause')
        this.paused = false
    }

    getTime (musicTime) {
        // let musicTime = this.duration
        if (musicTime) {
            if (musicTime < 60) {
                musicTime = `00:${musicTime < 10 ? `0${musicTime}` : musicTime}`
            } else {
                musicTime = `${parseInt(musicTime / 60) < 10 ? `0${parseInt(musicTime / 60)}` : parseInt(musicTime / 60)}:${musicTime % 60 < 10 ? `0${musicTime % 60}` : musicTime % 60}`
            }
            return musicTime
        } else {
            return `00:00`
        }
    }
}

export {
    ad,
    relatedNews,
    NewsAuthor,
    AsideMarked,
    Reply,
    MusicPlay
}
