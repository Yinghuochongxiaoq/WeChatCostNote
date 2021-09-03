const util = require("../../utils/util");
var app = getApp();
Page({
    data: {
        userInfo: app.globalData.userInfo,
        //是否在进行下拉刷新,默认否
        pullDownRefresh: false,
        //家庭成员
        familyMembers: [],
        currentTab: 0,
        navScrollLeft: 0,
        isLogin: false,
        noLoginDataModel: {},
        title: '吾计备忘录',
        desc: '无论多么风光或是糟糕、快乐或者失意，过了这一刻都成往事。除了你自己，谁又会更在乎？过不去的不是一个坎，而是你心中的执迷。',
        showDetail: false,
        showDetailId: 0,
        showDetailContent: '',
        showDetailActions: [{
                name: '取消预约',
                color: '#FF7B0E'
            },
            {
                name: '关闭',
                color: '#19be6b'
            }
        ],
        showDelete: false,
        showDeleteActions: [{
            name: '确定取消预约',
            color: '#ed3f14',
            loading: false
        }, {
            name: '关闭'
        }],
        showAdd: false,
        showAddActions: [{
            name: '确定预约',
            color: '#ed3f14',
            loading: false
        }, {
            name: '关闭'
        }],
    },
    onLoad: function () {
        var self = this;
        //检查token是否存在
        var userInfo = util.getStorageSync("userInfo");
        if (userInfo != null && app.globalData.userInfo) {
            var one = {
                id: 1,
                nickName: "3030车",
                start: "2021-09-03 16:00:00",
                end: "2021-09-03 23:59:59",
                dateTimeRange: [{
                    id: 1,
                    timeRange: "12:00-14:00",
                    userId: 100,
                    userHeadImage: "https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132",
                    nickName: "张三",
                    hadFlag: true
                }, {
                    id: 2,
                    timeRange: "14:00-16:00",
                    hadFlag: false
                }, {
                    id: 3,
                    timeRange: "16:00-18:00",
                    userId: 101,
                    userHeadImage: "https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132",
                    nickName: "王五",
                    hadFlag: true
                }]
            };
            var two = {
                id: 2,
                nickName: "925车",
                start: "2021-09-03 16:00:00",
                end: "2021-09-03 23:59:59",
                dateTimeRange: [{
                    id: 1,
                    timeRange: "12:00-14:00",
                    userId: 1,
                    userHeadImage: "https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132",
                    hadFlag: true,
                    nickName: "陈世",
                }, {
                    id: 2,
                    timeRange: "14:00-16:00",
                    hadFlag: false
                }, {
                    id: 3,
                    timeRange: "16:00-18:00",
                    userId: 101,
                    nickName: "谢很分",
                    userHeadImage: "https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132",
                    hadFlag: true
                }, {
                    id: 2,
                    timeRange: "14:00-16:00",
                    hadFlag: false
                }, {
                    id: 2,
                    timeRange: "14:00-16:00",
                    hadFlag: false
                }, {
                    id: 2,
                    timeRange: "14:00-16:00",
                    hadFlag: false
                }, {
                    id: 2,
                    timeRange: "14:00-16:00",
                    hadFlag: false
                }, {
                    id: 2,
                    timeRange: "14:00-16:00",
                    hadFlag: false
                }, {
                    id: 2,
                    timeRange: "14:00-16:00",
                    hadFlag: false
                }, {
                    id: 2,
                    timeRange: "14:00-16:00",
                    hadFlag: false
                }, {
                    id: 2,
                    timeRange: "14:00-16:00",
                    hadFlag: false
                }, {
                    id: 2,
                    timeRange: "14:00-16:00",
                    hadFlag: false
                }, {
                    id: 2,
                    timeRange: "14:00-16:00",
                    hadFlag: false
                }, {
                    id: 2,
                    timeRange: "14:00-16:00",
                    hadFlag: false
                }, ]
            };
            var fullfamilyMember = [];
            fullfamilyMember.push(one);
            fullfamilyMember.push(two);


            self.setData({
                userInfo: app.globalData.userInfo,
                familyMembers: fullfamilyMember,
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
        this.getCarConfig();
    },
    /**
     * 没登录时的测试数据
     */
    noLoginData: function () {
        var noLoginDataModel = [{
            timeRange: "00:00-08:00",
            hadFlag: false
        }, {
            timeRange: "08:01-16:00",
            hadFlag: false
        }, {
            timeRange: "16:01-24:00",
            hadFlag: false
        }];
        this.setData({
            noLoginDataModel: noLoginDataModel
        });
    },
    onPullDownRefresh: function () {
        this.setData({
            pullDownRefresh: true
        });
        this.getCarConfig();
    },
    getCarConfig: function () {
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
                        pullDownRefresh: false
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
                if (self.data.pullDownRefresh) {
                    wx.stopPullDownRefresh();
                }
            }
        });
    },
    onEveryTimeTap: function (e) {
        var data = e.currentTarget.dataset;
        console.log(data)
        let start = new Date(data.start);
        let end = new Date(data.end);
        let hadFlag = data.had_flag;
        let userId = data.user_id;
        let id = data.id;
        let car_name = data.car_name;
        let time_range = data.time_range;
        //已经有人选中了
        if (hadFlag) {
            //判断是自己
            if (this.data.userInfo.accountId == userId) {
                //弹出对话框，进行取消预约操作
                this.setData({
                    showDetail: true,
                    showDetailId: id,
                    showDetailContent: "预约成功" + car_name + "时间段" + time_range,
                });
            }
        } else {
            let checkTime = this.judgeTime(start, end);
            if (checkTime) {
                console.log('时间允许');
                this.setData({
                    showAdd: true,
                    showDetailId: id
                });
            }
        }

    },
    judgeTime: function (start, end) {
        let nowTime = new Date();
        if (nowTime.getTime() < start.getTime()) {
            //时间还没有到
            wx.showToast({
                title: '本时段还未开通,请在' + util.formatTime(start) + "后添加",
                icon: 'none',
                duration: 2000
            });
            return false;
        } else if (nowTime.getTime() > end.getTime()) {
            wx.showToast({
                title: '本时段已结束',
                icon: 'none',
                duration: 2000
            });
            return false;
        }
        return true;
    },
    detailHandleClick: function ({
        detail
    }) {
        var index = detail.index;
        if (index === 0) {
            this.setData({
                showDelete: true
            });
        } else if (index === 1) {
            this.setData({
                showDetail: false,
                showDetailId: 0,
                showDetailContent: '',
                showDelete: false
            });
        }
    },
    deleteHandlerClick: function ({
        detail
    }) {
        var self = this;
        if (detail.index === 1) {
            self.setData({
                showDelete: false
            });
        } else {
            if (self.data.validDayId < 1) {
                self.setData({
                    showDelete: false
                });
            }
            var action = [...this.data.showDeleteActions];
            action[0].loading = true;

            self.setData({
                showDeleteActions: action
            });
            //提交删除
            wx.request({
                url: app.globalData.api + '/SCostNote/DeleteDetailHistoryInfo',
                data: {
                    token: app.globalData.userInfo.token,
                    id: self.data.showDetailId
                },
                method: 'GET',
                success: function (res) {
                    if (res.data.resultCode == 0) {
                        wx.showToast({
                            title: '删除成功',
                            icon: 'success',
                            duration: 2000
                        });
                        //刷新页面
                        self.onPullDownRefresh();
                    } else {
                        wx.showToast({
                            title: res.data.message,
                            icon: 'none',
                            duration: 2000
                        });
                    }
                    action[0].loading = false;
                    self.setData({
                        showDelete: false,
                        showDeleteActions: action,
                        showDetail: false,
                        showDetailId: 0,
                        showDetailTitle: '',
                        showDetailContent: ''
                    });
                },
                fail: function () {
                    wx.showToast({
                        title: '网络异常',
                        icon: 'none',
                        duration: 2000
                    });
                    action[0].loading = false;
                    self.setData({
                        showDelete: false,
                        showDeleteActions: action
                    });
                }
            });
        }
    },
    addHandlerClick: function ({
        detail
    }) {
        var self = this;
        if (detail.index == 1) {
            self.setData({
                showAdd: false,
                showDetailId: 0,
            });
        } else {
            if (self.data.showDetailId < 1) {
                self.setData({
                    showAdd: false,
                    showDetailId: 0,
                });
            }
            var action = [...this.data.showAddActions];
            action[0].loading = true;

            self.setData({
                showAddActions: action
            });
            wx.request({
                url: app.globalData.api + '/SCostNote/DeleteDetailHistoryInfo',
                data: {
                    token: app.globalData.userInfo.token,
                    id: self.data.showDetailId
                },
                method: 'GET',
                success: function (res) {
                    if (res.data.resultCode == 0) {
                        wx.showToast({
                            title: '删除成功',
                            icon: 'success',
                            duration: 2000
                        });
                        //刷新页面
                        self.onPullDownRefresh();
                    } else {
                        wx.showToast({
                            title: res.data.message,
                            icon: 'none',
                            duration: 2000
                        });
                    }
                    action[0].loading = false;
                    self.setData({
                        showAdd: false,
                        showDetailId: 0,
                        showAddActions: action
                    });
                },
                fail: function () {
                    wx.showToast({
                        title: '网络异常',
                        icon: 'none',
                        duration: 2000
                    });
                    action[0].loading = false;
                    self.setData({
                        showAdd: false,
                        showDetailId: 0,
                        showAddActions: action
                    });
                }
            });
        }
    },
    onShareAppMessage: function () {
        return {
            title: this.data.title,
            desc: this.data.desc,
            path: 'pages/carnotes/index',
            imageUrl: app.globalData.shareImgUrl
        };
    }
});