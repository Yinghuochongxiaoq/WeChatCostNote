var app = getApp();
Page({
    data: {
        userInfo: app.globalData.userInfo,
        statisticsModel: {},
        channelAcount: [],

        pulldownrefresh: false
    },
    onLoad: function() {
        var self = this;
        self.setData({
            userInfo: app.globalData.userInfo
        });
    },
    onShow: function() {
        this.getStatistics()
    },
    onPullDownRefresh: function() {
        this.setData({
            pulldownrefresh: true
        })
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
                //停止刷新
                if (self.data.pulldownrefresh) {
                    wx.stopPullDownRefresh()
                }
                if (res.data.resultCode == 0) {
                    self.setData({
                        channelAcount: res.data.data.channelAcount,
                        statisticsModel: res.data.data.statisticsModel,
                        pulldownrefresh: false
                    })
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
    handleNavigateClick: function() {
        wx.navigateTo({
            url: "/pages/costchannel/edit?id=0"
        });
    },
    onShareAppMessage() {     
        return {    
            title: '记录你的一点一滴~',
            desc: '记录你的一点一滴~',
            path: 'pages/index/index',
            imageUrl: '/images/share.jpg'   
        }   
    }
})