var app = getApp();
Page({
    data: {
        userInfo: app.globalData
    },
    onLoad: function () {
        this.setData({
            userInfo: app.globalData.userInfo
        });
    }
})