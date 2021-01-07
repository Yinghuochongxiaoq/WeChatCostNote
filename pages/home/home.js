const util = require("../../utils/util");
var app = getApp();
Page({
    data: {
        loading: true,
        dataList: [],
        pageCount: 0,
        pageIndex: 1,
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
        statisticsModel: {
            allCouldCost: 0,
            allInCost: 0,
            allOutCost: 0
        },

        pulldownrefresh: false,
        visibleShowDelete: false,
        deleteActions: [{
            name: '删除',
            color: '#ed3f14'
        }],
        //控制滑动 设置uncloseable为true时点击按钮不能关闭,必须联合toggle来实现
        toggle: false,
        //全局保存需要删除的记录
        deleteId: 0,

        //成员选择框
        showModalStatus: false,
        //成员昵称
        memberNickName: '全部',
        //家庭成员
        familyMembers: [],
        //是否显示家庭成员
        isShowFamilyMember: false,
        //选择成员id
        chooseMemberId: -1,

        //通知信息列表
        msgList: [],

        showDetail: false,
        showDetailModel: {},
        showDetailActions: [{
            name: '确定',
            color: '#2d8cf0',
        }],
        isLogin: false,
        noLoginDataList: []
    },
    onLoad: function () {
        //检查token是否存在
        var userInfo = util.getStorageSync("userInfo");
        if (userInfo != null) {
            this.setData({
                familyMembers: app.globalData.userInfo.wechatMemberList,
                isShowFamilyMember: app.globalData.userInfo.wechatMemberList && app.globalData.userInfo.wechatMemberList.length > 0,
                isLogin: true
            });
        }
    },

    /**
     * 没登录时的测试数据
     */
    noLoginData: function () {
        this.setData({
            statisticsModel: {
                allCouldCost: 100000,
                allInCost: 100000,
                allOutCost: 100000
            },
            noLoginDataList: [{
                    cost: 5200.52,
                    costAddress: "温馨的家，心灵港湾",
                    costChannelName: "微信账户",
                    costInOrOut: 1,
                    costThing: "闹新春抢红包",
                    costTime: "2020-02-27 17:25:00",
                    costTypeName: "收红包"
                },
                {
                    cost: 3900.75,
                    costAddress: "拉萨市山南市贡嘎县迎宾路",
                    costChannelName: "支付宝账户",
                    costInOrOut: 2,
                    costThing: "追风少年飞往西藏",
                    costTime: "2019-04-05 20:02:00",
                    costTypeName: "旅行"
                }
            ]
        });
    },

    /**
     * 选择成员
     * @param {any} e 
     */
    chooseMember: function (e) {
        var memberId = e.currentTarget.dataset.memberid;
        if (this.data.channelObjectMultiArray && this.data.channelObjectMultiArray.length > 0) {
            //不相等进行切换
            if (memberId != this.data.chooseMemberId) {
                var channelNamelist = ['全部']
                var channelIdList = [-1]
                for (var i = 0; i < this.data.channelObjectMultiArray.length; i++) {
                    if (memberId == -1 || memberId == this.data.channelObjectMultiArray[i].userId) {
                        channelNamelist.push(this.data.channelObjectMultiArray[i].costChannelName)
                        channelIdList.push(this.data.channelObjectMultiArray[i].id)
                    }
                }
                this.setData({
                    channelmultiArray: channelNamelist,
                    channelIdList: channelIdList
                });
            }
        }
        //选择了新的成员
        if (memberId != this.data.chooseMemberId) {
            this.setData({
                costTypemultiIndex: [0, 0],
                spendType: this.data.inoroutIdList[0],
                costType: this.data.costTypeIdList[0],
                costChannel: -1,
                channelmultiIndex: 0,
                pageIndex: 1,
                pageSize: 10,
                chooseMemberId: memberId,
                memberNickName: e.currentTarget.dataset.membername
            });
        }
        this.searchCostNoteData(true)
        var currentStatue = e.currentTarget.dataset.statue;
        this.util(currentStatue)
    },
    /**
     * 上拉选择成员
     * @param {any} e 
     */
    powerDrawer: function (e) {
        var currentStatue = e.currentTarget.dataset.statue;
        this.util(currentStatue)
    },
    util: function (currentStatue) {
        /* 动画部分 */
        // 第1步：创建动画实例 
        var animation = wx.createAnimation({
            duration: 150, //动画时长
            timingFunction: "linear", //线性
            delay: 0 //0则不延迟
        });

        // 第2步：这个动画实例赋给当前的动画实例
        this.animation = animation;

        // 第3步：执行第一组动画：Y轴偏移240px后(盒子高度是240px)，停
        animation.translateY(240).step();

        // 第4步：导出动画对象赋给数据对象储存
        this.setData({
            animationData: animation.export()
        });

        // 第5步：设置定时器到指定时候后，执行第二组动画
        setTimeout(function () {
            // 执行第二组动画：Y轴不偏移，停
            animation.translateY(0).step()
            // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
            this.setData({
                animationData: animation
            });

            //关闭抽屉
            if (currentStatue == "close") {
                this.setData({
                    showModalStatus: false
                });
            }
        }.bind(this), 200);

        // 显示抽屉
        if (currentStatue == "open") {
            this.setData({
                showModalStatus: true
            });
        }
    },
    /**
     * 取消删除
     */
    handleCancel: function () {
        this.setData({
            visibleShowDelete: false,
            toggle: this.data.toggle ? false : true,
            deleteId: 0
        });
    },
    /**
     * 确认删除
     */
    handleClickDelete: function () {
        self = this;
        const action = [...self.data.deleteActions];
        action[0].loading = true;

        self.setData({
            deleteActions: action
        });
        //提交删除
        wx.request({
            url: app.globalData.api + '/CostNote/DeleteCostInfo',
            data: {
                token: app.globalData.userInfo.token,
                id: self.data.deleteId
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
                    self.onPullDownRefresh()
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 2000
                    });
                }
                action[0].loading = false;
                self.setData({
                    visibleShowDelete: false,
                    deleteActions: action,
                    toggle: self.data.toggle ? false : true,
                    deleteId: 0
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
                    visibleShowDelete: false,
                    deleteActions: action,
                    toggle: self.data.toggle ? false : true,
                    deleteId: 0
                });
            }
        });
    },
    deleteActionsTap: function (e) {
        console.log(e)
        this.setData({
            visibleShowDelete: true,
            deleteId: e.currentTarget.id
        });
    },
    /**
     * 记录详情点击
     * @param {any} e 
     */
    onDetailTap: function (e) {
        var data = e.currentTarget.dataset;
        var that = this;
        var tempModelDetail = null;
        console.log(data);
        if (data) {
            tempModelDetail = that.data.dataList[data.index];
        }
        if (tempModelDetail) {
            that.setData({
                showDetail: true,
                showDetailModel: tempModelDetail,
            });
        } else {
            that.setData({
                showDetail: false,
                showDetailModel: {},
            });
        }
    },
    /**
     * 点击详情信息中的按钮
     * @param {any} param0 
     */
    detailHandleClick: function ({
        detail
    }) {
        var index = detail.index;
        if (index === 0) {
            this.setData({
                showDetail: false,
                showDetailModel: {}
            });
        }
    },
    onShow: function () {
        this.initPageData();
    },
    onPullDownRefresh: function () {
        this.initPageData();
    },
    onReachBottom: function () {
        if (this.data.pageIndex <= this.data.pageCount) {
            this.setData({
                loading: true
            });
            this.searchCostNoteData(false);
        } else {
            wx.showToast({
                title: '没有更多数据了~',
                icon: 'none',
                duration: 2000
            });
        }
    },
    searchCostNoteData: function (refresh) {
        var self = this;
        // 请求数据，并渲染
        wx.request({
            url: app.globalData.api + '/CostNote/GetCostPage',
            data: {
                token: app.globalData.userInfo.token,
                pageIndex: self.data.pageIndex,
                pageSize: self.data.pageSize,
                costType: self.data.costType,
                spendType: self.data.spendType,
                costChannel: self.data.costChannel,
                memberId: self.data.chooseMemberId
            },
            method: 'GET',
            success: function (res) {
                self.setData({
                    loading: false
                });
                //停止刷新
                if (self.data.pulldownrefresh) {
                    wx.stopPullDownRefresh();
                }
                if (res.data.resultCode == 0) {
                    var arr = self.data.dataList;
                    if (!refresh) {
                        res.data.data.dataList.forEach(element => {
                            arr.push(element);
                        });
                    } else {
                        arr = res.data.data.dataList;
                    }
                    self.setData({
                        dataList: arr,
                        statisticsModel: res.data.data.statisticsModel,
                        pageCount: res.data.data.pageCount,
                        pageIndex: self.data.pageIndex + 1,
                        loading: false,
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
            fail: function () {
                self.setData({
                    loading: false
                });
            }
        });
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
                    });
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
    getNoticeMsg: function () {
        var self = this;
        wx.request({
            url: app.globalData.api + '/CostNote/GetHomePageNotice',
            data: {
                token: app.globalData.userInfo.token
            },
            method: 'GET',
            success: function (res) {
                if (res.data.resultCode == 0) {
                    self.setData({
                        msgList: res.data.data.noticeList
                    })
                }
            }
        })
    },
    bindChannelPickerChange: function (e) {
        this.setData({
            channelmultiIndex: e.detail.value,
            costChannel: this.data.channelIdList[e.detail.value],
            pageIndex: 1,
            pageSize: 10
        })
        this.searchCostNoteData(true)
    },
    bindMultiPickerChange: function (e) {
        this.setData({
            costTypemultiIndex: e.detail.value,
            spendType: this.data.inoroutIdList[e.detail.value[0]],
            costType: this.data.costTypeIdList[e.detail.value[1]],
            pageIndex: 1,
            pageSize: 10
        })
        this.searchCostNoteData(true)
    },
    bindMultiPickerColumnChange: function (e) {
        switch (e.detail.column) {
            case 0:
                var list = ['全部']
                var idList = [-1]
                for (var i = 0; i < this.data.costTypeObjectMultiArray.length; i++) {
                    if ((this.data.chooseMemberId == -1 ||
                            this.data.costTypeObjectMultiArray[i].userId == this.data.chooseMemberId) &&
                        this.data.costTypeObjectMultiArray[i].spendType + 1 == e.detail.value) {
                        list.push(this.data.costTypeObjectMultiArray[i].name)
                        idList.push(this.data.costTypeObjectMultiArray[i].id)
                    }
                }
                this.setData({
                    "costTypemultiArray[1]": list,
                    "costTypemultiIndex[0]": e.detail.value,
                    "costTypemultiIndex[1]": 0,
                    costTypeIdList: idList
                });
        }
    },
    onShareAppMessage: function () {
        return {
            title: '记录你的一点一滴~',
            desc: '记录你的一点一滴~',
            path: 'pages/index/index',
            imageUrl: app.globalData.shareImgUrl
        };
    },
    initPageData: function () {
        this.setData({
            pageIndex: 1,
            pageSize: 10,
            pulldownrefresh: true
        });
        if (!this.data.isLogin) {
            this.noLoginData();
            return;
        }
        this.getNoticeMsg();
        this.getAllCostType();
        this.searchCostNoteData(true);
    }
});