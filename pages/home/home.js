var app = getApp();
Page({
    data: {
        loading: true,
        dataList: [],
        pageCount: 0,
        pageIndex: 0,
        pageSize: 10,
        costType: -1,
        spendType: -1,
        costChannel: -1,

        costTypemultiIndex: [0, 0],
        costTypemultiArray: [
            ['全部', '支出', '收入'],
            ['全部']
        ],
        costTypeObjectMultiArray: [],
        costTypeIdList: [-1],
        inoroutIdList: [-1, 0, 1],

        channelmultiIndex: 0,
        channelmultiArray: ['全部'],
        channelObjectMultiArray: [],
        channelIdList: [-1],
        statisticsModel: {}
    },
    onLoad: function() {
        this.getAllCostType()
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
            this.setData({
                loading: true
            })
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
            success: function(res) {
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
                        pageIndex: self.data.pageIndex + 1,
                        loading: false,
                        statisticsModel: res.data.data.statisticsModel
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
    getAllCostType() {
        var self = this;
        wx.request({
            url: app.globalData.api + '/Account/GetCostChannelType',
            data: {
                token: app.globalData.userInfo.token
            },
            method: 'GET',
            success: function(res) {
                if (res.data.resultCode == 0) {
                    console.log(res.data)

                    var list = ['全部']
                    var idList = [-1]
                    for (var i = 0; i < res.data.data.channelData.length; i++) {
                        list.push(res.data.data.channelData[i].costChannelName)
                        idList.push(res.data.data.channelData[i].id)
                    }
                    self.setData({
                        costTypeObjectMultiArray: res.data.data.costTypeData,
                        channelObjectMultiArray: res.data.data.channelData,
                        channelmultiArray: list,
                        channelIdList: idList
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
    bindChannelPickerChange: function(e) {
        this.setData({
            channelmultiIndex: e.detail.value,
            costChannel: this.data.channelIdList[e.detail.value],
            pageIndex: 0,
            pageSize: 10
        })
        this.searchCostNoteData(true)
    },
    bindMultiPickerChange: function(e) {
        this.setData({
            costTypemultiIndex: e.detail.value,
            spendType: this.data.inoroutIdList[e.detail.value[0]],
            costType: this.data.costTypeIdList[e.detail.value[1]],
            pageIndex: 0,
            pageSize: 10
        })
        this.searchCostNoteData(true)
    },
    bindMultiPickerColumnChange: function(e) {
        switch (e.detail.column) {
            case 0:
                var list = ['全部']
                var idList = [-1]
                for (var i = 0; i < this.data.costTypeObjectMultiArray.length; i++) {
                    if (this.data.costTypeObjectMultiArray[i].spendType + 1 == e.detail.value) {
                        list.push(this.data.costTypeObjectMultiArray[i].name)
                        idList.push(this.data.costTypeObjectMultiArray[i].id)
                    }
                }
                this.setData({
                    "costTypemultiArray[1]": list,
                    "costTypemultiIndex[0]": e.detail.value,
                    "costTypemultiIndex[1]": 0,
                    costTypeIdList: idList
                })

        }
    }
})