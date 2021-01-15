const util = require("../../utils/util");
var app = getApp();
Page({
    data: {
        userInfo: null,
        single: false,
        isLogin: false,
        linkList: [{
            title: "关于我们",
            link: "./about"
        }]
    },
    onLoad: function () {
        //检查token是否存在
        var userInfo = util.getStorageSync("userInfo");
        if (userInfo != null) {
            this.setData({
                userInfo: app.globalData.userInfo,
                isLogin: true
            });
        }
        app.http('/ConfigFunction/MyConfigInfo', '', "GET")
            .then(res => {
                if (res.resultCode == 0) {
                    this.setData({
                        linkList: res.data
                    });
                }
            });
    },
    onShow: function () {
        var self = this;
        if (!this.data.isLogin) {
            return;
        }
        wx.request({
            url: app.globalData.api + '/CostNote/CheckUserTodayDailySign',
            data: {
                token: app.globalData.userInfo.token
            },
            method: 'GET',
            success: function (res) {
                if (res.data.resultCode == 0) {
                    var single = res.data.data.single;
                    self.setData({
                        single: single
                    });
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 2000
                    });
                }
            },
            fail: function () {
                wx.showToast({
                    title: '网络异常',
                    icon: 'none',
                    duration: 2000
                });
            }
        });
    },
    /**
     * 跳转到登录页
     */
    handleToLogin: function () {
        wx.clearStorageSync();
        wx.navigateTo({
            url: '/pages/login/index'
        });
    },
    handleToAddOrListDailyHistory: function () {
        console.log("handleToAddOrListDailyHistory");
        if (!this.data.single) {
            this.handleToAddDailyHistory();
        } else {
            wx.navigateTo({
                url: "/pages/calendar/calendar",
            });
        }
    },
    handleToAddDailyHistory: function () {
        console.log("handleToAddDailyHistory");
        wx.navigateTo({
            url: "/pages/registration/index",
        });
    },
    onShareAppMessage: function () {
        return {
            title: '记录你的一点一滴~',
            desc: '记录你的一点一滴~',
            path: 'pages/index/index',
            imageUrl: app.globalData.shareImgUrl
        };
    }
});