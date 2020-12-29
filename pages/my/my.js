var app = getApp();
Page({
    data: {
        userInfo: app.globalData,
        single: false
    },
    onLoad: function () {
        this.setData({
            userInfo: app.globalData.userInfo
        });
    },
    onShow: function () {
        this.setData({
            userInfo: app.globalData.userInfo
        });
        var self = this;
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
    handleToHome: function () {
        wx.reLaunch({
            url: '/pages/index/index'
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
    onShareAppMessage() {
        return {
            title: '记录你的一点一滴~',
            desc: '记录你的一点一滴~',
            path: 'pages/index/index',
            imageUrl: app.globalData.shareImgUrl
        }
    }
});