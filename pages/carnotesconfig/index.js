const util = require("../../utils/util");
var app = getApp();
Page({
    data: {
        userInfo: app.globalData.userInfo,
        //是否在进行下拉刷新,默认否
        pullDownRefresh: false,
        carList: [],
        scrollTop: 0
    },
    onLoad: function () {
        var self = this;
        //检查token是否存在
        var userInfo = util.getStorageSync("userInfo");
        if (userInfo != null && app.globalData.userInfo) {
            self.setData({
                userInfo: app.globalData.userInfo
            });
        }
    },
    //页面滚动执行方式
    onPageScroll(event) {
        this.setData({
            scrollTop: event.scrollTop
        });
    },
    onShow: function () {
        this.getCarConfig();
    },
    onPullDownRefresh: function () {
        this.setData({
            pullDownRefresh: true
        });
        this.getCarConfig();
    },
    getCarConfig: function () {
        var self = this;
        // 请求数据，并渲染
        wx.request({
            url: app.globalData.api + '/CarNotice/GetAllCarNoticeConfig',
            data: {
                token: app.globalData.userInfo.token
            },
            method: 'GET',
            success: function (res) {
                if (res.data.resultCode == 0) {
                    //对返回数据排序
                    var carList = [];
                    if (res.data.data && res.data.data.length > 0) {
                        carList = res.data.data;
                    }
                    self.setData({
                        carList: carList,
                        pullDownRefresh: false
                    });
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 2000
                    });
                }
            },
            complete: function () {
                //停止刷新
                if (self.data.pullDownRefresh) {
                    wx.stopPullDownRefresh();
                }
            }
        });
    },
    onChangeSwich(event) {
        var that = this;
        var detail = event.detail;
        var id = event.target.dataset.id;
        var index = event.target.dataset.index;
        var value = event.target.dataset.value;
        var strSwich = "carList[" + index + "].interimswich";
        wx.request({
            url: app.globalData.api + '/CarNotice/SwichCarNoticeInterim',
            data: {
                token: app.globalData.userInfo.token,
                id: id,
                swich: detail.value ? 1 : 0
            },
            method: 'GET',
            success: function (res) {
                if (res.data.resultCode == 0) {
                    that.setData({
                        [strSwich]: value == 1 ? 0 : 1
                    });
                    wx.showToast({
                        title: res.data.message,
                        icon: 'success',
                        duration: 2000
                    });
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 2000
                    });
                }
            }
        });
    },
    handleAddClick: function () {
        wx.navigateTo({
            url: "/pages/carnotesconfig/edit?id=0"
        });
    },
    onShareAppMessage() {
        return {
            title: '记录你的一点一滴~',
            desc: '记录你的一点一滴~',
            path: 'pages/index/index',
            imageUrl: app.globalData.shareImgUrl
        };
    }
});