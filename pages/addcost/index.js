const util = require("../../utils/util");
var app = getApp();
var dateTimePicker = require('../../utils/dateTimePicker.js');

Page({
    data: {
        costcontentmodel: {
            Cost: '',
            CostAddress: "",
            CostChannel: -1,
            CostThing: "",
            CostTime: "",
            CostType: -1,
            Id: 0,
            SpendType: 0,
            LinkCostChannel: 0,
            Token: ''
        },
        costTypemultiIndex: 0,
        costTypemultiArray: ['请选择'],
        costTypeObjectMultiArray: [],
        costTypeIdList: [-1],

        channelmultiIndex: 0,
        linkchannelIndex: 0,
        channelmultiArray: ['请选择'],
        channelObjectMultiArray: [],
        channelIdList: [-1],

        date: '2018-10-01',
        time: '12:00',
        dateTimeArray1: null,
        dateTime1: null,
        startYear: 2000,
        endYear: 2050,

        isSaving: false,
        //加载了地图
        isLoadingMap: false,
        isLogin: false
    },
    onLoad() {
        // 获取完整的年月日 时分秒，以及默认显示的数组
        var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
        // 精确到分的处理，将数组的秒去掉
        obj1.dateTimeArray.pop();
        obj1.dateTime.pop();

        //检查token是否存在
        var isLogin = false;
        var token = "";
        var userInfo = util.getStorageSync("userInfo");
        if (userInfo != null) {
            isLogin = true;
            token = app.globalData.userInfo.token;
        }
        this.setData({
            dateTimeArray1: obj1.dateTimeArray,
            dateTime1: obj1.dateTime,
            "costcontentmodel.Token": token,
            "costcontentmodel.CostTime": obj1.dateTimeArray[0][obj1.dateTime[0]] + '-' + obj1.dateTimeArray[1][obj1.dateTime[1]] + '-' + obj1.dateTimeArray[2][obj1.dateTime[2]] + ' ' + obj1.dateTimeArray[3][obj1.dateTime[3]] + ':' + obj1.dateTimeArray[4][obj1.dateTime[4]] + ':00',
            isLogin: isLogin
        });

    },
    onShow: function () {
        if (!this.data.isLogin) {
            return;
        }
        //获取类型，账户
        this.getAllCostType()
    },
    //选择获取地理位置
    getAddress: function () {
        var that = this;
        that.setData({
            isLoadingMap: true
        })
        that.getPermission(that); //传入that值可以在app.js页面直接设置内容getPermission可以写在全局函数中    
    },
    //获取用户地理位置权限
    getPermission: function (obj) {
        wx.chooseLocation({
            success: function (res) {
                obj.setData({
                    "costcontentmodel.CostAddress": res.address //调用成功直接设置地址
                })
            },
            fail: function () {
                wx.getSetting({
                    success: function (res) {
                        var statu = res.authSetting;
                        if (!statu['scope.userLocation']) {
                            wx.showModal({
                                title: '是否授权当前位置',
                                content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
                                success: function (tip) {
                                    if (tip.confirm) {
                                        wx.openSetting({
                                            success: function (data) {
                                                //防止重新加载收支类型覆盖原有已选项
                                                obj.setData({
                                                    isLoadingMap: true
                                                });
                                                if (data.authSetting["scope.userLocation"] === true) {
                                                    wx.showToast({
                                                        title: '授权成功',
                                                        icon: 'success',
                                                        duration: 1000
                                                    });
                                                    //授权成功之后，再调用chooseLocation选择地方
                                                    wx.chooseLocation({
                                                        success: function (res) {
                                                            obj.setData({
                                                                "costcontentmodel.CostAddress": res.address
                                                            })
                                                        },
                                                    });
                                                } else {
                                                    //申请授权
                                                    wx.authorize({
                                                        scope: 'scope.userLocation',
                                                        success() {
                                                            //授权成功之后，再调用chooseLocation选择地方
                                                            wx.chooseLocation({
                                                                success: function (res) {
                                                                    obj.setData({
                                                                        "costcontentmodel.CostAddress": res.address
                                                                    });
                                                                },
                                                            });
                                                        },
                                                        fail() {
                                                            wx.showToast({
                                                                title: '授权失败',
                                                                icon: 'none',
                                                                duration: 1000
                                                            });
                                                        }
                                                    });
                                                }
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    },
                    fail: function (res) {
                        wx.showToast({
                            title: '调用授权窗口失败',
                            icon: 'none',
                            duration: 1000
                        });
                    }
                });
            }
        });
    },
    bindChannelPickerChange: function (e) {
        this.setData({
            channelmultiIndex: e.detail.value
        });
    },
    bindLinkChannelPickerChange: function (e) {
        this.setData({
            linkchannelIndex: e.detail.value
        });
    },
    changeCostTypeChange: function (e) {
        this.setData({
            costTypemultiIndex: e.detail.value
        });
    },
    changeCost: function (e) {
        this.setData({
            "costcontentmodel.Cost": e.detail.detail.value
        });
    },
    changeCostAddress: function (e) {
        this.setData({
            "costcontentmodel.CostAddress": e.detail.value
        });
    },
    changeCostThing: function (e) {
        this.setData({
            "costcontentmodel.CostThing": e.detail.detail.value
        })
    },
    getAllCostType() {
        if (this.data.isLoadingMap) {
            this.setData({
                isLoadingMap: false
            });
            return;
        }
        var self = this;
        wx.request({
            url: app.globalData.api + '/CostNote/GetCostChannelType',
            data: {
                token: app.globalData.userInfo.token,
                memberId: app.globalData.userInfo.accountId
            },
            method: 'GET',
            success: function (res) {
                if (res.data.resultCode == 0) {
                    var list = ['请选择']
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
                    self.changeSpendType(self.data.costcontentmodel.SpendType)
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
    changeDateTime(e) {
        this.setData({
            dateTime1: e.detail.value
        });
    },
    changeDateTimeColumn(e) {
        var arr = this.data.dateTime1,
            dateArr = this.data.dateTimeArray1;

        arr[e.detail.column] = e.detail.value;
        dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

        this.setData({
            dateTimeArray1: dateArr
        });
    },

    handleChange({
        detail
    }) {
        this.changeSpendType(detail.key)
    },
    changeSpendType(spendType) {
        var list = ['请选择']
        var idList = [-1]
        for (var i = 0; i < this.data.costTypeObjectMultiArray.length; i++) {
            if (this.data.costTypeObjectMultiArray[i].spendType == spendType) {
                list.push(this.data.costTypeObjectMultiArray[i].name)
                idList.push(this.data.costTypeObjectMultiArray[i].id)
            }
        }
        this.setData({
            costTypemultiArray: list,
            costTypemultiIndex: 0,
            costTypeIdList: idList,
            "costcontentmodel.SpendType": spendType
        })
    },
    handleSaveClick: function () {
        //拼接参数
        var self = this;
        if (!self.data.isLogin) {
            wx.showModal({
                title: '温馨提示',
                content: '您还没有登录，将无法获取用户标识，点击去登录前往登录。',
                confirmText: '去登录',
                success: function (res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '/pages/login/index'
                        });
                    }
                }
            });
            return;
        }
        self.data.costcontentmodel.CostTime = self.data.dateTimeArray1[0][self.data.dateTime1[0]] + '-' + self.data.dateTimeArray1[1][self.data.dateTime1[1]] + '-' + self.data.dateTimeArray1[2][self.data.dateTime1[2]] + ' ' + self.data.dateTimeArray1[3][self.data.dateTime1[3]] + ':' + self.data.dateTimeArray1[4][self.data.dateTime1[4]] + ':00';
        self.data.costcontentmodel.CostType = self.data.costTypeIdList[self.data.costTypemultiIndex];
        self.data.costcontentmodel.CostChannel = self.data.channelIdList[self.data.channelmultiIndex];
        self.data.costcontentmodel.LinkCostChannel = self.data.channelIdList[self.data.linkchannelIndex];
        self.setData({
            isSaving: true
        });
        wx.request({
            url: app.globalData.api + '/CostNote/AddCostInfo',
            data: self.data.costcontentmodel,
            method: 'POST',
            success: function (res) {
                if (res.data.resultCode == 0) {
                    wx.showToast({
                        title: '保存成功',
                        icon: 'success',
                        duration: 2000
                    });
                    self.initPage();
                    self.onLoad();
                    self.onShow();
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 2000
                    });
                    self.setData({
                        isSaving: false
                    });
                }
            }
        });
    },
    initPage: function () {
        var initData = {
            costcontentmodel: {
                Cost: '',
                CostAddress: "",
                CostChannel: -1,
                CostThing: "",
                CostTime: "",
                CostType: -1,
                Id: 0,
                SpendType: 0,
                LinkCostChannel: 0,
                Token: ''
            },

            costTypemultiIndex: 0,
            costTypemultiArray: ['请选择'],
            costTypeObjectMultiArray: [],
            costTypeIdList: [-1],

            channelmultiIndex: 0,
            linkchannelIndex: 0,
            channelmultiArray: ['请选择'],
            channelObjectMultiArray: [],
            channelIdList: [-1],

            date: '2018-10-01',
            time: '12:00',
            dateTimeArray1: null,
            dateTime1: null,
            startYear: 2000,
            endYear: 2050,

            isSaving: false,
            //加载了地图
            isLoadingMap: false
        };
        this.setData(initData);
    },
    onShareAppMessage() {
        return {
            title: '记录你的一点一滴~',
            desc: '记录你的一点一滴~',
            path: 'pages/index/index',
            imageUrl: app.globalData.shareImgUrl
        };
    }
});