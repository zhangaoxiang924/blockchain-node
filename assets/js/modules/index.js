/**
 * Author：tantingting
 * Time：2018/4/16
 * Description：Description
 */

import {axiosAjax, proxyUrl, formatDate, fomartQuery} from '../public/public'
import Cookies from 'js-cookie'

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
            itemStr += `<a target="_blank" class="clearfix news-item" href="/newsdetail/${item.id}.html"><span class="dot"></span><div><div class="news-title">${item.title}</div><p>${item.author}丨${!item.createTime ? '' : formatDate(item.createTime, '.')}</p></div></a>`
        })
        str = `<div class="news-list-contain">${itemStr}</div>`
    } else {
        arr.map((item) => {
            itemStr += `<a class="list-box" target="_blank" href="/newsdetail/${item.id}.html"><div><div class="left-img"><img src="${!item.coverPic ? `http://static.huoxing24.com/images/2018/03/05/1520243882098653.svg` : JSON.parse(item.coverPic).pc}" alt=""></div><span class="right-text">${item.title}</span></div></a>`
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
            if (!Cookies.get('hx_user_token')) {
                $('#loginBlock').css({'display': 'block'})
                $('#loginModal h1').html('登录')
                $('#registerModal').css({'display': 'none'})
                $('#loginModal').css({'display': 'block'})
                return
            }
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
            'passportid': !Cookies.get('hx_user_id') ? '' : Cookies.get('hx_user_id'),
            'token': !Cookies.get('hx_user_token') ? '' : Cookies.get('hx_user_token'),
            'authorId': this.info.passportId
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
}

export {
    ad,
    relatedNews,
    NewsAuthor
}
