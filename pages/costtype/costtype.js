const util = require("../../utils/util");
var app = getApp();
Page({
    data: {
        spendType: 1,
        costTypemultiArray: [],
        costTypeObjectMultiArray: [],

        pulldownrefresh: false,
        isLogin: false
    },
    onLoad: function () {
        //检查token是否存在
        var userInfo = util.getStorageSync("userInfo");
        if (userInfo != null) {
            this.setData({
                isLogin: true
            });
        }
    },
    onShow: function () {
        if (!this.data.isLogin) {
            this.noLoginData();
            return;
        }
        this.getAllCostType();
    },
    /**
     * 没登录时的测试数据
     */
    noLoginData: function () {
        this.setData({
            costTypemultiArray: [{
                name: '旅行',
                id: 0
            }, {
                name: '教育',
                id: 0
            }, {
                name: '餐饮',
                id: 0
            }, {
                name: '服饰',
                id: 0
            }, {
                name: '奢侈品',
                id: 0
            }]
        });
    },
    onPullDownRefresh: function () {
        if (!this.data.isLogin) {
            this.noLoginData();
            return;
        }
        this.setData({
            pulldownrefresh: true
        });
        this.getAllCostType();
    },
    handlerSpendTypeChange: function ({
        detail
    }) {
        this.setData({
            spendType: detail.key
        });
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
        });
    },
    getAllCostType: function () {
        var self = this;
        wx.request({
            url: app.globalData.api + '/CostNote/GetCostChannelType',
            data: {
                token: app.globalData.userInfo.token,
                memberId: app.globalData.userInfo.accountId
            },
            method: 'GET',
            success: function (res) {
                //停止刷新
                if (self.data.pulldownrefresh) {
                    wx.stopPullDownRefresh()
                }
                if (res.data.resultCode == 0) {
                    self.setData({
                        costTypeObjectMultiArray: res.data.data.costTypeData,
                        pulldownrefresh: false
                    });
                    self.changeSpendType(self.data.spendType);
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 2000
                    });
                }
            }
        });
    },
    handleNavigateClick: function () {
        wx.navigateTo({
            url: "/pages/costtype/edit?id=0"
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