//获取公共ui操作类实例
const _page = require('../../utils/abstract-page.js');
var modCalendar = require('../mod/calendar.js');
var util = require('../../utils/util.js');

//获取应用实例
const app = getApp();

Page(_page.initPage({
    data: {
        number: 0.1,
        workContent: '',
        isSaving: false,
        id: 0,
        date: new Date().toString()
    },
    methods: {},
    /**
     * 保存数据
     */
    handleSaveClick: function() {
        console.log(this.data);
        wx.navigateBack();
    },
    onLoad: function(options) {
        //初始化数据，如果传入的id大于0时
        if (options.id) {
            this.init(options.id);
        } else {
            this.defaultData();
        }
    },
    /**
     * 初始化数据
     * @param {number} id 
     */
    init: function(id) {
        var that = this;
        if (id && id > 0) {
            wx.request({
                url: app.globalData.api + '/CostNote/GetUserDailyHistoryInfoById',
                data: {
                    token: app.globalData.userInfo.token,
                    id: id
                },
                method: 'GET',
                success: function(res) {
                    if (res.data.resultCode == 0) {
                        that.setData({
                            number: res.data.data.dailyNumber,
                            workContent: res.data.data.dailyContent,
                            isSaving: false,
                            id: res.data.data.id,
                            date: res.data.data.dailyDate,
                            calendarDisplayTime: res.data.data.dailyDate,
                            calendarSelectedDate: res.data.data.dailyDate,
                            calendarSelectedDateStr: util.dateUtil.format(new Date(res.data.data.dailyDate), 'Y年M月D日')
                        });
                    } else {
                        wx.showToast({
                            title: res.data.message,
                            icon: 'none',
                            duration: 2000
                        });
                    }
                },
                fail: function() {
                    wx.showToast({
                        title: '网络异常',
                        icon: 'none',
                        duration: 2000
                    });
                }
            });
        } else {
            this.defaultData();
        }
    },
    /**
     * 处理默认数据
     */
    defaultData: function() {
        this.setData({
            number: 0.1,
            workContent: '',
            isSaving: false,
            id: 0,
            date: new Date().toString()
        });
    },
    handleChangeWorkNumber: function({ detail }) {
        this.setData({
            number: detail.value
        })
    },
    handleChangeWorkContent: function({ detail }) {
        this.setData({
            workContent: detail.value
        })
    }
}, {
    modCalendar: modCalendar
}));