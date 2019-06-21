var app = getApp();
Page({
    data: {
        dataList: [],
        pageCount: 0,
        pageIndex: 0,
        pageSize: 10,
        costType: -1,
        spendType: -1,
        costChannel: -1
    },
    onLoad: function () {
        
        this.searchCostNoteData(true)
    },
    onPullDownRefresh() {
        this.setData({
            pageIndex: 0,
            pageSize: 10
        })
        this.searchCostNoteData(true)
    },
    onReachBottom() {
        if (this.data.pageIndex > this.data.pageCount) {
            this.searchCostNoteData(false)
        } else {
            wx.showToast({
                title: '没有更多数据了~',
                icon: 'none',
                duration: 2000
            })
        }
    },
    searchCostNoteData(refresh) {
        var self = this;
        // 请求数据，并渲染
        wx.request({
            url: app.globalData.api + '/Account/GetCostPage',
            data: {
                token: app.globalData.userInfo.token,
                pageIndex: self.data.pageIndex,
                pageSize: self.data.pageSize,
                costType: self.data.costType,
                spendType: self.data.spendType,
                costChannel: self.data.costChannel
            },
            method: 'GET',
            success: function (res) {
                if (res.data.resultCode == 0) {
                    var arr = self.data.dataList;
                    if (!refresh) {
                        arr.push(res.data.data.dataList)
                    } else {
                        arr = res.data.data.dataList
                    }
                    self.setData({
                        dataList: arr,
                        statisticsModel: res.data.data.statisticsModel,
                        pageCount: res.data.data.pageCount,
                        pageIndex: self.data.pageIndex + 1
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
    }
})