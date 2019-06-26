var app = getApp();
var dateTimePicker = require('../../utils/dateTimePicker.js');

Page({
    data: {
        costcontentmodel: {
            Cost: 28.69,
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

        isSaving: false
    },
    onLoad() {
        //获取类型，账户
        this.getAllCostType()

        // 获取完整的年月日 时分秒，以及默认显示的数组
        var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
        // 精确到分的处理，将数组的秒去掉
        obj1.dateTimeArray.pop();
        obj1.dateTime.pop();

        this.setData({
            dateTimeArray1: obj1.dateTimeArray,
            dateTime1: obj1.dateTime,
            "costcontentmodel.Token": app.globalData.userInfo.token
        });
    },
    bindChannelPickerChange: function (e) {
        this.setData({
            channelmultiIndex: e.detail.value
        })
    },
    bindLinkChannelPickerChange: function (e) {
        this.setData({
            linkchannelIndex: e.detail.value
        })
    },
    changeCostTypeChange: function (e) {
        this.setData({
            costTypemultiIndex: e.detail.value
        })
    },
    getAllCostType() {
        var self = this;
        wx.request({
            url: app.globalData.api + '/CostNote/GetCostChannelType',
            data: {
                token: app.globalData.userInfo.token
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
                    })
                    self.changeSpendType(self.data.costcontentmodel.SpendType)
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
                    })
                    self.initPage()
                    self.onLoad()
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 2000
                    })
                    self.setData({
                        isSaving: false
                    })
                }
            }
        })
    },
    initPage: function () {
        var initData = {
            costcontentmodel: {
                Cost: 23.67,
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

            isSaving: false
        };
        this.setData(initData)
    }
});