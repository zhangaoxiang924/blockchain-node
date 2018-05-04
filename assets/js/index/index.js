/**
 * Author：tantingting
 * Time：2018/4/24
 * Description：Description
 */

import {axiosAjax, proxyUrl, fomartQuery, cutString, getHourMinute} from '../public/public'
class NewsSwiper {
    constructor (warp) {
        this.warp = warp
        this.pageSize = 15
    }
    init () {
        this.getData()
    }

    // 初始化轮播图
    initSwiper () {
        let mySwiper = new Swiper(this.warp.find('.swiper-container'), {
            loop: true,
            autoplay: 6000,
            slidesPerView: 5,
            preventClicks: false,
            slidesPerGroup: 5,
            width: (232 + 8) * 5,
            initialSlide: 1,
            spaceBetween: 10,
            // 如果需要前进后退按钮
            nextButton: this.warp.find('.swiper-button-next'),
            prevButton: this.warp.find('.swiper-button-prev')
        })

        this.warp.on('mouseenter', function () {
            mySwiper.stopAutoplay()
        })
        this.warp.on('mouseleave', function () {
            mySwiper.startAutoplay()
        })
    }

    getItemStr (data) {
        let str = ''
        data.map((item) => {
            str += `<div class="swiper-slide comment-news">
                        <a target="_blank" href="/newsdetail?id=${item.id}">
                            <div class="img-div">
                                <img class="news-img" src="${!item.coverPic ? 'http://static.huoxing24.com/images/2018/03/05/1520243882098653.svg' : (JSON.parse(item.coverPic).pc_recommend || JSON.parse(item.coverPic).pc)}"alt="">
                            </div>
                            <span class="mode"></span>
                            <p class="title">${cutString(item.title, 75)}</p>
                        </a>
                    </div>`
        })
        return str
    }

    // 获取数据
    getData () {
        let self = this
        let sendDate = {
            pageSize: this.pageSize,
            recommend: 1
        }
        let url = `${proxyUrl}/info/news/shownews?${fomartQuery(sendDate)}`
        axiosAjax({
            type: 'post',
            url: url,
            formData: false,
            params: {},
            fn: function (resData) {
                if (resData.code === 1) {
                    let str = self.getItemStr(resData.obj.inforList)
                    self.warp.find('.swiper-wrapper').html(str)
                    self.initSwiper()
                }
            }
        })
    }
}

class RealTimeNews {
    constructor (warp) {
        this.warp = warp
        this.pageSize = 10
    }
    init () {
        this.getData()
    }

    getItemStr (data) {
        let str = ''
        data.map((d) => {
            let cont = !d.title ? d.content : `【${d.title}】${d.content}`
            str += `<div class="news-con clearfix">
                    <p>
                        <span>${getHourMinute(d.createdTime)}</span>&nbsp;&nbsp;|&nbsp;&nbsp;${cont}
                    </p>
                </div>`
        })
        return str
    }

    setPosTop (listLength) {
        let num = 0
        let self = this
        let setWarp = self.warp.find('.news-con-wrap')
        setInterval(function () {
            num++
            if (num === listLength) {
                num = 0
                setWarp.removeClass('active')
            } else {
                setWarp.addClass('active')
            }
            setWarp.css({'top': `-${num * 45}px`})
        }, 5000)
    }

    // 获取数据
    getData () {
        let self = this
        let sendDate = {
            pageSize: this.pageSize,
            currentPage: 1,
            passportid: ''
        }
        let url = `${proxyUrl}/info/lives/showlives?${fomartQuery(sendDate)}`
        axiosAjax({
            type: 'post',
            url: url,
            formData: false,
            params: {},
            fn: function (resData) {
                if (resData.code === 1) {
                    let warpHtml = ''
                    if (!resData.obj.inforList.length) {
                        warpHtml = `<div class="nodata">暂无实时讯息</div>`
                    } else {
                        let str = self.getItemStr(resData.obj.inforList)
                        warpHtml = ` <a target="_blank" href="/livenews" class="news-con-wrap active">${str}</a>`
                    }
                    self.warp.html(warpHtml)
                    self.setPosTop(resData.obj.inforList.length)
                }
            }
        })
    }
}

export {
    NewsSwiper,
    RealTimeNews
}
