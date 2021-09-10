const util = require("../../utils/util");
var app = getApp();
Page({
    data: {
        userInfo: app.globalData.userInfo,
        //是否在进行下拉刷新,默认否
        pullDownRefresh: false,
        detailHistory: []
    },
    onLoad: function () {
        var self = this;
        //检查token是否存在
        var userInfo = util.getStorageSync("userInfo");
        if (userInfo != null && app.globalData.userInfo) {
            self.setData({
                userInfo: app.globalData.userInfo,
            });
        }
    },
    onShow: function () {
        this.getCarHistory();
    },
    onPullDownRefresh: function () {
        this.setData({
            pullDownRefresh: true
        });
        this.getCarHistory();
    },
    getCarHistory: function () {
        var self = this;
        // 请求数据，并渲染
        wx.request({
            url: app.globalData.api + '/CarNotice/GetCarHistory',
            data: {
                token: app.globalData.userInfo.token
            },
            method: 'GET',
            success: function (res) {
                if (res.data.resultCode == 0) {
                    //对返回数据排序
                    var detailList = [];
                    if (res.data.data && res.data.data.length > 0) {
                        detailList = res.data.data;
                    }
                    self.setData({
                        detailHistory: detailList,
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
    onShareAppMessage() {
        return {
            title: '记录你的一点一滴~',
            desc: '记录你的一点一滴~',
            path: 'pages/index/index',
            imageUrl: app.globalData.shareImgUrl
        };
    }
});