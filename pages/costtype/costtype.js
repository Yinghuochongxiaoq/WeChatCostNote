var app = getApp();
Page({
    data: {
        spendType: 0,
        costTypemultiArray: [],
        costTypeObjectMultiArray: [],

        pulldownrefresh: false
    },
    onLoad: function() {
        this.getAllCostType()
    },
    onPullDownRefresh() {
        this.setData({
            pulldownrefresh: true
        })
        this.getAllCostType()
    },
    handlerSpendTypeChange: function({
        detail
    }) {
        this.setData({
            spendType: detail.key
        })
        this.changeSpendType(detail.key)
    },
    changeSpendType: function(spendType) {
        var typeList = [];
        for (var i = 0; i < this.data.costTypeObjectMultiArray.length; i++) {
            var temp = this.data.costTypeObjectMultiArray[i];
            if (temp.spendType != spendType) continue;
            typeList.push({
                id: temp.id,
                name: temp.name
            });
        }
        this.setData({
            costTypemultiArray: typeList
        })
    },
    getAllCostType: function() {
        var self = this;
        wx.request({
            url: app.globalData.api + '/CostNote/GetCostChannelType',
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
                        costTypeObjectMultiArray: res.data.data.costTypeData,
                        pulldownrefresh: false
                    })
                    self.changeSpendType(self.data.spendType)
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
            url: "/pages/costtype/edit?id=0"
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
});