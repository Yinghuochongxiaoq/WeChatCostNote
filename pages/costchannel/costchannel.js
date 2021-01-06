const util = require("../../utils/util");
var app = getApp();
Page({
    data: {
        userInfo: app.globalData.userInfo,
        statisticsModel: [],
        //是否在进行下拉刷新,默认否
        pulldownrefresh: false,
        //家庭成员
        familyMembers: [],
        //是否显示家庭成员
        isShowFamilyMember: false,
        currentTab: 0,
        navScrollLeft: 0,
        isLogin: false,
        noLoginDataModel: {}
    },
    onLoad: function () {
        var self = this;
        //检查token是否存在
        var userInfo = util.getStorageSync("userInfo");
        if (userInfo != null) {
            var hadBindFamily = app.globalData.userInfo.wechatMemberList && app.globalData.userInfo.wechatMemberList.length > 0;
            var allSelecter = {
                accountId: hadBindFamily ? -1 : app.globalData.userInfo.accountId,
                avatarUrl: "https://aivabc.com/Uploadfile/ShareDetailImage/20190713/6369864601072339692522601.png",
                codeTimeSpan: null,
                nickName: "一大家子",
                token: null
            };
            var fullfamilyMember = [];
            fullfamilyMember.push(allSelecter);
            fullfamilyMember = fullfamilyMember.concat(app.globalData.userInfo.wechatMemberList);
            self.setData({
                userInfo: app.globalData.userInfo,
                familyMembers: fullfamilyMember,
                isShowFamilyMember: hadBindFamily,
                isLogin: true
            });
        }

        wx.getSystemInfo({
            success: (res) => {
                this.setData({
                    pixelRatio: res.pixelRatio,
                    windowHeight: res.windowHeight,
                    windowWidth: res.windowWidth
                });
            },
        });
    },
    switchNav(event) {
        var cur = event.currentTarget.dataset.current;
        //每个tab选项宽度占1/N
        var singleNavWidth = this.data.windowWidth / this.data.familyMembers.length;
        //tab选项居中                            
        this.setData({
            navScrollLeft: (cur - 2) * singleNavWidth
        });
        if (this.data.currentTab == cur) {
            return false;
        } else {
            this.setData({
                currentTab: cur
            });
        }
    },
    switchTab(event) {
        var cur = event.detail.current;
        var singleNavWidth = this.data.windowWidth / this.data.familyMembers.length;
        this.setData({
            currentTab: cur,
            navScrollLeft: (cur - 2) * singleNavWidth
        });
    },
    onShow: function () {
        if (!this.data.isLogin) {
            this.noLoginData();
            return;
        }
        this.getStatistics();
    },
    /**
     * 没登录时的测试数据
     */
    noLoginData: function () {
        var statisticsModel = {
            allCouldCost: 100000,
            allInCost: 100000,
            allOutCost: 100000
        };
        var channelAcountList = [{
            costChannelName: '微信账户',
            costCount: 9000
        }, {
            costChannelName: '支付宝账户',
            costCount: 1500
        }, {
            costChannelName: '中国银行信用卡',
            costCount: -6857
        }, {
            costChannelName: '京东金融',
            costCount: 20000
        }, {
            costChannelName: '应收借款',
            costCount: 500
        }, {
            costChannelName: '企业年金账户',
            costCount: 800
        }];
        var noLoginDataModel = {
            statisticsModel: statisticsModel,
            channelAcount: channelAcountList
        };
        this.setData({
            noLoginDataModel: noLoginDataModel
        });
    },
    onPullDownRefresh: function () {
        this.setData({
            pulldownrefresh: true
        });
        this.getStatistics();
    },
    getStatistics: function () {
        var self = this;
        // 请求数据，并渲染
        wx.request({
            url: app.globalData.api + '/CostNote/StatisticsCostChannel',
            data: {
                token: app.globalData.userInfo.token
            },
            method: 'GET',
            success: function (res) {
                if (res.data.resultCode == 0) {
                    var resulteData = [];
                    //对返回数据排序
                    if (self.data.familyMembers && self.data.familyMembers.length > 0 && res.data.data && res.data.data.length > 0) {
                        self.data.familyMembers.forEach(element => {
                            for (var j = 0; j < res.data.data.length; j++) {
                                var itemData = res.data.data[j];
                                if (element.accountId == itemData.userId) {
                                    resulteData.push(itemData);
                                    break;
                                }
                            }
                        });
                    }
                    self.setData({
                        statisticsModel: resulteData,
                        pulldownrefresh: false
                    });
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 2000
                    });
                }
            },
            complete: function () {
                //停止刷新
                if (self.data.pulldownrefresh) {
                    wx.stopPullDownRefresh();
                }
            }
        });
    },
    handleNavigateClick: function () {
        wx.navigateTo({
            url: "/pages/costchannel/edit?id=0"
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