var app = getApp();
Page({
    data: {
        spendType: 0,
        costTypemultiArray: [],
        costTypeObjectMultiArray: []
    },
    onLoad: function () {
        this.getAllCostType()
    },
    handlerSpendTypeChange: function ({
        detail
    }) {
        this.setData({
            spendType: detail.key
        })
        this.changeSpendType(detail.key)
    },
    changeSpendType: function (spendType) {
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
    getAllCostType: function () {
        var self = this;
        wx.request({
            url: app.globalData.api + '/CostNote/GetCostChannelType',
            data: {
                token: app.globalData.userInfo.token
            },
            method: 'GET',
            success: function (res) {
                if (res.data.resultCode == 0) {
                    self.setData({
                        costTypeObjectMultiArray: res.data.data.costTypeData
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
    handleNavigateClick:function(){
        wx.navigateTo({
            url: "/pages/costtype/edit?id=0"
         });
    },
    onShareAppMessage() {     
        return {    
            title: '记录生活印迹',
            desc: '在这里记录你的每一点一滴~',
            path: 'pages/index/index',
            imageUrl: '/images/share.jpg'   
        }   
    }
});