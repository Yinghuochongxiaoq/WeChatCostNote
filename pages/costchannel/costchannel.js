var app = getApp();
Page({
    data: {
        userInfo: app.globalData,
        statisticsModel: {},
        channelAcount: []
    },
    onLoad: function() {
        var self = this;
        self.setData({
            userInfo: app.globalData.userInfo
        });
        this.getStatistics()
    },
    onPullDownRefresh: function() {
        console.log("开始刷新页面")
        this.getStatistics()
    },
    getStatistics: function() {
        var self = this;
        // 请求数据，并渲染
        wx.request({
            url: app.globalData.api + '/CostNote/StatisticsCostChannel',
            data: {
                token: app.globalData.userInfo.token
            },
            method: 'GET',
            success: function(res) {
                if (res.data.resultCode == 0) {
                    self.setData({
                        channelAcount: res.data.data.channelAcount,
                        statisticsModel: res.data.data.statisticsModel,
                    })
                    console.log(self.data)
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 2000
                    })
                }
            }
        })
    },
    onShareAppMessage() {     
        return {    
            title: '记录生活印迹',
            desc: '在这里记录你的每一点一滴~',
            path: 'pages/index/index',
            imageUrl: '/images/share.jpg'   
        }   
    }
})